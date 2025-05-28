import { Component, inject, Input, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { ChannelsService } from '../../services/channels.service';
import { FormsModule, NgForm } from '@angular/forms';
import { ChannelMessageInterface } from '../../interfaces/message.interface';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import data from '@emoji-mart/data';
import { EmojiMartData } from '@emoji-mart/data';
import { MessageService } from '../../services/message.service';
import { SignalsService } from '../../services/signals.service';
import { ChannelInterface } from '../../interfaces/channel.interface';
import { UsersService } from '../../services/users.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-message',
  standalone: true,
  imports: [FormsModule, PickerModule, CommonModule],
  templateUrl: './create-message.component.html',
  styleUrl: './create-message.component.scss'
})
export class CreateMessageComponent implements AfterViewChecked {

  channelService = inject(ChannelsService);
  messageService = inject(MessageService);
  signalService = inject(SignalsService);
  usersService = inject(UsersService);

  @Input() isChannelMessage: boolean = false;
  @Input() isThreadMessage: boolean = false;
  @ViewChild('messageInput') messageInputRef!: ElementRef<HTMLTextAreaElement>;
  mentionTrigger: '@' | '#' | null = null;
  messageText: string = '';

  emojiData: EmojiMartData = data as EmojiMartData;
  emojiBar: boolean = false;
  showList: boolean = false;

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
      clickFunction: () => this.onMentionSelect()
    }
  ];

  ngAfterViewChecked() {
    if(this.isChannelMessage && this.signalService.focusChat()) {
      this.onFocus();
    }
    if(this.isThreadMessage && this.signalService.focusThread()) {
      this.onFocus();
    }
  }

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
      this.messageService.postMessage(message);
    } else {
      this.messageService.postThreadMessage(message);
    }
    console.log("Valid message:", this.messageText);
    this.channelService.loadChannel(currentChannel!);
    form.resetForm();
  }

  onEmojiSelect(event: any) {
    this.messageText += " " + event.emoji.native;
    this.emojiBar = false;
  }

  onMentionSelect() {
    if (this.messageText?.slice(-1) === "@") return;
    this.messageText += "@";
    this.searchForUserOrChannel();
    this.onFocus();
  }

  onFocus() {
    this.messageInputRef?.nativeElement.focus();
    this.signalService.focusChat.set(false);
    this.signalService.focusThread.set(false);
  }


  get searchResultsChannel() {
    const match = this.messageText.match(/#(\w*)$/);
    const searchTerm = match?.[1]?.toLowerCase() ?? 'no results';

    return this.channelService.channels.filter(channel =>
      channel.channelName.toLowerCase().includes(searchTerm)
    );
  }

  get searchResultsUser() {
    if (!this.messageInputRef) return [];

    const match = this.messageText.match(/@([^@]*)$/);
    const searchTerm = match?.[1]?.toLowerCase().trim() ?? 'no results';

    const currentChannelId = localStorage.getItem("currentChannel");
    const currentChannel = this.channelService.getChannelById(currentChannelId!);
    if (!currentChannel) return [];

    return this.usersService.users
      .filter(user =>
        currentChannel.members!.includes(user.id!) &&
        user.name.toLowerCase().includes(searchTerm)
      );
  }

  searchForUserOrChannel() {
    const adressUser = this.messageText.match(/@([^@]*)$/);
    const adressChannel = this.messageText.match(/#(\w*)$/);
    if (adressUser) {
      this.mentionTrigger = '@';
      this.showList = true;
    } else if (adressChannel) {
      this.mentionTrigger = '#';
      this.showList = true;
    } else {
      this.showList = false;
    }
  }

}
