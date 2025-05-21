import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';
import { SignalsService } from '../services/signals.service';
import { RegisterDialogComponent } from './register-dialog/register-dialog.component';
import { PasswordDialogComponent } from './password-dialog/password-dialog.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, LoginDialogComponent, RegisterDialogComponent, PasswordDialogComponent ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  signalService = inject(SignalsService);

  // isLoginDialog: boolean = true;
  // isRegisterDialog: boolean = false;
  // isChoosingAvatarDialog: boolean = false;
  // isPasswordForgottenDialog: boolean = false;

  showRegisterDialog() {
    this.signalService.isLoginDialog.set(false);
    this.signalService.isRegisterDialog.set(true);
    this.signalService.isChoosingAvatarDialog.set(false);
    this.signalService.isPasswordForgottenDialog.set(false);
  }
}
