import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { SignalsService } from '../../../services/signals.service';
import { FocusDirective } from '../../../directives/focus.directive';

@Component({
  selector: 'app-channel-info',
  standalone: true,
  imports: [FocusDirective],
  templateUrl: './channel-info.component.html',
  styleUrl: './channel-info.component.scss'
})

export class ChannelInfoComponent {
  
  signalService = inject(SignalsService);

  channelNameEdit: boolean = false;
  channelDescriptionEdit: boolean = false;
  @ViewChild('channelDescription') textarea!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('channelName') input!: ElementRef<HTMLInputElement>;
  
}
