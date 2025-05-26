import { Component, inject } from '@angular/core';
import { ChannelsService } from '../../../services/channels.service';
import { SignalsService } from '../../../services/signals.service';

@Component({
  selector: 'app-channel-list',
  standalone: true,
  imports: [],
  templateUrl: './channel-list.component.html',
  styleUrl: './channel-list.component.scss'
})
export class ChannelListComponent {

  signalService = inject(SignalsService);
  channelService = inject(ChannelsService);

  tempArrayItemCount: number[] = [0,1,2,3,4];
  channelListOpened: boolean = false;
  channelListHovered: boolean = false;
  channelListItemHovered: boolean = false;
  addChannelHovered: boolean = false;

  hoveredIndex: number | null = null;

  toggleChannelList() {
    this.channelListOpened = !this.channelListOpened;
  }

  imageColor(input: boolean):string {
    const color = input ? 'blue' : 'black';
    return color; 
  }

  showChannelId(id: string) {
    localStorage.setItem("currentChannel", id);
    this.channelService.subscribeToChannelMessages(id);
    this.signalService.scrollChannelToBottom.set(true);
  }
  
}
