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

ngOnInit() {
  // Show Password-Reset-Dialog, after clicking link in password forgotten mail!
    this.route.queryParams.subscribe(params => {
      if (params['mode'] === 'resetPassword' && params['oobCode']) {
        this.signalService.showPasswordResetDialog();
      }
    });
  }

  showTestToast() {
    this.signalService.triggerToast('Zeig mal her', 'create', '/assets/icons/login/lock_grey.svg')
  }
}
