/**
 * Root component that displays a full channel view including
 * header, message list, and input area. Handles state distinction
 * between channel and conversation mode.
 */
import { Component, inject } from '@angular/core';
import { ChannelHeaderComponent } from './channel-header/channel-header.component';
import { CreateMessageComponent } from '../create-message/create-message.component';
import { MessageListComponent } from '../message-list/message-list.component';
import { SignalsService } from '../../services/signals.service';

@Component({
  selector: 'app-channel',
  standalone: true,
  imports: [ChannelHeaderComponent, CreateMessageComponent, MessageListComponent],
  templateUrl: './channel.component.html',
  styleUrl: './channel.component.scss'
})
export class ChannelComponent {

  signalService = inject(SignalsService);
  isChannel = this.signalService.channelActive();
  isConversation = this.signalService.conversationActive();

}
