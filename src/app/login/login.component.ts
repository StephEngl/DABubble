import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, LoginDialogComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  
}
