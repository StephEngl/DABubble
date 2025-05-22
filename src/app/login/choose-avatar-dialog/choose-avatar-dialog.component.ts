import { Component, inject } from '@angular/core';
import { SignalsService } from '../../services/signals.service';

@Component({
  selector: 'app-choose-avatar-dialog',
  standalone: true,
  imports: [],
  templateUrl: './choose-avatar-dialog.component.html',
  styleUrl: './choose-avatar-dialog.component.scss'
})
export class ChooseAvatarDialogComponent {
  signalService = inject(SignalsService);


  backToRegister() {
    this.signalService.isLoginDialog.set(false);
    this.signalService.isRegisterDialog.set(true);
    this.signalService.isChoosingAvatarDialog.set(false);
    this.signalService.isPasswordForgottenDialog.set(false);
  }

  createAccount() {
    this.signalService.isLoginDialog.set(true);
    this.signalService.isRegisterDialog.set(false);
    this.signalService.isChoosingAvatarDialog.set(false);
    this.signalService.isPasswordForgottenDialog.set(false);
  }
}
