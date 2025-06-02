import { Component, inject } from '@angular/core';
import { SignalsService } from '../../services/signals.service';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { UsersService } from '../../services/users.service';
import { UserInterface } from '../../interfaces/user.interface';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-password-reset-dialog',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './password-reset-dialog.component.html',
  styleUrl: './password-reset-dialog.component.scss',
})
export class PasswordResetDialogComponent {
  authService = inject(AuthenticationService);
  signalService = inject(SignalsService);
  userService = inject(UsersService);

  formSubmitted = false;
  passwordVisible: Boolean = false;
  confirmPasswordVisible: Boolean = false;
  passwordInput: string = '';
  confirmPasswordInput: string = '';

  oobCode: string = '';
  email: string = '';
  error: string = '';

  currentUser?: UserInterface;

  constructor(private route: ActivatedRoute) {}

  async ngOnInit() {
    // Extraxts oobCode out of URL
    this.route.queryParams.subscribe(async params => {
      this.oobCode = params['oobCode'] || '';
      if (this.oobCode) {
        try {
          this.email = await this.authService.verifyPasswordResetCode(this.oobCode);
        } catch (err: any) {
          this.error = 'This Link is invalid or expired.';
        }
      }
    });
  }

  // ngOnInit() {
  //   this.getCurrentUser();
  // }

  // async getCurrentUser() {
  //   const uid = this.signalService.currentUid();
  //   console.log(uid);
  //   if (!uid) return;

  //   this.currentUser = await this.userService.getUserByUid(uid);
  // }

  onSubmit(ngForm: NgForm) {}

  setNewPassword(password: string) {
    if (!this.currentUser) return;

    this.signalService.triggerToast('Password reset', 'confirm');
    setTimeout(() => {
      this.signalService.backToLogin();
    }, 2500);
  }

  get passwordsMatch(): boolean {
    if (this.passwordInput) {
      return this.passwordInput === this.confirmPasswordInput;
    } else {
      return false;
    }
  }

  /** Toggles the visibility of the password input field. */
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  /** Toggles the visibility of the confirmation password input field. */
  toggleConfirmPasswordVisibility() {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }
}
