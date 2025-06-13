/**
 * Service for handling messages in channels, threads, and direct conversations,
 * including creation, updates, and emoji reactions.
 */
import { Injectable, inject } from '@angular/core';
import { ChannelsService } from './channels.service';
import { Timestamp } from '@angular/fire/firestore';
import { ChannelMessageInterface, DirectMessageInterface, ReactionInterface, ThreadMessageInterface } from '../interfaces/message.interface';
import {
    Firestore,
    addDoc,
    doc,
    updateDoc,
} from '@angular/fire/firestore';
import { AuthenticationService } from './authentication.service';
import { ConversationService } from './conversations.service';
import { SignalsService } from './signals.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  firestore: Firestore = inject(Firestore);
  channelService = inject(ChannelsService);
  conversationService = inject(ConversationService);
  signalService = inject(SignalsService);
  authService = inject(AuthenticationService);

  /**
   * Posts a message to the current channel
   * @param message - Message object to be posted
   */
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
  
  /**
   * Posts a message to the current thread
   * @param message - The thread message to post
   */
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

  /**
   * Updates a message or thread message in Firestore
   * @param messageId - ID of the message to update
   * @param updatedData - Partial updated data
   * @param options - Optional flags (e.g. isThread)
   */
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

  updateMessageText(id: string, newText: string, isChannelMessage: boolean): void {
    if (isChannelMessage) {
      this.updateMessage(id, { text: newText }, {});
    } else {
      this.updateMessage(id, { text: newText }, { isThread: true });
    }
  }
  
  /**
   * Adds or updates a reaction to a channel or thread message
   * @param id - Message ID
   * @param code - Emoji code
   * @param targetArray - Existing reactions array
   * @param isChannelMessage - True if message is a channel message
   */
  postReaction(id: string, code: string, targetArray: ReactionInterface[], isChannelMessage: boolean): void {
    const user = this.authService.userId;
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

  /**
   * Posts a direct message in a conversation
   * @param id - Conversation ID
   * @param message - Direct message data
   */
  async postDirectMessage (id: string, message: DirectMessageInterface) {
    try {
      await addDoc(this.conversationService.getDirectMessagesRef(id), {
        text: message.text,
        createdAt: Timestamp.now(),
        senderId: message.senderId || 'Unknown',
        reactions: [],
        replyTo: message.replyTo || ''
      });
    } catch (error) {
      console.error("Failed to post message:", error);
    }
  }

  /**
   * Updates a direct message in Firestore
   * @param id - Message ID
   * @param message - Partial updated data
   */
  async updateDirectMessage(id: string, message: Partial<DirectMessageInterface>) {
    try {
      let docRef = doc(this.conversationService.getDirectMessagesRef(this.signalService.activeConId()), id)
      await updateDoc(docRef, message);
    } catch (error) {
      console.error("Failed to update message:", error);
    }
  }

  /**
   * Adds or updates a reaction on a direct message
   * @param id - Message ID
   * @param code - Emoji code
   * @param targetArray - Existing reactions array
   */
  postDirectMessageReaction(id: string, code: string, targetArray: ReactionInterface[]): void {
    const user = this.authService.userId;
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
    this.updateDirectMessage(id, { reactions: reactions });
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
