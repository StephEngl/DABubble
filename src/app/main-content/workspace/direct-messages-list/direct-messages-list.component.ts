/**
 * DirectMessagesListComponent displays and manages a user's direct message conversations,
 * including toggling the list and opening specific conversations.
 */
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

  /** Toggles the visibility of the direct messages list. */
  toggleDirectMessageList() {
    this.directMessageListOpened = !this.directMessageListOpened;
  }

  /**
   * Returns a color string depending on the boolean input and theme.
   * @param input - If true, returns 'blue'; otherwise returns the main theme color.
   * @returns A color string.
   */
  imageColor(input: boolean):string {
    const color = input ? 'blue' : ''+ this.signalService.themeColorMain() +'';
    return color; 
  }

  /** Returns conversations where the current user is a participant. */
  get filteredConversations() {
    return this.conService.conversations
      .filter(c => c.participants.includes(this.authService.userId));
  }

  /**
   * Loads and opens the selected conversation by ID.
   * @param id - The conversation ID to open.
   */
  async openConversation(id: string) {
    await this.conService.loadConversation(id);
    this.signalService.setConversationSignals(id);
    this.signalService.hideWorkspaceOnMobile();
  }

}
