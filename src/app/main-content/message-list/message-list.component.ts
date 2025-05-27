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
import { ChannelMessageInterface } from '../../interfaces/message.interface';
import { ThreadMessageInterface } from '../../interfaces/message.interface';
import { Timestamp } from '@angular/fire/firestore';
import { SignalsService } from '../../services/signals.service';

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

export class MessageListComponent implements AfterViewChecked{

  @Input() isChannel: boolean = false;
  @Input() isThread: boolean = false;
  @ViewChild('messageContainer') messageContainer?: ElementRef<HTMLDivElement>;
  shouldScroll = true;
  channelService = inject(ChannelsService);
  signalService = inject(SignalsService);

  ngAfterViewChecked(): void {
      this.scrollToBottom();
  }

  scrollToBottom(): void {
    if (this.signalService.scrollChannelToBottom()) {
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
