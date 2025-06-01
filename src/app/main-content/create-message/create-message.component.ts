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
import { AuthenticationService } from '../../services/authentication.service';
import { ConversationService } from '../../services/conversations.service';

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
  authService = inject(AuthenticationService);

  @Input() isChannelMessage: boolean = false;
  @Input() isThreadMessage: boolean = false;
  @Input() isConversation: boolean = false;
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
    this.signalService.sendingMessage.set(true);
    const currentChannel = localStorage.getItem('currentChannel');
    const message: ChannelMessageInterface = this.messageObject();
    this.sortAndSendMessage(message);
    this.channelService.loadChannel(currentChannel!);
    form.resetForm();
    this.onFocus();
    setTimeout(() => {
      this.signalService.sendingMessage.set(false);
    }, 1000);
  }

  messageObject() {
    return { 
      text: this.messageText,
      createdAt: Timestamp.now(),
      senderId: this.authService.userId,
      reactions: []
    };
  }

  sortAndSendMessage(message: any) {
    if (this.isChannelMessage) {
      this.messageService.postMessage(message);
    } else if (this.isThreadMessage) {
      this.messageService.postThreadMessage(message);
    } else if(this.isConversation) {
      this.messageService.postDirectMessage(this.signalService.activeConId(),message);
    }
  }

  onEmojiSelect(event: any) {
    this.messageText += " " + event.emoji.native;
    this.emojiBar = false;
  }

  onMentionSelect() {
    if (this.messageText?.slice(-1) === "@") return;
    this.messageText += "@";
    this.triggerUserOrChannelList();
    this.onFocus();
  }

  tagUser(name: string) {
    const mention = `@${name}`;
    if (this.messageText.includes(mention)) return;

    const text = this.messageText;
    const atIndex = text.lastIndexOf('@');
    if (atIndex === -1) return;

    const spaceIndex = text.lastIndexOf(' ', atIndex);
    const start = spaceIndex + 1;

    this.messageText = text.slice(0, start) + mention + ' ' + text.slice(atIndex + 1).replace(/^\S*/, '');
    this.showList = false;
  }

  tagChannel(id: string) {
    this.messageText = "";
    this.showList = false;
    localStorage.setItem("currentChannel", id);
    this.channelService.subscribeToChannelMessages(id);
    this.signalService.scrollChannelToBottom.set(true);
    this.signalService.focusChat.set(true);
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

  triggerUserOrChannelList() {
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
