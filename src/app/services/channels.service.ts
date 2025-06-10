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

  ngOnDestroy() {
    if (this.unsubscribeChannels) {
      this.unsubscribeChannels();
    }
  }

  subChannels() {
    const q = query(this.getChannelsRef(), orderBy('createdAt'));
    return onSnapshot(
      q,
      (snapshot) => {
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

  getChannelsRef() {
    return collection(this.firestore, 'channels');
  }

  getSingleDocRef(docId: string) {
    return doc(this.getChannelsRef(), docId);
  }

  setChannelObject(id: string, channelData: any): ChannelInterface {
    return {
      id: id,
      createdAt: channelData.createdAt,
      createdBy: channelData.createdBy,
      members: channelData.members,
      channelName: channelData.channelName,
      channelMessages: channelData.channelMessages,
      channelDescription: channelData.channelDescription || '',
    };
  }

  async addChannel(channel: ChannelInterface): Promise<void | DocumentReference> {
    try {
      const channelRef = await addDoc(this.getChannelsRef(), channel);
      return channelRef;
    } catch (err) {
      console.error(err);
    }
  }

  async deleteChannel(docId: string) {
    try {
      await deleteDoc(this.getSingleDocRef(docId));
    } catch (err) {
      console.error(err);
    }
  }

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

  getCleanJson(channel: ChannelInterface) {
    return {
      createdAt: channel.createdAt,
      members: channel.members,
      channelName: channel.channelName,
      channelMessages: channel.channelMessages,
      channelDescription: channel.channelDescription
    };
  }

  // => Subcollection Channel Messages
  getChannelMessagesRef(id:string) {
    return collection(this.firestore,`channels/${id}/channelMessages`);
  }

  // => Subcollection Thread Messages
  getThreadMessagesRef(idChannel:string, idMessage: string) {
    return collection(this.firestore,`channels/${idChannel}/channelMessages/${idMessage}/threadMessages`);
  }

  getChannelById(id: string) {
    return this.channels.find(channel => channel.id === id);
  }

  getChannelByName(name: string) {
    return this.channels.find(channel => channel.channelName === name);
  }

  getMessageById(id: string) {
    const currentChannel = localStorage.getItem('currentChannel');
    if (!currentChannel) return;
    const channel = this.getChannelById(currentChannel);
    if (!channel || !channel.channelMessages) return;
    return channel.channelMessages.find(message => message.id === id);
  }

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
        threadMessages: data.threadMessages
      });
    });

    const channel = this.getChannelById(channelId);
      if (channel) {
        channel.channelMessages = [...messages];

        messages.forEach(msg => {
          this.subscribeToThreadMessages(channelId, msg.id!);
        });
      }
    });
  }

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
