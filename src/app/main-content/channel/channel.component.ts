import { Component } from '@angular/core';
import { ChannelHeaderComponent } from './channel-header/channel-header.component';
import { CreateMessageComponent } from '../create-message/create-message.component';
import { MessageListComponent } from '../message-list/message-list.component';

@Component({
  selector: 'app-channel',
  standalone: true,
  imports: [ChannelHeaderComponent, CreateMessageComponent, MessageListComponent],
  templateUrl: './channel.component.html',
  styleUrl: './channel.component.scss'
})
export class ChannelComponent {

}
