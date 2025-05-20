import { Component } from '@angular/core';
import { ChannelHeaderComponent } from './channel-header/channel-header.component';
import { CreateMessageComponent } from '../create-message/create-message.component';

@Component({
  selector: 'app-channel',
  standalone: true,
  imports: [ChannelHeaderComponent, CreateMessageComponent],
  templateUrl: './channel.component.html',
  styleUrl: './channel.component.scss'
})
export class ChannelComponent {

}
