import { Component, inject } from '@angular/core';
import { SignalsService } from '../services/signals.service';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss'
})
export class PrivacyPolicyComponent {
signalService = inject(SignalsService)
}
