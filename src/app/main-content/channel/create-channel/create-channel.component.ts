import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MenuToggleService } from '../../../services/menu-toggle.service';

@Component({
  selector: 'app-create-channel',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create-channel.component.html',
  styleUrl: './create-channel.component.scss'
})
export class CreateChannelComponent {

  menuToggleService = inject(MenuToggleService);
  channelNameInput: string = "";
  channelDescriptionInput: string = "";

  submitForm(ngForm: NgForm) {

  }
}
