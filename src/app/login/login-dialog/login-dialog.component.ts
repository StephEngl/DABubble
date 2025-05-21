import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { UserInterface } from '../../interfaces/user.interface';
import { AuthenticationService } from '../../services/authentication.service';
import { SignalsService } from '../../services/signals.service';

@Component({
  selector: 'app-login-dialog',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login-dialog.component.html',
  styleUrl: './login-dialog.component.scss',
})
export class LoginDialogComponent {
  // authService = inject(AuthenticationService);
  signalService = inject(SignalsService);
  formSubmitted = false;
  passwordVisible: Boolean = false;
  emailInput: string = '';
  passwordInput: string = '';
  noUserFound: Boolean = false;
  isGuestLogin = false;

  loginData: UserInterface = {
    email: '',
    password: '',
  };

  /** Toggles the visibility of the password input field. */
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  openPasswordForgottenDialog() {
    this.signalService.isPasswordForgottenDialog.set(true);
    this.signalService.isLoginDialog.set(false);
    this.signalService.isRegisterDialog.set(false);
    this.signalService.isChoosingAvatarDialog.set(false);
  }

  /**
   * Called when the login form is submitted.
   * Sets the submission flag if the login is not a guest login.
   * @param ngForm - The Angular form instance.
   */
  onSubmit(ngForm: NgForm) {
    if (!this.isGuestLogin) {
      this.formSubmitted = true;
    }
  }

  /**
   * Attempts to log in a user with the provided email and password.
   * Sets error state if the login fails.
   * @param mail - The user's email address.
   * @param password - The user's password.
   */
  async login(mail: string, password: string) {
    // try {
    //   this.noUserFound = false;
    //   await this.authService.signInUser(mail, password);
    // } catch (error) {
    //   this.noUserFound = true;
    //   setTimeout(() => {
    //     this.noUserFound = false;
    //   }, 5000);
    //   console.error('Login fehlgeschlagen:', error);
    // }
  }

  /**
   * Logs in as a guest/admin user using pre-defined credentials.
   * Temporarily sets the guest login flag during the login process.
   * @param mail - The guest/admin email.
   * @param password - The guest/admin password.
   */
  async guestLogin(mail: string, password: string) {
    // this.isGuestLogin = true;
    // this.noUserFound = false;
    // await this.authService.signInUser(mail, password);
    // setTimeout(() => (this.isGuestLogin = false), 100);
  }
}
