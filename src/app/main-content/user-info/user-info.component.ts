/**
 * Displays detailed information about a selected user.
 * Allows starting a new conversation with the user.
 */
import { Component, inject } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { SignalsService } from '../../services/signals.service';
import { ConversationService } from '../../services/conversations.service';

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.scss'
})
export class UserInfoComponent {

  userService = inject(UsersService);
  conService = inject(ConversationService);
  signalService = inject(SignalsService);
  user: any = {};

  /** Loads user data based on selected user ID signal. */
  ngOnInit() {
    if (this.signalService.userInfoId() != '') {
      this.user = this.userService.users.find((u) => u.id === this.signalService.userInfoId());
    }
  }

  /**
  * Starts a new conversation with the specified user and closes the user info panel.
  * @param id - The ID of the user to start a conversation with.
  */
  sendMessage(id: string):void {
    this.conService.startNewConversation(id);
    this.signalService.showUserInfo.set(false);
  }

}
