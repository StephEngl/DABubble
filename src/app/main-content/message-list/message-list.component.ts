import { Component } from '@angular/core';
import { ChatMessageComponent } from './chat-message/chat-message.component';

interface Message {
  text: string;
  dateCreated: Date;
  postedBy: string;
}

@Component({
  selector: 'app-message-list',
  standalone: true,
  imports: [ChatMessageComponent],
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.scss'
})
export class MessageListComponent {

  messages: Message[] = [
    { text: 'Hey, how are you?', dateCreated: new Date('2024-05-14T08:15:00'), postedBy: 'A' },
    { text: 'Did you send the files already?', dateCreated: new Date('2024-05-14T09:30:00'), postedBy: 'B' },
    { text: 'I’m in a meeting, I’ll get back to you.', dateCreated: new Date('2024-05-16T10:05:00'), postedBy: 'C' },
    { text: 'Let’s discuss this tomorrow.', dateCreated: new Date('2024-05-20T11:00:00'), postedBy: 'A' },
    { text: 'Sounds good, thanks!', dateCreated: new Date('2024-05-20T12:45:00'), postedBy: 'B' },
    { text: 'Be right back.', dateCreated: new Date('2024-05-22T13:10:00'), postedBy: 'C' },
    { text: 'Can we finish this by tonight?', dateCreated: new Date('2024-05-22T14:25:00'), postedBy: 'A' },
    { text: 'Perfect, thanks again.', dateCreated: new Date('2024-05-22T15:55:00'), postedBy: 'B' }
  ];

  isSameDate(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear()
      && date1.getMonth() === date2.getMonth()
      && date1.getDate() === date2.getDate();
  }

  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    return `${day}.${month}.${year}`;
  }
}
