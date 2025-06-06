import { Component, inject } from '@angular/core';
import { SignalsService } from '../services/signals.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-legal-notice',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './legal-notice.component.html',
  styleUrl: './legal-notice.component.scss'
})
export class LegalNoticeComponent {
signalService = inject(SignalsService)
}
