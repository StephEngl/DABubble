import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { SignalsService } from '../../services/signals.service';
import { getAuth, sendPasswordResetEmail } from '@angular/fire/auth';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-password-dialog',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './password-dialog.component.html',
  styleUrl: './password-dialog.component.scss',
})
export class PasswordDialogComponent {
  signalService = inject(SignalsService);
  toastService = inject(ToastService);
  emailInput: string = '';

  /**
   * Called when the login form is submitted.
   * Sets the submission flag if the login is not a guest login.
   * @param ngForm - The Angular form instance.
   */
  onSubmit(ngForm: NgForm) {}

  sendMailForNewPassword(email: string) {
    const auth = getAuth();
    sendPasswordResetEmail(auth, email, {
      // Optional: use of a continueUrl
      url: 'http://localhost:4200/login',
      handleCodeInApp: true,
    })
      .then(() => {
        this.toastService.triggerToast('Password reset', 'update');
        // alert('E-Mail zum Zurücksetzen wurde gesendet!');
        this.signalService.showPasswordResetDialog();
      })
      .catch((error) => {
        // Fehlerbehandlung
        alert('Fehler: ' + error.message);
      });
  }
}
