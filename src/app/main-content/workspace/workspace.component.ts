import { Component } from '@angular/core';
import { ChannelListComponent } from './channel-list/channel-list.component';
import { DirectMessagesListComponent } from './direct-messages-list/direct-messages-list.component';

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [ChannelListComponent, DirectMessagesListComponent],
  templateUrl: './workspace.component.html',
  styleUrl: './workspace.component.scss'
})
export class WorkspaceComponent {

  startConversationHovered: boolean = false;
}
