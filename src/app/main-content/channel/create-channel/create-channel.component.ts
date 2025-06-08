/**
 * Handles channel creation logic including name/description input,
 * validation, creation in backend, and UI signal updates.
 */
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

  /**
   * Handles form submission: validates, creates channel if not exists, and updates UI.
   * @param ngForm Angular form reference
   */
  async submitForm(ngForm: NgForm) {
    if (!ngForm.valid) return;
      const channelData = this.getChannelData();
    if (!this.channelAlreadyExists()) {
      await this.channelService.addChannel(channelData);
      this.openChannelAndAddMembers();
      ngForm.reset();
    } else {
      this.signalService.triggerToast('This channel already exists!','error') 
    }
  }

  /** Opens the new channel and toggles UI for member adding */
  openChannelAndAddMembers() {
    const id = this.getChannelIdByName();
    this.showChannelId(id);
    this.signalService.showAddMembers.set(true);
    this.signalService.showCreateChannel.set(false);
    this.signalService.triggerToast('Channel created successfully','confirm');
  }

  /** Returns channel ID by name if it exists */
  getChannelIdByName():string {
    const channel = this.channelService.channels.find(c => c.channelName === this.channelNameInput);
    return channel && channel.id ? channel.id : "";
  }
  
  /**
   * Sets the current channel, subscribes to its messages, and updates signals.
   * @param id - The ID of the channel to activate.
   */
  showChannelId(id: string):void {
    localStorage.setItem("currentChannel", id);
    this.channelService.subscribeToChannelMessages(id);
    this.signalService.setChannelSignals(id);
  }

  /** Returns a ChannelInterface object with input values and metadata */
  getChannelData(): ChannelInterface {
    return {
      createdAt: Timestamp.fromDate(new Date()),
      channelName: this.channelNameInput,
      channelDescription: this.channelDescriptionInput,
      members: [this.authService.userId],
      createdBy: this.authService.userId
    }
  }

  /** Checks if a channel with the same name already exists */
  channelAlreadyExists():boolean {
    const channel = this.channelService.channels.find(
      (channel) =>
        channel.channelName.toLowerCase() ===
        this.channelNameInput.toLowerCase()
    );
    return channel ? true : false;
  }

}
