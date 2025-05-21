import { Component } from '@angular/core';

@Component({
  selector: 'app-direct-messages-list',
  standalone: true,
  imports: [],
  templateUrl: './direct-messages-list.component.html',
  styleUrl: './direct-messages-list.component.scss'
})
export class DirectMessagesListComponent {
  tempArrayItemCount: string[] = ['fem_1', 'fem_2', 'mal_1', 'mal_2', 'mal_3'];
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
