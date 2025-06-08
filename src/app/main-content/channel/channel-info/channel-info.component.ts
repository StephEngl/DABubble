/**
 * Displays and manages information of the currently selected channel
 * including edit and leave functionality.
 */
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { SignalsService } from '../../../services/signals.service';
import { FocusDirective } from '../../../directives/focus.directive';
import { ChannelInterface } from '../../../interfaces/channel.interface';
import { ChannelsService } from '../../../services/channels.service';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../../services/users.service';
import { AuthenticationService } from '../../../services/authentication.service';

@Component({
  selector: 'app-channel-info',
  standalone: true,
  imports: [FocusDirective, FormsModule],
  templateUrl: './channel-info.component.html',
  styleUrl: './channel-info.component.scss'
})

export class ChannelInfoComponent {
  
  signalService = inject(SignalsService);
  channelService = inject(ChannelsService);
  usersService = inject(UsersService);
  authService = inject(AuthenticationService);

  channelName: string = '';
  channelNameTemp: string = '';
  channelDescription: string = '';
  channelDescriptionTemp: string = '';
  channelNameEdit: boolean = false;
  channelDescriptionEdit: boolean = false;
  currentChannel: ChannelInterface | undefined;

  @ViewChild('channelDescription') textarea!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('channelName') input!: ElementRef<HTMLInputElement>;

  /** Loads current channel data into local state on init */
  ngOnInit() {
    this.getChannelData();
  }

  /** Fetches channel data from service and updates local values */
  getChannelData(): void {
    const currentChannelId = localStorage.getItem('currentChannel');
    console.log(currentChannelId);

    if (currentChannelId) {
      const foundChannel = this.channelService.getChannelById(currentChannelId);

      if (foundChannel) {
        this.currentChannel = foundChannel;
        this.channelName = foundChannel.channelName;
        this.channelDescription = foundChannel.channelDescription ?? '';
      }
    }
  }

  /** Enables name edit mode and stores temporary value */
  editName() {
    this.channelNameEdit = true;
    this.channelNameTemp = this.channelName;
  }

  /** Cancels name edit and resets value */
  cancelEditName() {
    this.channelNameEdit = false;
    this.channelName = this.channelNameTemp;
  }

  /** Enables description edit mode and stores temporary value */
  editDescription() {
    this.channelDescriptionEdit = true
    this.channelDescriptionTemp = this.channelDescription;
  }

  /** Cancels description edit and resets value */
  cancelEditDescription() {
    this.channelDescriptionEdit = false;
    this.channelDescription = this.channelDescriptionTemp
  }

  /** Updates channel name in backend and reloads channel */
  updateChannelName():void {
    const channel = this.channelDataName();
    if(!channel)return;
    this.channelService.updateChannel(channel);
    this.channelService.loadChannel(channel.id!);
    this.channelNameEdit = false;
  }

  /** Updates channel description in backend and reloads channel */
  updateChannelDescription():void {
    const channel = this.channelDataDescription();
    if(!channel)return;
    this.channelService.updateChannel(channel);
    this.channelService.loadChannel(channel.id!);
    this.channelDescriptionEdit = false;
  }

  /** Returns updated channel object with new name */
  channelDataName(): ChannelInterface | undefined {
    const channelId = localStorage.getItem('currentChannel');
    const channel = this.channelService.getChannelById(channelId!);
    if (!channel) return;
    return {
      ...channel,
      channelName: this.channelName,
    };
  }

  /** Returns updated channel object with new description */
  channelDataDescription(): ChannelInterface | undefined {
    const channelId = localStorage.getItem('currentChannel');
    const channel = this.channelService.getChannelById(channelId!);
    if (!channel) return;
    return {
      ...channel,
      channelDescription: this.channelDescription
    };
  }

  /** Returns updated channel object with current members */
  channelDataMembers(): ChannelInterface | undefined {
    const channelId = localStorage.getItem('currentChannel');
    const channel = this.channelService.getChannelById(channelId!);
    if (!channel) return;
    return {
      ...channel,
      members: this.currentChannel?.members
    };
  }

  /** Checks if name has not been changed */
  noChangesToName():boolean {
    return this.channelName === this.channelNameTemp;
  }

  /** Checks if description has not been changed */
  noChangesToDescription():boolean {
    return this.channelDescription === this.channelDescriptionTemp;
  }

  /** Returns true if the current channel is 'General' */
  isGeneralChannel():boolean {
    if(this.currentChannel) {
      return this.currentChannel.channelName == 'General';
    } else {
      return false;
    }
  }

  /** Removes user from current channel and switches to General */
  leaveChannel(): void {
    const userId = this.authService.userId;
    const currentChannelId = localStorage.getItem('currentChannel');

    if (!userId || !currentChannelId) return;

    const currentChannel = this.channelService.getChannelById(currentChannelId);
    if (!currentChannel) return;

    const updatedChannel = this.getChannelWithoutUser(currentChannel, userId);
    this.channelService.updateChannel(updatedChannel);

    this.switchToGeneralChannel();
    this.signalService.showChannelInfo.set(false);
  }

  /**
   * Returns a copy of the given channel without the specified user in the members list.
   * @param channel The channel to update
   * @param userId The user ID to remove
   */
  getChannelWithoutUser(channel: ChannelInterface, userId: string): ChannelInterface {
    const updatedMembers = channel.members?.filter(memberId => memberId !== userId) ?? [];
    return { ...channel, members: updatedMembers };
  }

  /** Switches to the 'General' channel if available and updates localStorage */
  switchToGeneralChannel(): void {
    const generalChannel = this.channelService.channels
      .find(channel => channel.channelName === 'General');

    if (generalChannel?.id) {
      this.channelService.loadChannel(generalChannel.id);
      localStorage.setItem('currentChannel', generalChannel.id);
    }
  }

}
