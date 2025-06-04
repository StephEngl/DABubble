import { Component, inject } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
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

  ngOnInit() {
    if (this.signalService.userInfoId() != '') {
      this.user = this.userService.users.find((u) => u.id === this.signalService.userInfoId());
    }
  }

  sendMessage(id: string):void {
    this.conService.startNewConversation(id);
    this.signalService.showUserInfo.set(false);
  }

}
