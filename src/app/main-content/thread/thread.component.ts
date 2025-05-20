import { Component } from '@angular/core';
import { CreateMessageComponent } from '../create-message/create-message.component';

@Component({
  selector: 'app-thread',
  standalone: true,
  imports: [CreateMessageComponent],
  templateUrl: './thread.component.html',
  styleUrl: './thread.component.scss'
})
export class ThreadComponent {

}
