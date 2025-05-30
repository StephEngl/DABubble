import { Component, inject } from '@angular/core';
import { SignalsService } from '../../services/signals.service';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';

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

  formSubmitted = false;
  passwordVisible: Boolean = false;
  confirmPasswordVisible: Boolean = false;
  passwordInput: string = '';
  confirmPasswordInput: string = '';

  onSubmit(ngForm: NgForm) {}

  setNewPassword(password: string) {}

  get passwordsMatch(): boolean {
    if (this.passwordInput) {
      return (this.passwordInput === this.confirmPasswordInput);
    } else {
      return false;
    }
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
