import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';
import { SignalsService } from '../services/signals.service';
import { RegisterDialogComponent } from './register-dialog/register-dialog.component';
import { PasswordDialogComponent } from './password-dialog/password-dialog.component';
import { ChooseAvatarDialogComponent } from './choose-avatar-dialog/choose-avatar-dialog.component';
import { PasswordResetDialogComponent } from './password-reset-dialog/password-reset-dialog.component';

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
  signalService = inject(SignalsService);
}
