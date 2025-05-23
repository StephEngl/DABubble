import { Component, Input, inject } from '@angular/core';
import { ChannelsService } from '../../../services/channels.service';

@Component({
  selector: 'app-chat-message',
  standalone: true,
  imports: [],
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.scss'
})
export class ChatMessageComponent {

  channelService = inject(ChannelsService);
  @Input() messageText: string = '';
  @Input() isOwnMessage: boolean = false;
  @Input() threadCount: number = 0;
  @Input() paddingHorizontal: string = '';
  @Input() isChannelMessage: boolean = false;
  @Input() messageId: string = '';
  editMode: boolean = false;

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

}
