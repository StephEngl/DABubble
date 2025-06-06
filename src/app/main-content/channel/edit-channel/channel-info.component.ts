import { Component, inject } from '@angular/core';
import { SignalsService } from '../../../services/signals.service';

@Component({
  selector: 'app-channel-info',
  standalone: true,
  imports: [],
  templateUrl: './channel-info.component.html',
  styleUrl: './channel-info.component.scss'
})
export class ChannelInfoComponent {
  
  signalService = inject(SignalsService);

  channelNameEdit: boolean = false;
  channelDescriptionEdit: boolean = false;

}
