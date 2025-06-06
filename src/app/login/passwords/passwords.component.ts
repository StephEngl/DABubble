import { Component, inject, Output, EventEmitter } from '@angular/core';
import { PasswordService } from '../../services/password.service';
import { FormsModule } from '@angular/forms';
import { SignalsService } from '../../services/signals.service';
import { AuthenticationService } from '../../services/authentication.service';
import { Auth } from '@angular/fire/auth';


@Component({
  selector: 'app-passwords',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './passwords.component.html',
  styleUrl: './passwords.component.scss'
})
export class PasswordsComponent {
  passwordService = inject(PasswordService);
  signalService = inject(SignalsService);
  authService = inject(AuthenticationService);
  auth = inject(Auth);

  passwordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;
  passwordInput: string = '';
  // confirmPasswordInput: string = '';  
  
  
    /**
     * Checks whether the password and confirmation password inputs match.
     * @returns True if both passwords match and are not empty; otherwise, false.
     */
    get passwordsMatch(): boolean {
      if (this.passwordInput) {
        return this.passwordInput === this.signalService.confirmPasswordInput();
      } else {
        return false;
      }
    }

onPasswordInputChange() {
  const confirmPassword = this.signalService.confirmPasswordInput();
  const match = !!this.passwordInput && this.passwordInput === confirmPassword;
  this.signalService.passwordsMatch.set(match);
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
    togglePasswordVisibility() {
      this.passwordVisible = !this.passwordVisible;
    }
  
    /** Toggles the visibility of the confirmation password input field. */
    toggleConfirmPasswordVisibility() {
      this.confirmPasswordVisible = !this.confirmPasswordVisible;
    }
}
