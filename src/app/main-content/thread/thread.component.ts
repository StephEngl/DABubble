import { Component } from '@angular/core';
import { CreateMessageComponent } from '../create-message/create-message.component';
import { MessageListComponent } from '../message-list/message-list.component';

@Component({
  selector: 'app-thread',
  standalone: true,
  imports: [CreateMessageComponent, MessageListComponent],
  templateUrl: './thread.component.html',
  styleUrl: './thread.component.scss'
})
export class ThreadComponent {

}
