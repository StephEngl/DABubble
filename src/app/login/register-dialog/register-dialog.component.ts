import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { UserInterface } from '../../interfaces/user.interface';
import { AuthenticationService } from '../../services/authentication.service';
import { SignalsService } from '../../services/signals.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register-dialog',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register-dialog.component.html',
  styleUrl: './register-dialog.component.scss',
})
export class RegisterDialogComponent {
  signalService = inject(SignalsService);
  formSubmitted = false;
  passwordVisible: Boolean = false;
  nameInput: string = '';
  emailInput: string = '';
  passwordInput: string = '';
  privacyPolicyAccepted:boolean = false;

  backToLogin() {
    this.signalService.isLoginDialog.set(true);
    this.signalService.isRegisterDialog.set(false);
    this.signalService.isChoosingAvatarDialog.set(false);
    this.signalService.isPasswordForgottenDialog.set(false);
  }

  /** Toggles the visibility of the password input field. */
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  onSubmit(ngForm: NgForm) {
    this.formSubmitted = true;
  }

  goToAvatarChoice(name: string, mail: string, password: string) {
    this.signalService.isLoginDialog.set(false);
    this.signalService.isRegisterDialog.set(false);
    this.signalService.isChoosingAvatarDialog.set(true);
    this.signalService.isPasswordForgottenDialog.set(false);
  }
}
