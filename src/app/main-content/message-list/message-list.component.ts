import {
  Component, 
  inject, 
  Input,   
  AfterViewChecked,
  AfterViewInit,
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

  scrollToBottomInstant(): void {
  if (this.messageContainer) {
    this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
  }
}

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

  isSameDate(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear()
      && date1.getMonth() === date2.getMonth()
      && date1.getDate() === date2.getDate();
  }

  shouldShowDateSeparator(index: number, messages: any): boolean {
    if (index === 0) return true;
    const current = messages[index]?.createdAt?.toDate?.();
    const prev = messages[index - 1]?.createdAt?.toDate?.();
    if (!current || !prev) return false;
    return !this.isSameDate(current, prev);
  }

  toDate(timestamp: any): Date {
    return timestamp?.toDate ? timestamp.toDate() : timestamp;
  }

  currentChannel(): string {
    return localStorage.getItem('currentChannel') || '';
  }

  currentThread(): string {
    return localStorage.getItem('currentThread') || '';
  }

  getChannelMessages(): ChannelMessageInterface[] {
    return this.channelService.getChannelById(this.currentChannel())?.channelMessages || [];
  }

  getThreadMessages(): ThreadMessageInterface[] {
    return this.channelService.getMessageById(this.currentThread())?.threadMessages || [];
  }

  getThreadMessageTitle(): string {
    return this.channelService.getMessageById(this.currentThread())?.text || '';
  }

  getThreadMessageDate(): Timestamp {
    return this.channelService.getMessageById(this.currentThread())?.createdAt!;
  }

  getCurrentThreadMessage(): ThreadMessageInterface | undefined {
    return this.channelService.getMessageById(this.currentThread());
  }

  getDirectMessages(id:string): DirectMessageInterface[] {
    const conversation = this.conService.getConversationById(id);
    if (conversation?.messages) {
      return conversation.messages;
    } else {
      return [];
    }
  }

  get hasNoMessages(): boolean {
    const messages = this.getDirectMessages(this.signalService.activeConId());
    return messages.length === 0;
  }

  hasThreadMessages(): boolean {
    return this.getThreadMessages().length > 0;
  }
  
  currentThreadActive() {
    return this.getCurrentThreadMessage()?.id === localStorage.getItem('currentThread');
  }

  get conversationPartner() {
    const activeCon = this.conService.getConversationById(this.signalService.activeConId());
    if (!activeCon) return;
    const participant = this.conService.participant(activeCon);
    if (!participant) return;
    return participant;
  }

  userInfo() {
    this.signalService.userInfoId.set(this.conversationPartner);
    this.signalService.showUserInfo.set(true);
  }

}
