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
  styleUrl: './passwords.component.scss',
})
export class PasswordsComponent {
  passwordService = inject(PasswordService);
  signalService = inject(SignalsService);
  authService = inject(AuthenticationService);
  auth = inject(Auth);

  passwordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;
  passwordInput: string = '';

/**
 * Handles changes to the password input field.
 *
 * Retrieves the current value of the confirm password input from the signal service,
 * then checks if the main password input is non-empty and matches the confirm password.
 * Updates the `passwordsMatch` signal in the signal service to reflect whether the passwords match.
 * */
  onPasswordInputChange() {
    const confirmPassword = this.signalService.confirmPasswordInput();
    const match =
      !!this.passwordInput && this.passwordInput === confirmPassword;
    this.signalService.passwordsMatch.set(match);
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
