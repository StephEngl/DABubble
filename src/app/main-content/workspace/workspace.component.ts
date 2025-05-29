import { Component, inject } from '@angular/core';
import { ChannelListComponent } from './channel-list/channel-list.component';
import { DirectMessagesListComponent } from './direct-messages-list/direct-messages-list.component';
import { SignalsService } from '../../services/signals.service';

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [ChannelListComponent, DirectMessagesListComponent],
  templateUrl: './workspace.component.html',
  styleUrl: './workspace.component.scss'
})
export class WorkspaceComponent {

  signalService = inject(SignalsService);
  startConversationHovered: boolean = false;

  newConversation() {
    this.signalService.startConversation.set(true);
  }
}
