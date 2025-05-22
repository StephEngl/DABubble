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
import { ChannelMessageInterface } from '../interfaces/message.interface';
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

}
