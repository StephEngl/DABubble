import { Component, inject } from '@angular/core';
import { SignalsService } from '../../services/signals.service';

@Component({
  selector: 'app-password-reset-dialog',
  standalone: true,
  imports: [],
  templateUrl: './password-reset-dialog.component.html',
  styleUrl: './password-reset-dialog.component.scss'
})
export class PasswordResetDialogComponent {
signalService = inject(SignalsService);

}
