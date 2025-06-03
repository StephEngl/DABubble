import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SignalsService } from '../../services/signals.service';
import { AuthenticationService } from '../../services/authentication.service';
import { getAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-password-dialog',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './password-dialog.component.html',
  styleUrl: './password-dialog.component.scss',
})
export class PasswordDialogComponent {
  signalService = inject(SignalsService);
  authService = inject(AuthenticationService);

  errorMessage: string = '';
  emailInput: string = '';
  auth = getAuth();

  /**
   * Sends a password reset email to the specified address.
   * Displays an error toast if the operation fails.
   *
   * @param email - The email address to which the password reset email should be sent.
   */
  async sendMailForNewPassword(email: string) {
    try {
      await this.authService.sendMailForNewPassword(email);
    } catch (error) {
      this.signalService.triggerToast('Something went wrong', 'error');
    }
  }
}
