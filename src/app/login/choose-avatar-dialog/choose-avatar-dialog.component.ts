import { Component, inject } from '@angular/core';
import { SignalsService } from '../../services/signals.service';
import { UsersService } from '../../services/users.service';
import { UserInterface } from '../../interfaces/user.interface';

@Component({
  selector: 'app-choose-avatar-dialog',
  standalone: true,
  imports: [],
  templateUrl: './choose-avatar-dialog.component.html',
  styleUrl: './choose-avatar-dialog.component.scss',
})
export class ChooseAvatarDialogComponent {
  signalService = inject(SignalsService);
  userService = inject(UsersService);
  avatarIds: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  currentUser?: UserInterface;

  ngOnInit() {
    this.getCurrentUser();
  }

  async getCurrentUser() {
    const uid = this.signalService.currentUid();
    if (!uid) return;

    this.currentUser = await this.userService.getUserByUid(uid);
  }

  backToRegister() {
    this.signalService.isLoginDialog.set(false);
    this.signalService.isRegisterDialog.set(true);
    this.signalService.isChoosingAvatarDialog.set(false);
    this.signalService.isPasswordForgottenDialog.set(false);
  }

  async createAccount() {
    if (!this.currentUser) return;
    await this.userService.updateUserAvatar(
      this.currentUser.id!,
      this.currentUser.avatarId
    );
    this.signalService.triggerToast('Account created', 'create');

    this.backToLogin();
  }

  selectAvatarId(avatarId: string) {
    if (!this.currentUser) return;
    this.currentUser.avatarId = avatarId;
  }

  getAvatarImagePath() {
    if (!this.currentUser || this.currentUser.avatarId === '0') {
      return '/assets/icons/user/user_0.png';
    }
    return `/assets/icons/user/user_${this.currentUser.avatarId}.png`;
  }

  backToLogin() {
    this.signalService.isLoginDialog.set(true);
    this.signalService.isRegisterDialog.set(false);
    this.signalService.isChoosingAvatarDialog.set(false);
    this.signalService.isPasswordForgottenDialog.set(false);
  }
}
