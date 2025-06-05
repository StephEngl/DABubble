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
    const user: UserInterface = {
      name: nameInput,
      email: mailInput,
      status: 'online',
      avatarId: '',
    };
    if (this.userAlreadyExists(user.name)) return;
    const userCredential = await this.authService.createUser(
      user.email,
      password,
      user.name
    );
    const uid = userCredential.user.uid;
    this.usersService.addUser(uid, user);
    this.signalService.currentUid.set(uid);
    this.signalService.confirmPasswordInput.set('');

    this.signalService.goToAvatarChoice();
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
