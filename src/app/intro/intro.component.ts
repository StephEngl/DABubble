import { Component, inject } from '@angular/core';
import { SignalsService } from '../services/signals.service';

@Component({
  selector: 'app-intro',
  standalone: true,
  imports: [],
  templateUrl: './intro.component.html',
  styleUrl: './intro.component.scss',
})
export class IntroComponent {
  signalService = inject(SignalsService);

  constructor() {
    this.signalService.startIntroAnimation()
  }
}
