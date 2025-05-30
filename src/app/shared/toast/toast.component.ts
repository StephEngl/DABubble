import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignalsService } from '../../services/signals.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
})
export class ToastComponent {
  signalService = inject(SignalsService);
}
