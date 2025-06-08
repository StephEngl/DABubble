/**
 * Thread component used to display and interact with threaded messages
 * within a selected channel context. Includes message list and input.
 */
import { Component, inject } from '@angular/core';
import { CreateMessageComponent } from '../create-message/create-message.component';
import { MessageListComponent } from '../message-list/message-list.component';
import { SignalsService } from '../../services/signals.service';
import { ChannelsService } from '../../services/channels.service';

@Component({
  selector: 'app-thread',
  standalone: true,
  imports: [CreateMessageComponent, MessageListComponent],
  templateUrl: './thread.component.html',
  styleUrl: './thread.component.scss'
})

export class ThreadComponent {

  signalService = inject(SignalsService);
  channelService = inject(ChannelsService);

  /** Returns the name of the current channel or a fallback if none is selected. */
  getChannelMessages(): string {
    const currentChannel = localStorage.getItem('currentChannel');
    if (currentChannel) {
      return this.channelService.getChannelById(currentChannel)?.channelName || '';
    } else {
      return 'No Channel Selected'
    }
  }
}
