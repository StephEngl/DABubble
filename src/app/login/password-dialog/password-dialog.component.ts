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

  isUserExisting: boolean = false;
  checkMailAdress: boolean = false;
  emailInput: string = '';
  infoMessage: string = '';
  errorMessage: string = '';
  auth = getAuth();

  async checkIfUserExists() {
    this.isUserExisting = true;
    // const currentUser = await this.authService.currentUser();
    // if (!currentUser) return;
    // this.isUserExisting = true;
  }

  async sendMailForNewPassword(email: string) {
    await this.checkIfUserExists();
    if (!this.isUserExisting) {
      this.checkMailAdress = true;
      this.signalService.triggerToast(
        'User doesn`t exist',
        'error'
      );
      setTimeout(() => {
        this.checkMailAdress = false;
      }, 5000)
      return;
    } else {
      await this.authService.sendMailForNewPassword(email);
    }
  }
}
