import { Component, inject } from '@angular/core';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { ChannelInterface } from '../../../interfaces/channel.interface';
import { Timestamp } from 'firebase/firestore';
import { ChannelsService } from '../../../services/channels.service';
import { SignalsService } from '../../../services/signals.service';
import { AuthenticationService } from '../../../services/authentication.service';

@Component({
  selector: 'app-edit-channel',
  standalone: true,
  imports: [ ],
  templateUrl: './edit-channel.component.html',
  styleUrl: './edit-channel.component.scss'
})
export class EditChannelComponent {

  signalService = inject(SignalsService);
  channelService = inject(ChannelsService);
  authService = inject(AuthenticationService);
  channelNameInput: string = '';
  channelDescriptionInput: string = '';

}
