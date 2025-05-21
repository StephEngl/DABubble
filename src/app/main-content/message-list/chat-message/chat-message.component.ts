import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chat-message',
  standalone: true,
  imports: [],
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.scss'
})
export class ChatMessageComponent {

  @Input() messageText: string = '';
  @Input() isOwnMessage: boolean = false;
  @Input() hasReplies: boolean = false;
  @Input() paddingHorizontal: string = '';

  reactions: { emoji:string, count: number} [] = [
    {emoji:'👍',count:1},
    {emoji:'👎',count:2},
    {emoji:'❤️',count:3},
    {emoji:'😂',count:4},
    {emoji:'😍',count:5},
  ];
}
