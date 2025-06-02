import { Injectable, inject, OnDestroy } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import {
    Firestore,
    collection,
    doc,
    onSnapshot,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    DocumentReference
} from '@angular/fire/firestore';
import { DirectMessageInterface } from '../interfaces/message.interface';
import { ConversationInterface } from '../interfaces/conversation.interface';
import { AuthenticationService } from './authentication.service';
import { SignalsService } from './signals.service';
@Injectable({
  providedIn: 'root'
})
export class ConversationService {
  firestore: Firestore = inject(Firestore);
  authService = inject(AuthenticationService);
  signalService = inject(SignalsService);
  conversations: ConversationInterface[] = [];
  unsubscribeDirectMessages;

  constructor() {
    this.unsubscribeDirectMessages = this.subDirectMessages();
  }

  ngOnDestroy() {
    if (this.unsubscribeDirectMessages) {
      this.unsubscribeDirectMessages();
    }
  }

  subDirectMessages() {
    const q = query(this.getConversationRef(), orderBy('createdAt'));
    return onSnapshot(
      q,
      (snapshot) => {
        this.conversations = [];
        snapshot.forEach((element) => {
          const channel = element.data();
          this.conversations.push(this.setConversationObject(element.id, channel));
        });
        
      },
      (error) => {
        console.error('Firestore Error', error.message);
      }
    );
  }

  getConversationRef() {
    return collection(this.firestore, 'conversations');
  }

  getSingleDocRef(docId: string) {
    return doc(this.getConversationRef(), docId);
  }

  setConversationObject(id: string, conversationData: any): ConversationInterface {
    return {
      id: id,
      participants: conversationData.participants,
      messages: conversationData.messages,
    };
  }

  async addConversation(conversation: ConversationInterface): Promise<void | DocumentReference> {
    try {
      const conversationRef = await addDoc(this.getConversationRef(), conversation);
      return conversationRef;
    } catch (err) {
      console.error(err);
    }
  }

  async deleteConversation(docId: string) {
    try {
      await deleteDoc(this.getSingleDocRef(docId));
    } catch (err) {
      console.error(err);
    }
  }

  async updateConversation(channel: ConversationInterface) {
    if (channel.id) {
      try {
        let docRef = this.getSingleDocRef(channel.id);
        await updateDoc(docRef, this.getCleanJson(channel));
      } catch (err) {
        console.error(err);
      }
    }
  }

  getCleanJson(conversation: ConversationInterface) {
    return {
      participants: conversation.participants,
      messages: conversation.messages,
    };
  }

  // => Subcollection Channel Messages
  getDirectMessagesRef(id:string) {
    return collection(this.firestore,`conversations/${id}/messages`);
  }

  getConversationById(id: string) {
    return this.conversations.find(conversation => conversation.id === id);
  }

  getMessageById(id: string, messageId: string) {
    const conversation = this.getConversationById(id);
    if (!conversation || !conversation.messages) return;
    return conversation.messages.find((message : DirectMessageInterface ) => message.id === messageId);
  }

  subscribeToDirectMessages(conversationId: string) {
    const q = query(this.getDirectMessagesRef(conversationId), orderBy('createdAt'));
    return onSnapshot(q, (snapshot) => {
      const messages: DirectMessageInterface[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data() as DirectMessageInterface;
        messages.push({
          id: doc.id,
          text: data.text,
          createdAt: data.createdAt,
          senderId: data.senderId,
          reactions: data.reactions,
          replyTo: data.replyTo
        });
      });

      const conversation = this.getConversationById(conversationId);
      if (conversation) {
        conversation.messages = [...messages];
      }
    });
  }

  async loadCons(): Promise<void> {
    try {
      const querySnapshot = await getDocs(this.getConversationRef());

      this.conversations = querySnapshot.docs.map(docSnapshot => {
        const data = docSnapshot.data();
        return this.setConversationObject(docSnapshot.id, data);
      });

      console.log('conversations:', this.conversations);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  }

  async loadConversation(id: string): Promise<void> {
    this.subscribeToDirectMessages(id);
  }

  participant(conversation: ConversationInterface): any  {
    return conversation.participants.find((id: string) => id !== this.authService.userId)
  }

  async startNewConversation(id: string): Promise<void> {
    const currentUser = this.authService.userId;
    const existingConversation = this.conversations.find(con =>
      con.participants.includes(currentUser) && con.participants.includes(id)
    );

    if (existingConversation?.id) {
      await this.openConversation(existingConversation.id);
      return;
    }

    const newConversation: ConversationInterface = {
      participants: [currentUser, id]
    };

    await this.addConversation(newConversation);
    await this.loadCons();

    const createdConversation = this.conversations.find(con =>
      con.participants.includes(currentUser) && con.participants.includes(id)
    );

    if (createdConversation?.id) {
      await this.openConversation(createdConversation.id);
    } 
  }

  async openConversation(id: string): Promise<void> {
    await this.loadConversation(id);
    this.signalService.setConversationSignals(id);
  }

}
