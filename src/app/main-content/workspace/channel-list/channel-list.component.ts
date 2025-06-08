/**
 * ChannelListComponent displays a list of available channels,
 * allows toggling the list, subscribing to channels, and managing UI states.
 */
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

  /** Toggles the channel list visibility. */
  toggleChannelList():void {
    this.channelListOpened = !this.channelListOpened;
  }

  /**
   * Returns a color string based on hover state and current theme.
   * @param input - Whether the element is hovered.
   * @returns A color string ("blue" or theme color).
   */
  imageColor(input: boolean):string {
    const color = input ? 'blue' : ''+ this.signalService.themeColorMain() +'';
    return color; 
  }

  /**
   * Sets the current channel, subscribes to its messages, and updates workspace signals.
   * @param id - The ID of the selected channel.
   */
  showChannelId(id: string):void {
    localStorage.setItem("currentChannel", id);
    this.channelService.subscribeToChannelMessages(id);
    this.signalService.setChannelSignals(id);
    this.signalService.hideWorkspaceOnMobile();
  }

  /**
   * Checks if the current user is a member of the specified channel.
   * @param channel - The channel to check membership against.
   * @returns True if the user is a member, false otherwise.
   */
  isChannelMember(channel: ChannelInterface):boolean {
    return channel.members!.includes(this.authService.userId);
  }
  
  /**
   * Limits the given channel name to a maximum length.
   * @param name - The name to be shortened.
   * @returns A shortened name with ellipsis if it exceeds max length.
   */
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
