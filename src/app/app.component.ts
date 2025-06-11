/**
 * Root component of the application that
 * initializes theme and displays global components like router, toast, and intro.
 */
import { Component, inject, AfterViewChecked } from '@angular/core';
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
export class AppComponent implements AfterViewChecked {
  title = 'dabubble';
  signalService = inject(SignalsService);

  /** Lifecycle hook that runs on component init and sets the theme. */
  ngOnInit() {
    this.setTheme();
  }

  /** Lifecycle hook that runs on changes and sets the theme. */
  ngAfterViewChecked() {
    this.setTheme();
  }

  /** Sets the theme based on local storage and updates theme color signals. */
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
