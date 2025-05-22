import { Component, inject } from '@angular/core';
import { MenuToggleService } from '../../../services/menu-toggle.service';

@Component({
  selector: 'app-channel-list',
  standalone: true,
  imports: [],
  templateUrl: './channel-list.component.html',
  styleUrl: './channel-list.component.scss'
})
export class ChannelListComponent {

  menuToggleService = inject(MenuToggleService);

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
}
