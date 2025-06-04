import { Component, inject } from '@angular/core';
import { PasswordService } from '../../services/password.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-passwords',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './passwords.component.html',
  styleUrl: './passwords.component.scss'
})
export class PasswordsComponent {
  passwordService = inject(PasswordService);

  passwordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;
  passwordInput: string = '';
  confirmPasswordInput: string = '';
}
