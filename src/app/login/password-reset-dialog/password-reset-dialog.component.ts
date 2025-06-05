import { Component, inject } from '@angular/core';
import { SignalsService } from '../../services/signals.service';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { UsersService } from '../../services/users.service';
import { UserInterface } from '../../interfaces/user.interface';
import { ActivatedRoute } from '@angular/router';
import { PasswordService } from '../../services/password.service';
import { PasswordsComponent } from '../passwords/passwords.component';

@Component({
  selector: 'app-password-reset-dialog',
  standalone: true,
  imports: [FormsModule, PasswordsComponent],
  templateUrl: './password-reset-dialog.component.html',
  styleUrl: './password-reset-dialog.component.scss',
})
export class PasswordResetDialogComponent {
  authService = inject(AuthenticationService);
  signalService = inject(SignalsService);
  userService = inject(UsersService);
  passwordService = inject(PasswordService);

  passwordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;
  passwordInput: string = '';
  confirmPasswordInput: string = '';

  oobCode: string = '';
  email: string = '';
  error: string = '';

  currentUser?: UserInterface;

  constructor(private route: ActivatedRoute) {}

  /**
   * Angular lifecycle hook that is called after component initialization.
   * Initiates extraction of the oobCode from the URL.
   */
  async ngOnInit() {
    this.extractOobCodeOutOfURL();
  }

  /**
   * Extracts the oobCode parameter from the URL query parameters.
   * If the oobCode exists, verifies the password reset code and retrieves the associated email.
   * Sets an error message if the code is invalid or expired.
   */
  async extractOobCodeOutOfURL() {
    this.route.queryParams.subscribe(async (params) => {
      this.oobCode = params['oobCode'] || '';
      if (this.oobCode) {
        try {
          this.email = await this.authService.verifyPasswordResetCode(
            this.oobCode
          );
        } catch (err: any) {
          this.error = 'This Link is invalid or expired.';
        }
      }
    });
  }

  /**
   * Checks whether the password and confirmation password inputs match.
   * @returns True if both passwords match and are not empty; otherwise, false.
   */
  // get passwordsMatch(): boolean {
  //   if (this.passwordInput) {
  //     return this.passwordInput === this.confirmPasswordInput;
  //   } else {
  //     return false;
  //   }
  // }

  /**
   * Handles form submission: validates input and handles errors.
   */
  async setNewPassword() {
    if (!this.signalService.passwordsMatch || !this.oobCode) return;
    this.passwordService.setNewPassword(this.oobCode, this.confirmPasswordInput);
    // try {
    //   await this.resetPassword(this.oobCode, this.passwordInput);
    //   this.handlePasswordResetSuccess();
    // } catch (err: any) {
    //   this.handlePasswordResetError(err);
    // }
  }
}
