import { Component, Input, inject } from '@angular/core';
import { ChannelsService } from '../../../services/channels.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-chat-message',
  standalone: true,
  imports: [NgClass],
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.scss'
})
export class ChatMessageComponent {

  channelService = inject(ChannelsService);
  // demo input to remove start
  @Input() messageText: string = '';
  @Input() isOwnMessage: boolean = false;
  @Input() messageId: string = '';
  // demo input to remove end

  @Input() threadMessages: any = [];
  @Input() message: any = {};
  @Input() threadMessage: any = {};
  @Input() threadTitle: any = {};
  
  @Input() paddingHorizontal: string = '';
  @Input() isChannelMessage: boolean = false;
  @Input() isThreadMessage: boolean = false;
  @Input() isThreadTitle: boolean = false;

  editMode: boolean = false;
  hoverMessage: boolean = false;

  menuBar: {imgSrc: string, shownInThread: boolean}[] = [
    { imgSrc: './../../../../assets/icons/message/emoji_laughing.png', shownInThread: false },
    { imgSrc: './../../../../assets/icons/message/emoji_thumbs_up.png', shownInThread: false },
    { imgSrc: './../../../../assets/icons/message/add_reaction_black.svg', shownInThread: true },
    { imgSrc: './../../../../assets/icons/message/comment_black.svg', shownInThread: false },
    { imgSrc: './../../../../assets/icons/message/more_options_black.svg', shownInThread: true },
  ];

  reactions: { emoji:string, count: number} [] = [
    {emoji:'👍',count:1},
    {emoji:'👎',count:2},
    {emoji:'❤️',count:3},
    {emoji:'😂',count:4},
    {emoji:'😍',count:5},
  ];

  openThread() {
    localStorage.setItem('currentThread', this.messageId);
    const currentThreadId = localStorage.getItem('currentThread');
    const currentChannelId = localStorage.getItem('currentChannel');
    if (currentChannelId && currentThreadId) {
      this.channelService.subscribeToThreadMessages(currentChannelId, currentThreadId);
    }
  }

  dateDayMonthYear(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    return `${day}.${month}.${year}`;
  }

  timeHourMinute(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  dateLastThread(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}.${month}.${year} | ${hours}:${minutes}`;
  }

  createdAt() {
    if (this.isChannelMessage) {
        return this.timeHourMinute(this.message.createdAt.toDate())
      } else if (this.isThreadMessage) {
        return this.timeHourMinute(this.threadMessage.createdAt.toDate());
      } else if (this.isThreadTitle) {
        return this.timeHourMinute(this.threadTitle.createdAt.toDate());
      } else {
      return '';
    }
  }

  text() {
    if (this.isChannelMessage) {
      return this.message.text;
    } else if (this.isThreadMessage) {
      return this.threadMessage.text;
    } else if (this.isThreadTitle) {
      return this.threadTitle.text;
    }
  }


}
