import { Component } from '@angular/core';

@Component({
  selector: 'app-channel-list',
  standalone: true,
  imports: [],
  templateUrl: './channel-list.component.html',
  styleUrl: './channel-list.component.scss'
})
export class ChannelListComponent {

  tempArrayItemCount: number[] = [0,1,2,3,4];
  channelListOpened: boolean = false;
  channelListHovered: boolean = false;

  toggleChannelList() {
    this.channelListOpened = !this.channelListOpened;
  }

  imageColor():string {
    const color = this.channelListHovered ? 'blue' : 'black';
    return color; 
  }
}
