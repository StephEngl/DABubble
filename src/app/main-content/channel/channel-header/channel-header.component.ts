import { Component } from '@angular/core';

@Component({
  selector: 'app-channel-header',
  standalone: true,
  imports: [],
  templateUrl: './channel-header.component.html',
  styleUrl: './channel-header.component.scss'
})
export class ChannelHeaderComponent {

  addMembersHovered: boolean = false;

}
