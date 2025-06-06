import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ChannelInterface } from '../../../interfaces/channel.interface';
import { Timestamp } from 'firebase/firestore';
import { ChannelsService } from '../../../services/channels.service';
import { SignalsService } from '../../../services/signals.service';
import { AuthenticationService } from '../../../services/authentication.service';

@Component({
  selector: 'app-create-channel',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create-channel.component.html',
  styleUrl: './create-channel.component.scss',
})
export class CreateChannelComponent {
  signalService = inject(SignalsService);
  channelService = inject(ChannelsService);
  authService = inject(AuthenticationService);
  channelNameInput: string = '';
  channelDescriptionInput: string = '';

  async submitForm(ngForm: NgForm) {
    if (!ngForm.valid) return;
      const channelData = this.getChannelData();
    if (!this.channelAlreadyExists()) {
      await this.channelService.addChannel(channelData);
      this.openChannelAndAddMembers();
      ngForm.reset();
    } else {
      console.log('Channel already exists!'); // trigger toast or error message
    }
  }

  openChannelAndAddMembers() {
    const id = this.getChannelIdByName();
    this.showChannelId(id);
    this.signalService.showAddMembers.set(true);
    this.signalService.showCreateChannel.set(false);
  }

  getChannelIdByName():string {
    const channel = this.channelService.channels.find(c => c.channelName === this.channelNameInput);
    if (channel && channel.id) {
      return channel.id;
    } else {
      return "";
    }
  }

  showChannelId(id: string):void {
    localStorage.setItem("currentChannel", id);
    this.channelService.subscribeToChannelMessages(id);
    this.signalService.setChannelSignals(id);
  }

  getChannelData(): ChannelInterface {
    return {
      createdAt: Timestamp.fromDate(new Date()),
      channelName: this.channelNameInput,
      channelDescription: this.channelDescriptionInput,
      members: [this.authService.userId],
      createdBy: this.authService.userId
    }
  }

  channelAlreadyExists():boolean {
    const channel = this.channelService.channels.find(
      (channel) =>
        channel.channelName.toLowerCase() ===
        this.channelNameInput.toLowerCase()
    );
    if (channel) {
      return true;
    } else {
      return false;
    }
  }

}
