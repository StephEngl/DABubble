import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { SignalsService } from '../../../services/signals.service';
import { FocusDirective } from '../../../directives/focus.directive';
import { ChannelInterface } from '../../../interfaces/channel.interface';
import { ChannelsService } from '../../../services/channels.service';
import { FormsModule } from '@angular/forms';

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

  channelName: string = '';
  channelDescription: string = '';
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

}
