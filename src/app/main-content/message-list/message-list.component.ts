import { Component, inject, Input, OnInit } from '@angular/core';
import { ChatMessageComponent } from './chat-message/chat-message.component';
import { ChannelsService } from '../../services/channels.service';
import { ChannelMessageInterface } from '../../interfaces/message.interface';
import { ThreadMessageInterface } from '../../interfaces/message.interface';
import { Timestamp } from '@angular/fire/firestore';

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
export class MessageListComponent {

  // demo data start
  messages: Message[] = [
    { text: 'Hey, how are you?', dateCreated: new Date('2024-05-14T08:15:00'), postedBy: 'A', hasReplies: true },
    { text: 'Did you send the files already?', dateCreated: new Date('2024-05-14T09:30:00'), postedBy: 'B', hasReplies: false },
    { text: 'I’m in a meeting, I’ll get back to you.', dateCreated: new Date('2024-05-16T10:05:00'), postedBy: 'C', hasReplies: true },
    { text: 'Let’s discuss this tomorrow.', dateCreated: new Date('2024-05-20T11:00:00'), postedBy: 'A', hasReplies: false },
    { text: 'Sounds good, thanks!', dateCreated: new Date('2024-05-20T12:45:00'), postedBy: 'B', hasReplies: true },
    { text: 'Be right back.', dateCreated: new Date('2024-05-22T13:10:00'), postedBy: 'C', hasReplies: false },
    { text: 'Can we finish this by tonight?', dateCreated: new Date('2024-05-22T14:25:00'), postedBy: 'A', hasReplies: true },
    { text: 'Perfect, thanks again.', dateCreated: new Date('2024-05-22T15:55:00'), postedBy: 'B', hasReplies: false }
  ];
  // demo data end

  @Input() isChannel: boolean = false;
  @Input() isThread: boolean = false;
  channelService = inject(ChannelsService);


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


  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    return `${day}.${month}.${year}`;
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

  hasThreadMessages(): boolean {
    return this.getThreadMessages().length > 0;
  }
  
  currentThreadActive() {
    return this.getCurrentThreadMessage()?.id === localStorage.getItem('currentThread');
  }

}
