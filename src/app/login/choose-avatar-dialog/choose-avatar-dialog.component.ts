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

  /**
 * Lifecycle hook that is called after data-bound properties are initialized.
 * Fetches the current user information.
 */
  ngOnInit() {
    this.getCurrentUser();
  }

  /**
 * Retrieves the current user based on the UID from the signal service.
 * Sets the currentUser property if the user is found.
 */
  async getCurrentUser() {
    const uid = this.signalService.currentUid();
    if (!uid) return;

    this.currentUser = await this.userService.getUserByUid(uid);
  }

  /**
 * Creates a user account by updating the user's avatar.
 * Shows a confirmation toast and navigates back to the login dialog.
 */
  async createAccount() {
    if (!this.currentUser) return;
    await this.userService.updateUserAvatar(
      this.currentUser.id!,
      this.currentUser.avatarId
    );
    this.signalService.triggerToast('Account created', 'confirm');

    this.signalService.backToLogin();
  }

  /**
 * Sets the avatar ID for the current user.
 * @param avatarId - The selected avatar ID.
 */
  selectAvatarId(avatarId: string) {
    if (!this.currentUser) return;
    this.currentUser.avatarId = avatarId;
  }

  /**
 * Returns the image path for the current user's avatar.
 * If no avatar is selected, returns the default avatar image path.
 * @returns The file path to the avatar image.
 */
  getAvatarImagePath() {
    if (!this.currentUser || this.currentUser.avatarId === '0') {
      return '/assets/icons/user/user_0.png';
    }
    return `/assets/icons/user/user_${this.currentUser.avatarId}.png`;
  }
}
