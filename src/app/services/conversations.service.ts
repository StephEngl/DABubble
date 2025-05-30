import { Injectable, inject, OnDestroy } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import {
    Firestore,
    collection,
    doc,
    onSnapshot,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    DocumentReference
} from '@angular/fire/firestore';
import { DirectMessageInterface } from '../interfaces/message.interface';
import { ConversationInterface } from '../interfaces/conversation.interface';
@Injectable({
  providedIn: 'root'
})
export class ConversationService {
  firestore: Firestore = inject(Firestore);
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

  async addConversation(channel: ConversationInterface): Promise<void | DocumentReference> {
    try {
      const conversationRef = await addDoc(this.getConversationRef(), channel);
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

  getMessageById(id: string) {
    const conversation = this.getConversationById(id);
    if (!conversation || !conversation.messages) return;
    return conversation.messages.find((message : DirectMessageInterface ) => message.id === id);
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
        });
      });

      const conversation = this.getConversationById(conversationId);
      if (conversation) {
        conversation.messages = [...messages];
      }
    });
  }

}
