import { Component, inject } from '@angular/core';
import { ChannelsService } from '../../../services/channels.service';
import { ChannelInterface } from '../../../interfaces/channel.interface';

@Component({
  selector: 'app-channel-header',
  standalone: true,
  imports: [],
  templateUrl: './channel-header.component.html',
  styleUrl: './channel-header.component.scss'
})
export class ChannelHeaderComponent {

  channelService = inject(ChannelsService);
  addMembersHovered: boolean = false;

  get currentChannel(): ChannelInterface | undefined {
    const currentId = localStorage.getItem('currentChannel');
    if (!currentId) return undefined;
    return this.channelService.getChannelById(currentId);
  }

}
