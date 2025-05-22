import { Component, inject } from '@angular/core';
import { MenuToggleService } from '../../../services/menu-toggle.service';
import { ChannelsService } from '../../../services/channels.service';

@Component({
  selector: 'app-channel-list',
  standalone: true,
  imports: [],
  templateUrl: './channel-list.component.html',
  styleUrl: './channel-list.component.scss'
})
export class ChannelListComponent {

  menuToggleService = inject(MenuToggleService);
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
    console.log(id);
    localStorage.setItem("currentChannel", id);
  }
}
