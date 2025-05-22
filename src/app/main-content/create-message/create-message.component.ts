import { Component, inject } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { ChannelsService } from '../../services/channels.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ChannelMessageInterface } from '../../interfaces/message.interface';

@Component({
  selector: 'app-create-message',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create-message.component.html',
  styleUrl: './create-message.component.scss'
})
export class CreateMessageComponent {

  channelService = inject(ChannelsService);
  messageText: string = '';

  // demo-data start
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
  // demo data end

  getMenuIcon(index: number): string {
    const color = this.menuOptions[index].hovered ? 'blue' : 'grey';
    const symbol = this.menuOptions[index].src;
    return `./../../../assets/icons/message/${symbol}_${color}.svg`;
  }

  sendMessage(form: NgForm) {
    if (!form.valid) return;
    const message: ChannelMessageInterface = { 
      text: this.messageText,
      createdAt: Timestamp.now(),
      senderId: '0vRFU6JRgcygyROgaJWo',
      reactions: []
    };
    this.channelService.postMessage(message);
    console.log("Valid message:", this.messageText);
    form.resetForm();
  }

}
