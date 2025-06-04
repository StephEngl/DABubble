import { Component, inject } from '@angular/core';
import { SignalsService } from '../../services/signals.service';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { UsersService } from '../../services/users.service';
import { UserInterface } from '../../interfaces/user.interface';
import { ActivatedRoute } from '@angular/router';
import { PasswordService } from '../../services/password.service';

@Component({
  selector: 'app-password-reset-dialog',
  standalone: true,
  imports: [FormsModule],
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
    if (!this.passwordService.passwordsMatch || !this.oobCode) return;
    this.passwordService.setNewPassword(this.oobCode, this.confirmPasswordInput);
    // try {
    //   await this.resetPassword(this.oobCode, this.passwordInput);
    //   this.handlePasswordResetSuccess();
    // } catch (err: any) {
    //   this.handlePasswordResetError(err);
    // }
  }

  /**
   * Resets the user's password using the provided code and new password.
   * @param oobCode - The password reset code from the email link.
   * @param newPassword - The new password entered by the user.
   */
  // async resetPassword(oobCode: string, newPassword: string) {
  //   await this.authService.confirmPasswordReset(oobCode, newPassword);
  // }

  /**
   * Handles UI feedback and navigation after successful password reset.
   */
  // handlePasswordResetSuccess() {
  //   this.signalService.triggerToast('Passwort reset!', 'confirm');
  //   setTimeout(() => {
  //     this.signalService.backToLogin();
  //   }, 2500);
  // }

  /**
   * Handles UI feedback and logging for password reset errors.
   * @param error - The error thrown during password reset.
   */
  // handlePasswordResetError(error: any) {
  //   this.signalService.triggerToast('Resetting password failed!', 'error');
  //   console.error(error);
  // }

  /** Toggles the visibility of the password input field. */
  // togglePasswordVisibility() {
  //   this.passwordVisible = !this.passwordVisible;
  // }

  /** Toggles the visibility of the confirmation password input field. */
  // toggleConfirmPasswordVisibility() {
  //   this.confirmPasswordVisible = !this.confirmPasswordVisible;
  // }
}
