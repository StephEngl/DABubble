import { Component, inject, Input } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { ChannelsService } from '../../services/channels.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ChannelMessageInterface } from '../../interfaces/message.interface';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import data from '@emoji-mart/data';
import { EmojiMartData } from '@emoji-mart/data';

@Component({
  selector: 'app-create-message',
  standalone: true,
  imports: [FormsModule, PickerModule],
  templateUrl: './create-message.component.html',
  styleUrl: './create-message.component.scss'
})
export class CreateMessageComponent {

  channelService = inject(ChannelsService);
  @Input() isChannelMessage: boolean = false;
  messageText: string = '';

  emojiData: EmojiMartData = data as EmojiMartData;
  emojiBar: boolean = false;

  menuOptions: {name: string, src: string, hovered: boolean, clickFunction: () => void}[] = [
    {
      name: "add-reaction",
      src: 'emoji_satisfied',
      hovered: false,
      clickFunction: () => this.emojiBar = true,
    },
    {
      name: "adress-user",
      src: 'email_at',
      hovered: false,
      clickFunction: () => console.log("adress user")
    }
  ];

  getMenuIcon(index: number): string {
    const color = this.menuOptions[index].hovered ? 'blue' : 'grey';
    const symbol = this.menuOptions[index].src;
    return `./../../../assets/icons/message/${symbol}_${color}.svg`;
  }

  sendMessage(form: NgForm) {
    if (!form.valid) return;
    const currentChannel = localStorage.getItem('currentChannel');
    const message: ChannelMessageInterface = { 
      text: this.messageText,
      createdAt: Timestamp.now(),
      senderId: '0vRFU6JRgcygyROgaJWo',
      reactions: []
    };
    if (this.isChannelMessage) {
      this.channelService.postMessage(message);
    } else {
      this.channelService.postThreadMessage(message);
    }
    console.log("Valid message:", this.messageText);
    this.channelService.loadChannel(currentChannel!);
    form.resetForm();
  }

  onEmojiSelect(event: any) {
    this.messageText += " " + event.emoji.native;
    this.emojiBar = false;
  }

}
