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
    getDocs,
    query,
    orderBy,
    DocumentReference
} from '@angular/fire/firestore';
import { ChannelInterface } from '../interfaces/channel.interface';
import { ChannelMessageInterface, ThreadMessageInterface } from '../interfaces/message.interface';
@Injectable({
  providedIn: 'root'
})
export class ChannelsService {
  firestore: Firestore = inject(Firestore);
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
      createdAt: channelData.createdAt.toDate().toLocaleString(),
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

  async updateChannel(task: ChannelInterface) {
    if (task.id) {
      try {
        let docRef = this.getSingleDocRef(task.id);
        await updateDoc(docRef, this.getCleanJson(task));
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

  async postMessage(message: ChannelMessageInterface) {
    const activeChannel = localStorage.getItem("currentChannel");
    if (!activeChannel) return;

    try {
      await addDoc(this.getChannelMessagesRef(activeChannel), {
        text: message.text,
        createdAt: Timestamp.now(),
        senderId: message.senderId || 'Unknown',
        reactions: []
      });
    } catch (error) {
      console.error("Failed to post message:", error);
    }
  }

  async postThreadMessage(message: ChannelMessageInterface) {
    const activeChannel = localStorage.getItem("currentChannel");
    const activeThread = localStorage.getItem("currentThread");
    if (!activeChannel || !activeThread) return;

    try {
      await addDoc(this.getThreadMessagesRef(activeChannel, activeThread), {
        text: message.text,
        createdAt: Timestamp.now(),
        senderId: message.senderId || 'Unknown',
        reactions: []
      });
    } catch (error) {
      console.error("Failed to post message:", error);
    }
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

}
