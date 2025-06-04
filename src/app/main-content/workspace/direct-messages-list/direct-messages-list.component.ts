import { Component, inject } from '@angular/core';
import { ConversationService } from '../../../services/conversations.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { UsersService } from '../../../services/users.service';
import { SignalsService } from '../../../services/signals.service';

@Component({
  selector: 'app-direct-messages-list',
  standalone: true,
  imports: [],
  templateUrl: './direct-messages-list.component.html',
  styleUrl: './direct-messages-list.component.scss'
})
export class DirectMessagesListComponent {
  tempArrayItemCount: string[] = ['1', '2', '3', '4', '5', '6'];
  conService = inject(ConversationService);
  authService = inject(AuthenticationService);
  userService = inject(UsersService);
  signalService = inject(SignalsService);
  directMessageListOpened: boolean = false;
  directMessageListHovered: boolean = false;

  toggleDirectMessageList() {
    this.directMessageListOpened = !this.directMessageListOpened;
  }

  imageColor(input: boolean):string {
    const color = input ? 'blue' : 'black';
    return color; 
  }

  get filteredConversations() {
    return this.conService.conversations
      .filter(c => c.participants.includes(this.authService.userId));
  }

  async openConversation(id: string) {
    await this.conService.loadConversation(id);
    this.signalService.setConversationSignals(id);
    this.signalService.hideWorkspaceOnMobile();
  }

}
