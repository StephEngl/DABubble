import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './shared/toast/toast.component';
import { IntroComponent } from './intro/intro.component';
import { SignalsService } from './services/signals.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent, IntroComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'dabubble';
  signalService = inject(SignalsService);

  ngOnInit() {
    this.setTheme();
  }

  ngOnChanges() {
    this.setTheme();
  }

  setTheme() {
    const theme = localStorage.getItem('theme');
    if(theme) {
      if (theme === 'dark-theme') {
        document.body.classList.add('dark-theme');
        this.signalService.themeColorMain.set('white');
      } else {
        document.body.classList.remove('dark-theme');
        this.signalService.themeColorMain.set('black');
      }
    } else {
      localStorage.setItem('theme', 'light');
    }

  }
}
