import { Component } from '@angular/core';

@Component({
  selector: 'app-direct-messages-list',
  standalone: true,
  imports: [],
  templateUrl: './direct-messages-list.component.html',
  styleUrl: './direct-messages-list.component.scss'
})
export class DirectMessagesListComponent {
  tempArrayItemCount: string[] = ['_1', '_2', '_3', '_4', '_5', '_6'];
  directMessageListOpened: boolean = false;
  directMessageListHovered: boolean = false;

  toggleDirectMessageList() {
    this.directMessageListOpened = !this.directMessageListOpened;
  }

  imageColor(input: boolean):string {
    const color = input ? 'blue' : 'black';
    return color; 
  }
}
