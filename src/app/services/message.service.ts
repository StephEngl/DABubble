import { Injectable, inject } from '@angular/core';
import { ChannelsService } from './channels.service';
import { Timestamp } from '@angular/fire/firestore';
import { ChannelMessageInterface, ReactionInterface, ThreadMessageInterface } from '../interfaces/message.interface';
import {
    Firestore,
    addDoc,
    doc,
    updateDoc,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor() { }

  firestore: Firestore = inject(Firestore);
  channelService = inject(ChannelsService);

  async postMessage(message: ChannelMessageInterface) {
    const activeChannel = localStorage.getItem("currentChannel");
    if (!activeChannel) return;

    try {
      await addDoc(this.channelService.getChannelMessagesRef(activeChannel), {
        text: message.text,
        createdAt: Timestamp.now(),
        senderId: message.senderId || 'Unknown',
        reactions: []
      });
    } catch (error) {
      console.error("Failed to post message:", error);
    }
  }
  
  async postThreadMessage(message: ThreadMessageInterface) {
    const activeChannel = localStorage.getItem("currentChannel");
    const activeThread = localStorage.getItem("currentThread");
    if (!activeChannel || !activeThread) return;

    try {
      await addDoc(this.channelService.getThreadMessagesRef(activeChannel, activeThread), {
        text: message.text,
        createdAt: Timestamp.now(),
        senderId: message.senderId || 'Unknown',
        reactions: []
      });
    } catch (error) {
      console.error("Failed to post message:", error);
    }
  }

  async updateMessage(
    messageId: string,
    updatedData: Partial<ChannelMessageInterface | ThreadMessageInterface>,
    options: { isThread?: boolean }
  ) {
    const activeChannel = localStorage.getItem("currentChannel");
    const activeThread = localStorage.getItem("currentThread");
    if (!activeChannel) return;
    try {
      let docRef;
      if (options.isThread && activeThread) {
        docRef = doc(this.channelService.getThreadMessagesRef(activeChannel, activeThread), messageId);
      } else {
        docRef = doc(this.channelService.getChannelMessagesRef(activeChannel), messageId);
      }
      await updateDoc(docRef, updatedData);
    } catch (error) {
      console.error("Failed to update message:", error);
    }
  }
  
  postReaction(id: string, code: string, targetArray: ReactionInterface[], isChannelMessage: boolean): void {
    const user = 'currentUser'; // connect to auth.service (current user.id)
    let reactions = targetArray;
    const existingReaction = reactions.find((reaction: { emojiCode: string; }) => reaction.emojiCode === code);
    if (existingReaction) {
      if (!existingReaction.postedBy.includes(user)) {
        existingReaction.postedBy.push(user);
        existingReaction.count += 1;
      }
    } else {
      reactions.push({
        emojiCode: code,
        postedBy: [user],
        count: 1
      });
    }

    if (isChannelMessage) {
      this.updateMessage(id, { reactions: reactions }, {});
    } else {
      this.updateMessage(id, { reactions: reactions }, { isThread: true });
    }
  }

  // optional -->

  // postMention(
  //   messageId: string,
  //   mentionedUserId: string,
  //   mentionsArray: string[],
  //   isChannelMessage: boolean
  // ): void {
  //   const currentUserId = 'currentUser';
  //   //if (!currentUserId) return;

  //   if (!mentionsArray.includes(mentionedUserId)) {
  //     mentionsArray.push(mentionedUserId);
  //   }

  //   const updatePayload = { mentions: mentionsArray };

  //   if (isChannelMessage) {
  //     this.updateMessage(messageId, updatePayload, {});
  //   } else {
  //     this.updateMessage(messageId, updatePayload, { isThread: true });
  //   }
  // }

  // <-- optional


}
