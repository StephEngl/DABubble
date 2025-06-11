import { Component, inject } from '@angular/core';
import { SignalsService } from '../services/signals.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss'
})
export class PrivacyPolicyComponent {
  signalService = inject(SignalsService)
}
