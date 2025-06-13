/**
 * Service for managing channel data, including real-time Firestore subscriptions,
 * CRUD operations for channels, and nested message/thread handling.
 */
import { Injectable, inject, OnDestroy } from '@angular/core';
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
import { ChannelInterface } from '../interfaces/channel.interface';
import { ChannelMessageInterface, ReactionInterface, ThreadMessageInterface } from '../interfaces/message.interface';
import { SignalsService } from './signals.service';
@Injectable({
  providedIn: 'root'
})
export class ChannelsService {
  firestore: Firestore = inject(Firestore);
  signalService = inject(SignalsService);
  channels: ChannelInterface[] = [];
  unsubscribeChannels;

  constructor() {
    this.unsubscribeChannels = this.subChannels();
  }

  /** Cleans up Firestore subscriptions on destroy */
  ngOnDestroy() {
    if (this.unsubscribeChannels) {
      this.unsubscribeChannels();
    }
  }

  /** Subscribes to the 'channels' collection and updates local array */
  subChannels() {
    const q = query(this.getChannelsRef(), orderBy('createdAt'));
    return onSnapshot(q, (snapshot) => {
        this.channels = [];
        snapshot.forEach((element) => {
          const channel = element.data();
          this.channels.push(this.setChannelObject(element.id, channel));
        });
      },
      (error) => {
        console.error('Firestore Error', error.message);
      }
    );
  }

  /** Returns reference to the 'channels' Firestore collection */
  getChannelsRef() {
    return collection(this.firestore, 'channels');
  }

  /** Returns a reference to a single channel document */
  getSingleDocRef(docId: string) {
    return doc(this.getChannelsRef(), docId);
  }

  /**
   * Maps Firestore data to a typed ChannelInterface object
   * @param id - Document ID
   * @param channelData - Raw Firestore data
   * @returns ChannelInterface
   */
  setChannelObject(id: string, channelData: any): ChannelInterface {
    return {
      id: id,
      createdAt: channelData.createdAt,
      createdBy: channelData.createdBy,
      members: channelData.members,
      channelName: channelData.channelName,
      channelMessages: [],
      channelDescription: channelData.channelDescription || '',
    };
  }

  /**
   * Adds a new channel to Firestore
   * @param channel - Channel data
   * @returns DocumentReference if successful
   */
  async addChannel(channel: ChannelInterface): Promise<void | DocumentReference> {
    try {
      const channelRef = await addDoc(this.getChannelsRef(), channel);
      return channelRef;
    } catch (err) {
      console.error(err);
    }
  }

  /** Deletes a channel document from Firestore - currently not used in the app  */
  async deleteChannel(docId: string) {
    try {
      await deleteDoc(this.getSingleDocRef(docId));
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Updates a channel document in Firestore
   * @param channel - Channel data with ID
   */
  async updateChannel(channel: ChannelInterface) {
    if (channel.id) {
      try {
        let docRef = this.getSingleDocRef(channel.id);
        await updateDoc(docRef, this.getCleanJson(channel));
      } catch (err) {
        console.error(err);
      }
    }
  }

  /** Returns clean JSON object for Firestore */
  getCleanJson(channel: ChannelInterface) {
    return {
      createdAt: channel.createdAt,
      members: channel.members,
      channelName: channel.channelName,
      channelMessages: channel.channelMessages,
      channelDescription: channel.channelDescription
    };
  }

  /** Returns a reference to messages in a specific channel */
  getChannelMessagesRef(id:string) {
    return collection(this.firestore,`channels/${id}/channelMessages`);
  }

  /** Returns a reference to thread messages of a specific message */
  getThreadMessagesRef(idChannel:string, idMessage: string) {
    return collection(this.firestore,`channels/${idChannel}/channelMessages/${idMessage}/threadMessages`);
  }

  /** Returns a channel by ID from the local array */
  getChannelById(id: string) {
    return this.channels.find(channel => channel.id === id);
  }

  /** Returns a channel by name from the local array */
  getChannelByName(name: string) {
    return this.channels.find(channel => channel.channelName === name);
  }

  /** Finds a message by ID in the currently active channel */
  getMessageById(id: string) {
    const currentChannel = localStorage.getItem('currentChannel');
    if (!currentChannel) return;
    const channel = this.getChannelById(currentChannel);
    if (!channel || !channel.channelMessages) return;
    return channel.channelMessages.find(message => message.id === id);
  }

  /**
   * Subscribes to messages of a specific channel and auto-subscribes to thread messages
   * @param channelId - Channel ID
   */
  subscribeToChannelMessages(channelId: string) {
    const q = query(this.getChannelMessagesRef(channelId), orderBy('createdAt'));
    return onSnapshot(q, (snapshot) => {
    const messages: ChannelMessageInterface[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data() as ChannelMessageInterface;
      messages.push({
        id: doc.id,
        text: data.text,
        createdAt: data.createdAt,
        senderId: data.senderId,
        reactions: data.reactions,
        threadMessages: [], //data.threadMessages
      });
    });

    const channel = this.getChannelById(channelId);
      if (channel && channel.channelMessages) {
        channel.channelMessages = [...messages];

        messages.forEach(msg => {
          this.subscribeToThreadMessages(channelId, msg.id!);
        });
      }
    });
  }

  /**
   * Subscribes to thread messages of a specific message in a channel
   * @param channelId - Channel ID
   * @param messageId - Message ID
   */
  subscribeToThreadMessages(channelId: string, messageId: string) {
    const q = query(this.getThreadMessagesRef(channelId, messageId), orderBy('createdAt'));
    return onSnapshot(q, (snapshot) => {
      const threadMessages: ThreadMessageInterface[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data() as ThreadMessageInterface;
        threadMessages.push({
          id: doc.id,
          text: data.text,
          createdAt: data.createdAt,
          senderId: data.senderId,
          reactions: data.reactions,
        });
      });

      const channel = this.getChannelById(channelId);
      const parentMessage = channel?.channelMessages?.find(m => m.id === messageId);
      if (parentMessage) {
        parentMessage.threadMessages = [...threadMessages];
      }
    });
  }

  /**
   * Loads a channel by ID, sets it active and subscribes to its messages
   * @param id - Channel ID
   */
  async loadChannel(id: string): Promise<void> {
    localStorage.setItem("currentChannel", id);
    this.subscribeToChannelMessages(id);
  }

  /**
   * Adds selected users to the current channel.
   * @param users Array of user IDs to add
   */
  async addMembersToChannel(users: Array<string>) {
    const channelId = localStorage.getItem('currentChannel');
    if (!channelId) return;
    const channel = this.getChannelById(channelId);
    if (!channel || !channel.members) return;

    channel.members.push(...users);
    await this.updateChannel(channel);
    this.signalService.showAddMembers.set(false);
    this.triggerToast(users);
  }

  /**
   * Shows confirmation toast depending on number of users added.
   * @param array Array of user IDs
   */
  triggerToast(array: Array<string>):void {
    array.length === 1
    ? this.signalService.triggerToast('Member added to channel','confirm')
    : this.signalService.triggerToast('Members added to channel','confirm')
  }

}
