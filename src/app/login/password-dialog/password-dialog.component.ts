import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { SignalsService } from '../../services/signals.service';
import { getAuth } from '@angular/fire/auth';
import { AuthenticationService } from '../../services/authentication.service';

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

  // isUserExisting: boolean = false;
  // checkMailAdress: boolean = false;
  emailInput: string = '';
  infoMessage: string = '';
  errorMessage: string = '';
  auth = getAuth();

  async sendMailForNewPassword(email: string) {
    try {
      await this.authService.sendMailForNewPassword(email);
    } catch (error) {
        this.signalService.triggerToast('Something went wrong', 'error');
    }
  }
}
