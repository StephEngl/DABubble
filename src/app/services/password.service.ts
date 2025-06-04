import { Injectable, inject } from '@angular/core';
import { SignalsService } from './signals.service';
import { AuthenticationService } from './authentication.service';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class PasswordService {
  signalService = inject(SignalsService);
  authService = inject(AuthenticationService);
  auth = inject(Auth);

  passwordVisible: Boolean = false;
  confirmPasswordVisible: Boolean = false;
  passwordInput: string = '';
  confirmPasswordInput: string = '';

  /**
   * Checks whether the password and confirmation password inputs match.
   * @returns True if both passwords match and are not empty; otherwise, false.
   */
  get passwordsMatch(): boolean {
    if (this.passwordInput) {
      return this.passwordInput === this.confirmPasswordInput;
    } else {
      return false;
    }
  }

  /**
   * Handles form submission: validates input and handles errors.
   */
  async setNewPassword(oobCode:string, passwordInput:string) {
    try {
      await this.resetPassword(oobCode, passwordInput);
      this.handlePasswordResetSuccess();
    } catch (err: any) {
      this.handlePasswordResetError(err);
    }
  }

  /**
   * Resets the user's password using the provided code and new password.
   * @param oobCode - The password reset code from the email link.
   * @param newPassword - The new password entered by the user.
   */
  async resetPassword(oobCode: string, newPassword: string) {
    await this.authService.confirmPasswordReset(oobCode, newPassword);
  }

  /**
   * Handles UI feedback and navigation after successful password reset.
   */
  handlePasswordResetSuccess() {
    this.signalService.triggerToast('Passwort reset!', 'confirm');
    setTimeout(() => {
      this.signalService.backToLogin();
    }, 2500);
  }

  /**
   * Handles UI feedback and logging for password reset errors.
   * @param error - The error thrown during password reset.
   */
  handlePasswordResetError(error: any) {
    this.signalService.triggerToast('Resetting password failed!', 'error');
    console.error(error);
  }

  /** Toggles the visibility of the password input field. */
  togglePasswordVisibility(passwordVisible:boolean) {
    passwordVisible = !passwordVisible;
  }

  /** Toggles the visibility of the confirmation password input field. */
  toggleConfirmPasswordVisibility(confirmPasswordVisible:boolean) {
    confirmPasswordVisible = !confirmPasswordVisible;
  }
}
