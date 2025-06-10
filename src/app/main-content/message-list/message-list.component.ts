/**
 * Displays a list of messages for channels, threads, or conversations.
 * Handles auto-scrolling and date separators.
 */

import {
  Component, 
  inject, 
  Input,   
  AfterViewChecked,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { ChatMessageComponent } from './chat-message/chat-message.component';
import { ChannelsService } from '../../services/channels.service';
import { ChannelMessageInterface, DirectMessageInterface } from '../../interfaces/message.interface';
import { ThreadMessageInterface } from '../../interfaces/message.interface';
import { Timestamp } from '@angular/fire/firestore';
import { SignalsService } from '../../services/signals.service';
import { TimeService } from '../../services/time.service';
import { ConversationService } from '../../services/conversations.service';
import { UsersService } from '../../services/users.service';

interface Message {
  text: string;
  dateCreated: Date;
  postedBy: string;
  hasReplies: boolean;
}
@Component({
  selector: 'app-message-list',
  standalone: true,
  imports: [ChatMessageComponent],
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.scss'
})

export class MessageListComponent implements AfterViewChecked {
  
  channelService = inject(ChannelsService);
  signalService = inject(SignalsService);
  conService = inject(ConversationService);
  userService = inject(UsersService);
  timeService = inject(TimeService);
  
  @Input() isChannel: boolean = false;
  @Input() isConversation: boolean = false;
  @Input() isThread: boolean = false;

  @ViewChild('messageContainer') messageContainer?: ElementRef<HTMLDivElement>;

  shouldScroll = true;
  scrollOnInit = false;
  paddingChannelMessage: string = '';
  paddingThreadMessage: string = '';

  ngOnInit(): void {
    this.scrollOnInit = true;
    setTimeout(() => {
      this.scrollOnInit = false;
    }, 1000);
  }

  ngAfterViewChecked(): void {
    if(this.signalService.sendingMessage()) {
      this.scrollToBottomInstant();
    }
    this.scrollToBottom();
  }

  onScroll() {
    if (this.messageContainer) {
      sessionStorage.setItem('scrollPositionY', this.messageContainer.nativeElement.scrollTop.toString());
      console.log(sessionStorage.getItem('scrollPositionY'));
    }
  }

  /** Instantly scrolls to bottom of message container. */
  scrollToBottomInstant(): void {
  if (this.messageContainer) {
    this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    }
  }

  /**  Smoothly scrolls to bottom of message container if conditions are met. */
  scrollToBottom(): void {
    if ((this.signalService.scrollChannelToBottom() && !this.signalService.sendingMessage()) || this.scrollOnInit) {
    setTimeout(() => {
      this.messageContainer?.nativeElement.scrollTo({
        top: this.messageContainer.nativeElement.scrollHeight,
        behavior: 'smooth'
      });
    }, 150);
    this.signalService.scrollChannelToBottom.set(false);
    }
  }

  /**
   * Checks if two dates are on the same day.
   * @param date1 First date
   * @param date2 Second date
   * @returns True if dates match
   */
  isSameDate(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear()
      && date1.getMonth() === date2.getMonth()
      && date1.getDate() === date2.getDate();
  }

  /**
   * Determines if a date separator should be shown.
   * @param index Message index
   * @param messages Message array
   * @returns True if separator should be shown
   */
  shouldShowDateSeparator(index: number, messages: any): boolean {
    if (index === 0) return true;
    const current = messages[index]?.createdAt?.toDate?.();
    const prev = messages[index - 1]?.createdAt?.toDate?.();
    if (!current || !prev) return false;
    return !this.isSameDate(current, prev);
  }

  /**
   * Converts a Firestore timestamp or Date to Date.
   * @param timestamp Firestore Timestamp or Date
   * @returns JavaScript Date object
   */
  toDate(timestamp: any): Date {
    return timestamp?.toDate ? timestamp.toDate() : timestamp;
  }

  /** Gets the currently active channel ID from localStorage */
  currentChannel(): string {
    return localStorage.getItem('currentChannel') || '';
  }

  /** Gets the currently active thread ID from localStorage */
  currentThread(): string {
    return localStorage.getItem('currentThread') || '';
  }

  /** Returns messages of the current channel */
  getChannelMessages(): ChannelMessageInterface[] {
    return this.channelService.getChannelById(this.currentChannel())?.channelMessages || [];
  }

  /** Returns messages belonging to the current thread */
  getThreadMessages(): ThreadMessageInterface[] {
    return this.channelService.getMessageById(this.currentThread())?.threadMessages || [];
  }

  /** Returns the title message text of the current thread */
  getThreadMessageTitle(): string {
    return this.channelService.getMessageById(this.currentThread())?.text || '';
  }

  /** Returns the creation date of the current thread title message */
  getThreadMessageDate(): Timestamp {
    return this.channelService.getMessageById(this.currentThread())?.createdAt!;
  }

  /** Returns the current thread message object */
  getCurrentThreadMessage(): ThreadMessageInterface | undefined {
    return this.channelService.getMessageById(this.currentThread());
  }

  /**
   * Returns messages from a conversation.
   * @param id Conversation ID
   * @returns List of direct messages
   */
  getDirectMessages(id:string): DirectMessageInterface[] {
    const conversation = this.conService.getConversationById(id);
    if (conversation?.messages) {
      return conversation.messages;
    } else {
      return [];
    }
  }

  /** Checks if current conversation has no messages */
  get hasNoMessages(): boolean {
    const messages = this.getDirectMessages(this.signalService.activeConId());
    return messages.length === 0;
  }

  /** Checks if the current thread contains messages */
  hasThreadMessages(): boolean {
    return this.getThreadMessages().length > 0;
  }
  
  /** Checks if the active thread is still selected */
  currentThreadActive(): boolean {
    return this.getCurrentThreadMessage()?.id === localStorage.getItem('currentThread');
  }

  /** Gets the conversation partner's user ID */
  get conversationPartner() {
    const activeCon = this.conService.getConversationById(this.signalService.activeConId());
    if (!activeCon) return;
    const participant = this.conService.participant(activeCon);
    if (!participant) return;
    return participant;
  }

  /** Opens the user info panel for the conversation partner */
  userInfo():void {
    this.signalService.userInfoId.set(this.conversationPartner);
    this.signalService.showUserInfo.set(true);
  }

  /** Returns the creator ID of the current channel */
  get channelCreator() {
    const currentChannel = this.channelService.getChannelById(this.currentChannel());
    if (currentChannel?.createdBy) {
      return currentChannel.createdBy
    } return "Unknown";
  }

  /** Returns the title/name of the current channel */
  get channelTitle() {
    const currentChannel = this.channelService.getChannelById(this.currentChannel());
    if (currentChannel?.channelName) {
      return currentChannel.channelName
    } return "Unknown";
  }

  /** Returns formatted creation date of the current channel */
  get channelCreatedAt() {
        const currentChannel = this.channelService.getChannelById(this.currentChannel())?.createdAt;
    if (currentChannel) {
      return this.timeService.getDate(currentChannel.toDate(), 'dd-mm-yyyy'); 
    } return "Unknown";
  }

  /** Checks if the app is currently viewed on a mobile screen */
  isMobileView():boolean {
    return window.innerWidth < 850;
  }

}
