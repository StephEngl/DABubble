import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { SignalsService } from '../../services/signals.service';

@Component({
  selector: 'app-password-dialog',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './password-dialog.component.html',
  styleUrl: './password-dialog.component.scss',
})
export class PasswordDialogComponent {
  signalService = inject(SignalsService);
  emailInput: string = '';

  /**
   * Called when the login form is submitted.
   * Sets the submission flag if the login is not a guest login.
   * @param ngForm - The Angular form instance.
   */
  onSubmit(ngForm: NgForm) {}

  backToLogin() {
    this.signalService.isLoginDialog.set(true);
    this.signalService.isRegisterDialog.set(false);
    this.signalService.isChoosingAvatarDialog.set(false);
    this.signalService.isPasswordForgottenDialog.set(false);
  }

  sendMailForNewPassword(email: string) {
    // send mail to reset password
    this.backToLogin();
  }
}
