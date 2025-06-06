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

  ngOnInit() {
    this.getChannelData();
  }

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

  editName() {
    this.channelNameEdit = true;
    this.channelNameTemp = this.channelName;
  }

  cancelEditName() {
    this.channelNameEdit = false;
    this.channelName = this.channelNameTemp;
  }

  editDescription() {
    this.channelDescriptionEdit = true
    this.channelDescriptionTemp = this.channelDescription;
  }

  cancelEditDescription() {
    this.channelDescriptionEdit = false;
    this.channelDescription = this.channelDescriptionTemp
  }

  updateChannelName():void {
    const channel = this.channelDataName();
    if(!channel)return;
    this.channelService.updateChannel(channel);
    this.channelService.loadChannel(channel.id!);
    this.channelNameEdit = false;
  }

  updateChannelDescription():void {
    const channel = this.channelDataDescription();
    if(!channel)return;
    this.channelService.updateChannel(channel);
    this.channelService.loadChannel(channel.id!);
    this.channelDescriptionEdit = false;
  }

  channelDataName(): ChannelInterface | undefined {
    const channelId = localStorage.getItem('currentChannel');
    const channel = this.channelService.getChannelById(channelId!);
    if (!channel) return;
    return {
      ...channel,
      channelName: this.channelName,
    };
  }

  channelDataDescription(): ChannelInterface | undefined {
    const channelId = localStorage.getItem('currentChannel');
    const channel = this.channelService.getChannelById(channelId!);
    if (!channel) return;
    return {
      ...channel,
      channelDescription: this.channelDescription
    };
  }

  channelDataMembers(): ChannelInterface | undefined {
    const channelId = localStorage.getItem('currentChannel');
    const channel = this.channelService.getChannelById(channelId!);
    if (!channel) return;
    return {
      ...channel,
      members: this.currentChannel?.members
    };
  }

  noChangesToName():boolean {
    return this.channelName === this.channelNameTemp;
  }

  noChangesToDescription():boolean {
    return this.channelDescription === this.channelDescriptionTemp;
  }

  isGeneralChannel():boolean {
    if(this.currentChannel) {
      return this.currentChannel.channelName == 'General';
    } else {
      return false;
    }
  }

  leaveChannel(): void {
    const userId = this.authService.userId;
    const currentChannelId = localStorage.getItem('currentChannel');

    if (!userId || !currentChannelId) return;

    const currentChannel = this.channelService.getChannelById(currentChannelId);
    if (!currentChannel) return;

    const updatedMembers = currentChannel.members?.filter(memberId => memberId !== userId) ?? [];

    const updatedChannel: ChannelInterface = {
      ...currentChannel,
      members: updatedMembers
    };

    this.channelService.updateChannel(updatedChannel);

    const generalChannel = this.channelService.channels
      .find(channel => channel.channelName === 'General');

    if (generalChannel) {
      this.channelService.loadChannel(generalChannel.id!);
      localStorage.setItem('currentChannel', generalChannel.id!);
    }
    this.signalService.showChannelInfo.set(false);
  }


}
