import { Component, inject } from '@angular/core';
import { SignalsService } from '../../services/signals.service';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { ActivatedRoute } from '@angular/router';
import { PasswordService } from '../../services/password.service';
import { PasswordsComponent } from '../passwords/passwords.component';

@Component({
  selector: 'app-password-reset-dialog',
  standalone: true,
  imports: [FormsModule, PasswordsComponent],
  templateUrl: './password-reset-dialog.component.html',
  styleUrl: './password-reset-dialog.component.scss',
})
export class PasswordResetDialogComponent {
  authService = inject(AuthenticationService);
  signalService = inject(SignalsService);
  passwordService = inject(PasswordService);

  oobCode: string = '';
  email: string = '';
  error: string = '';

  constructor(private route: ActivatedRoute) {}

  /**
   * Angular lifecycle hook that is called after component initialization.
   * Initiates extraction of the oobCode from the URL.
   */
  async ngOnInit() {
    this.extractOobCodeOutOfURL();
    this.signalService.passwordsMatch.set(false);
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
   * Handles form submission: validates input and handles errors.
   */
  async setNewPassword() {
    if (!this.signalService.passwordsMatch() || !this.oobCode) return;
    this.passwordService.setNewPassword(this.oobCode, this.signalService.confirmPasswordInput());
  }
}
