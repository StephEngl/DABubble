/**
 * Component for composing and sending messages in channels,
 * threads, or direct conversations. Supports emoji picker,
 * mentions, and dynamic user/channel tagging.
 */
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
  conService = inject (ConversationService);
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

  /** Message input menu options with icons and click behavior */
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

  /** Checks focus state for chat, thread, or conversation after view update */
  ngAfterViewChecked() {
    if(this.isChannelMessage && this.signalService.focusChat()) {
      this.onFocus();
    }
    if(this.isThreadMessage && this.signalService.focusThread()) {
      this.onFocus();
    }
    if(this.isConversation && this.signalService.focusConversation()) {
      this.onFocus();
    }
  }

  /**
   * Returns the icon path based on hover state.
   * @param index - Index of the menu option.
   * @returns Path to the appropriate icon.
   */
  getMenuIcon(index: number): string {
    const color = this.menuOptions[index].hovered ? 'blue' : 'grey';
    const symbol = this.menuOptions[index].src;
    return `./assets/icons/message/${symbol}_${color}.svg`;
  }

  /**
   * Sends a new message and resets the form.
   * @param form - The message input form.
   */
  sendMessage(form: NgForm) {
    if (!form.valid) return;
    this.disableScrolling();
    const currentChannel = localStorage.getItem('currentChannel');
    const message = this.messageObject();
    this.sortAndSendMessage(message);
    this.channelService.loadChannel(currentChannel!);
    this.resetFormData(form);
    this.signalService.activeReplyToId.set('');
    this.onFocus();
  }

  disableScrolling() {
    this.signalService.sendingMessage.set(true);
    setTimeout(() => {
      this.signalService.sendingMessage.set(false);
    }, 2000);
  }

  /**
   * Clears the form and resets local message state.
   * @param form - The message input form.
   */
  resetFormData(form: NgForm) {
    form.resetForm();
    this.messageInputRef.nativeElement.value = '';
    this.messageText = '';
  }

  /**
   * Intercepts Enter key for message sending.
   * @param event - The keyboard event.
   * @param form - The message input form.
   */
  onKeyDown(event: KeyboardEvent, form: NgForm): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage(form);
    }
  }

  /** Creates the message object from current input */
  messageObject(): ChannelMessageInterface {
    return { 
      text: this.messageText,
      createdAt: Timestamp.now(),
      senderId: this.authService.userId,
      reactions: [],
    }
  }

  /**
   * Routes the message to the correct service depending on context.
   * @param message - The composed message object.
   */
  sortAndSendMessage(message: any) {
    if (this.isChannelMessage) {
      this.messageService.postMessage(message);
    } else if (this.isThreadMessage) {
      this.messageService.postThreadMessage(message);
    } else if(this.isConversation) {
      if (this.signalService.activeReplyToId() !== '') {
        const messageWithReplyTo = { ...message, replyTo: this.signalService.activeReplyToId() };
        this.messageService.postDirectMessage(this.signalService.activeConId(),messageWithReplyTo);
      } else {
        this.messageService.postDirectMessage(this.signalService.activeConId(),message);
      }
    }
  }

  /**
   * Handles emoji selection from picker.
   * @param event - Emoji picker event object.
   */
  onEmojiSelect(event: any) {
    this.messageText += " " + event.emoji.native;
    this.emojiBar = false;
  }

  /** Appends mention trigger to input and focuses */
  onMentionSelect() {
    if (this.messageText?.slice(-1) === "@") return;
    this.messageText += "@";
    this.triggerUserOrChannelList();
    this.onFocus();
  }

  /**
   * Inserts user mention at cursor.
   * @param name - Username to mention.
   */
  tagChannelOrUser(name: string, tagUser: boolean) {
    const mention = tagUser? `@${name}` : `#${name}`;
    if (this.messageText.includes(mention)) return;

    const text = this.messageText;
    const atIndex = tagUser? text.lastIndexOf('@') : text.lastIndexOf('#');
    if (atIndex === -1) return;

    const spaceIndex = text.lastIndexOf(' ', atIndex);
    const start = spaceIndex + 1;

    this.messageText = text.slice(0, start) + mention + ' ' + text.slice(atIndex + 1).replace(/^\S*/, '');
    this.showList = false;
  }

  /** Focuses the message input and clears focus states */
  onFocus() {
    this.messageInputRef?.nativeElement.focus();
    this.signalService.focusChat.set(false);
    this.signalService.focusThread.set(false);
  }

  /** Returns filtered channel results for mention autocompletion */
  get searchResultsChannel() {
    const match = this.messageText.match(/#(\w*)$/);
    const searchTerm = match?.[1]?.toLowerCase() ?? 'no results';

    return this.channelService.channels.filter(channel =>
      channel.channelName.toLowerCase().includes(searchTerm)
    );
  }

  /** Returns filtered user results for mention autocompletion */
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

  /** Detects trigger characters and shows suggestion list */
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

  /** Gets reply message info for direct conversation replies */
  get replyToInfo() {
    const conversationId = this.signalService.activeConId();
    const replyToId = this.signalService.activeReplyToId();
    return this.conService.getMessageById(conversationId, replyToId);
  }

  /**
   * Returns shortened version of a name for display.
   * @param name - Name string to shorten.
   * @returns The shortened name with ellipsis if needed.
   */
  showMaxLetters(name: string):string {
    const max = 15;
    let nameLength = name.length;
    if (nameLength > max) {
      nameLength = max;
      return name.substring(0, nameLength) + '...';
    } else {
      return name
    }
  }

}
