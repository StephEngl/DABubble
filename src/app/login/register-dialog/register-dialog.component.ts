import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { UserInterface } from '../../interfaces/user.interface';
import { AuthenticationService } from '../../services/authentication.service';
import { SignalsService } from '../../services/signals.service';
import { RouterLink } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { UsersService } from '../../services/users.service';
import { PasswordService } from '../../services/password.service';
import { PasswordsComponent } from '../passwords/passwords.component';
import { ChannelsService } from '../../services/channels.service';

@Component({
  selector: 'app-register-dialog',
  standalone: true,
  imports: [FormsModule, RouterLink, PasswordsComponent],
  templateUrl: './register-dialog.component.html',
  styleUrl: './register-dialog.component.scss',
})
export class RegisterDialogComponent {
  auth = inject(Auth);
  authService = inject(AuthenticationService);
  signalService = inject(SignalsService);
  usersService = inject(UsersService);
  passwordService = inject(PasswordService);
  channelService = inject(ChannelsService);

  passwordInput:string = this.signalService.confirmPasswordInput();
  nameInput: string = '';
  emailInput: string = '';
  privacyPolicyAccepted: boolean = false;

  /**
   * Creates a new user with the given credentials and navigates to the summary page.
   * @param nameInput string - user's full name
   * @param mailInput string - user's email address
   * @param password string - user's password
   */
  async createUser(nameInput: string, mailInput: string, password: string) {
    const user = this.getUserData(nameInput, mailInput);
    if (this.userAlreadyExists(user.name)) return;
    const userCredential = await this.authService.createUser(
      user.email,
      password,
      user.name
    );
    const uid = userCredential.user.uid;
    this.usersService.addUser(uid, user);
    this.setSignals(uid);
    this.initChannelGeneral(uid);
  }

  /**
   * Sets initial signals for the user registration process.
   * @param uid User ID to set in signal state.
   */
  setSignals(uid: string):void {
    this.signalService.currentUid.set(uid);
    this.signalService.confirmPasswordInput.set('');
    this.signalService.goToAvatarChoice();
  }

  /**
   * Returns a user object from name and email inputs.
   * @param nameInput The user's name.
   * @param mailInput The user's email.
   * @returns A new UserInterface object with default status and avatar.
   */
  getUserData(nameInput: string, mailInput: string,): UserInterface {
    return {
      name: nameInput,
      email: mailInput,
      status: 'online',
      avatarId: '',
    };
  }

  /**
   * Initializes the "General" channel for the given user ID.
   * @param uid The user ID to add to the "General" channel.
   */
  async initChannelGeneral(uid:string): Promise<void> {
    const channel = this.channelService.getChannelByName('General');
    if(!channel || !channel.id) return;
    localStorage.setItem('currentChannel', channel.id);
    await this.channelService.addMembersToChannel([uid]);
  }

  /**
   * Checks whether a user with the same email already exists in the local list.
   * @param mail string - email to check
   * @returns boolean - true if the user already exists
   */
  userAlreadyExists(mail: string): boolean {
    return this.usersService.users.some(
      (user) => user.email.trim().toLowerCase() === mail.trim().toLowerCase()
    );
  }
}
