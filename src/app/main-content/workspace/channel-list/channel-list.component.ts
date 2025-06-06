import { Component, inject } from '@angular/core';
import { ChannelsService } from '../../../services/channels.service';
import { SignalsService } from '../../../services/signals.service';
import { ChannelInterface } from '../../../interfaces/channel.interface';
import { AuthenticationService } from '../../../services/authentication.service';

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
  authService = inject(AuthenticationService);

  tempArrayItemCount: number[] = [0,1,2,3,4];
  channelListOpened: boolean = false;
  channelListHovered: boolean = false;
  channelListItemHovered: boolean = false;
  addChannelHovered: boolean = false;

  hoveredIndex: number | null = null;

  toggleChannelList():void {
    this.channelListOpened = !this.channelListOpened;
  }

  imageColor(input: boolean):string {
    const color = input ? 'blue' : 'black';
    return color; 
  }

  showChannelId(id: string):void {
    localStorage.setItem("currentChannel", id);
    this.channelService.subscribeToChannelMessages(id);
    this.signalService.setChannelSignals(id);
  }

  isChannelMember(channel: ChannelInterface):boolean {
    return channel.members!.includes(this.authService.userId);
  }
  
  showMaxLetters(name: string):string {
    const max = 10;
    let nameLength = name.length;
    if (nameLength > max) {
      nameLength = max;
      return name.substring(0, nameLength) + '...';
    } else {
      return name
    }
  }

}
