import { Component, inject } from '@angular/core';
import { CreateMessageComponent } from '../create-message/create-message.component';
import { MessageListComponent } from '../message-list/message-list.component';
import { SignalsService } from '../../services/signals.service';
import { ChannelsService } from '../../services/channels.service';
import { ChannelMessageInterface } from '../../interfaces/message.interface';

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


  getChannelMessages(): string {
    const currentChannel = localStorage.getItem('currentChannel');
    if (currentChannel) {
      return this.channelService.getChannelById(currentChannel)?.channelName || '';
    } else {
      return 'No Channel Selected'
    }
  }
}
