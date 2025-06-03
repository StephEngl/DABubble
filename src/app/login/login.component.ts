import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';
import { SignalsService } from '../services/signals.service';
import { RegisterDialogComponent } from './register-dialog/register-dialog.component';
import { PasswordDialogComponent } from './password-dialog/password-dialog.component';
import { ChooseAvatarDialogComponent } from './choose-avatar-dialog/choose-avatar-dialog.component';
import { PasswordResetDialogComponent } from './password-reset-dialog/password-reset-dialog.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterLink,
    LoginDialogComponent,
    RegisterDialogComponent,
    PasswordDialogComponent,
    PasswordResetDialogComponent,
    ChooseAvatarDialogComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  route = inject(ActivatedRoute);
  signalService = inject(SignalsService);

  /**
   * Angular lifecycle hook that is called after component initialization.
   * Subscribes to query parameters and handles password reset dialog display if appropriate.
   */
  ngOnInit() {
    this.handlePasswordResetDialogFromQueryParams();
  }

  /**
   * Checks the URL query parameters for a password reset request.
   * If the mode is 'resetPassword' and an oobCode is present,
   * shows the password reset dialog.
   */
  private handlePasswordResetDialogFromQueryParams(): void {
    this.route.queryParams.subscribe((params) => {
      if (this.isPasswordResetRequest(params)) {
        this.signalService.showPasswordResetDialog();
      }
    });
  }

  /**
   * Determines whether the query parameters indicate a password reset request.
   * @param params - The query parameters from the route.
   * @returns True if the mode is 'resetPassword' and an oobCode is present; otherwise, false.
   */
  private isPasswordResetRequest(params: { [key: string]: any }): boolean {
    return params['mode'] === 'resetPassword' && !!params['oobCode'];
  }
}
