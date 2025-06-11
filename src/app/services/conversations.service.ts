/**
 * Service for managing direct message conversations, including Firestore subscriptions,
 * CRUD operations, and user-to-user conversation logic.
 */
import { Injectable, inject, OnDestroy } from '@angular/core';
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

  /** Cleans up Firestore subscriptions on destroy */
  ngOnDestroy() {
    if (this.unsubscribeDirectMessages) {
      this.unsubscribeDirectMessages();
    }
  }

  /** Subscribes to the 'conversations' collection and updates local array */
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

  /** Returns reference to the 'conversations' collection */
  getConversationRef() {
    return collection(this.firestore, 'conversations');
  }

  /** Returns document reference for a specific conversation */
  getSingleDocRef(docId: string) {
    return doc(this.getConversationRef(), docId);
  }

  /**
   * Maps Firestore data to a typed ConversationInterface object
   * @param id - Document ID
   * @param conversationData - Raw Firestore data
   * @returns ConversationInterface
   */
  setConversationObject(id: string, conversationData: any): ConversationInterface {
    return {
      id: id,
      participants: conversationData.participants,
      messages: conversationData.messages,
    };
  }

  /**
   * Adds a new conversation to Firestore
   * @param conversation - Conversation data
   * @returns DocumentReference if successful
   */
  async addConversation(conversation: ConversationInterface): Promise<void | DocumentReference> {
    try {
      const conversationRef = await addDoc(this.getConversationRef(), conversation);
      return conversationRef;
    } catch (err) {
      console.error(err);
    }
  }

  /** Deletes a conversation document from Firestore, currently not used in app */
  async deleteConversation(docId: string) {
    try {
      await deleteDoc(this.getSingleDocRef(docId));
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Updates a conversation in Firestore
   * @param channel - Updated conversation object
   */
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

  /** Prepares clean object for Firestore update */
  getCleanJson(conversation: ConversationInterface) {
    return {
      participants: conversation.participants,
      messages: conversation.messages,
    };
  }

  /** Returns reference to the 'messages' subcollection for a conversation */
  getDirectMessagesRef(id:string) {
    return collection(this.firestore,`conversations/${id}/messages`);
  }

  /** Returns a conversation by ID from the local list */
  getConversationById(id: string) {
    return this.conversations.find(conversation => conversation.id === id);
  }

  /** Returns a specific message by ID from a conversation */
  getMessageById(id: string, messageId: string) {
    const conversation = this.getConversationById(id);
    if (!conversation || !conversation.messages) return;
    return conversation.messages.find((message : DirectMessageInterface ) => message.id === messageId);
  }

  /** Subscribes to messages of a conversation and updates them in real-time */
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

  /** Loads all conversations from Firestore */
  async loadCons(): Promise<void> {
    try {
      const querySnapshot = await getDocs(this.getConversationRef());
      this.conversations = querySnapshot.docs.map(docSnapshot => {
        const data = docSnapshot.data();
        return this.setConversationObject(docSnapshot.id, data);
      });
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  }

  /** Loads a conversation and subscribes to its messages */
  async loadConversation(id: string): Promise<void> {
    this.subscribeToDirectMessages(id);
  }

  /** Returns the conversation partner (non-current user) */
  participant(conversation: ConversationInterface): any  {
      const [a, b] = conversation.participants;
      const currentUser = this.authService.userId;
      return (a === b) ? a : (a === currentUser ? b : a);
  }

  /**
   * Starts a new conversation with a user, or reopens existing one
   * @param userId - ID of the other participant
   */
  async startNewConversation(userId: string): Promise<void> {
    const existingConversation = this.getExistingConversation(userId);
    if (existingConversation?.id) {
      await this.openConversation(existingConversation.id);
      return;
    }

    const currentUser = this.authService.userId;
    const createdConversation = await this.createAndLoadConversation([currentUser, userId]);
    if (createdConversation?.id) {
      await this.openConversation(createdConversation.id);
    }
  }

  /** 
   * Finds an existing conversation between current user and given user 
   * @param userId - ID of the other participant
   */
  getExistingConversation(userId: string): ConversationInterface | undefined {
    return this.conversations.find(con => {
      const [a, b] = con.participants;
      return (a === this.authService.userId && b === userId) || 
            (a === userId && b === this.authService.userId);
    });
  }

  /**
   * Creates a new conversation and loads it
   * @param participants - Array of user IDs
   * @returns The created or found conversation
   */
  async createAndLoadConversation(participants: string[]): Promise<ConversationInterface | undefined> {
    const newConversation: ConversationInterface = { participants };
    await this.addConversation(newConversation);
    await this.loadCons();

    return this.conversations.find(con =>
      participants.every(p => con.participants.includes(p))
    );
  }

  /**
   * Opens a conversation and triggers signal updates
   * @param id - Conversation ID
   */
  async openConversation(id: string): Promise<void> {
    await this.loadConversation(id);
    this.signalService.setConversationSignals(id);
  }

  /** Checks if the current user is the 'owner' of the active conversation */
  ownConversation(): boolean {
    const currentConId = this.signalService.activeConId();
    const currentUserId = this.authService.userId;
    const currentConversation = this.getConversationById(currentConId);
    const ownUser = this.participant(currentConversation!);
    if(ownUser === currentUserId) {
      return true;
    } else {
      return false;
    }
  }

}
