import { Component } from '@angular/core';

@Component({
  selector: 'app-create-message',
  standalone: true,
  imports: [],
  templateUrl: './create-message.component.html',
  styleUrl: './create-message.component.scss'
})
export class CreateMessageComponent {

  menuOptions: {name: string, src: string, hovered: boolean}[] = [
    {
      name: "add-reaction",
      src: 'emoji_satisfied',
      hovered: false,
    },
    {
      name: "adress-user",
      src: 'email_at',
      hovered: false,
    }
  ];


  getMenuIcon(object: any): string {
    const color = object.hovered ? 'blue' : 'grey';
    const symbol = object.src;
    return `./../../../assets/icons/message/${symbol}_${color}.svg`;
  }

}
