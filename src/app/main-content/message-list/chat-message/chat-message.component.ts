import { Component, Input, NgModule, inject } from '@angular/core';
import { ChannelsService } from '../../../services/channels.service';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SignalsService } from '../../../services/signals.service';
import { UsersService } from '../../../services/users.service';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import data from '@emoji-mart/data';
import { EmojiMartData } from '@emoji-mart/data';
import { ReactionInterface } from '../../../interfaces/message.interface';
import { MessageService } from '../../../services/message.service';

@Component({
  selector: 'app-chat-message',
  standalone: true,
  imports: [NgClass, FormsModule, PickerModule],
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss','./../../../../assets/styles/emoji-mart.scss' ]
})

export class ChatMessageComponent {

  channelService = inject(ChannelsService);
  messageService = inject(MessageService);
  signalService = inject(SignalsService);
  usersService = inject(UsersService);
  // placeholder data: will be removed // start
  @Input() isOwnMessage: boolean = false;
  // placeholder data: will be removed // end

  emojiData: EmojiMartData = data as EmojiMartData;

  @Input() message: any = {};
  @Input() threadMessage: any = {};
  @Input() threadTitle: any = {};
  
  @Input() paddingHorizontal: string = '';
  @Input() isChannelMessage: boolean = false;
  @Input() isThreadMessage: boolean = false;
  @Input() isThreadTitle: boolean = false;

  editMode: boolean = false;
  emojiBar: boolean = false;
  emojiBarEditMode: boolean = false;
  hoverMessage: boolean = false;
  messageEditText: string = '';
  hoveredReactionIndex: number | null = null;
  maxEmoji: number = 7;
  showAll: boolean = false;
  reactionHovered: boolean = false;


  menuBar: {imgSrc: string, shownInThread: boolean, clickFunction: () => void}[] = [
    { 
      imgSrc: './../../../../assets/icons/message/emoji_laughing.png',
      shownInThread: false,
      clickFunction: () => this.messageService.postReaction(this.singleMessageId(), '😂', this.reactions(), this.isChannelMessage)
    },
    { 
      imgSrc: './../../../../assets/icons/message/emoji_thumbs_up.png',
      shownInThread: false,
      clickFunction: () => this.messageService.postReaction(this.singleMessageId(), '👍', this.reactions(), this.isChannelMessage)
    },
    { 
      imgSrc: './../../../../assets/icons/message/add_reaction_black.svg',
      shownInThread: true,
      clickFunction: () => this.emojiBar = true
    },
    { 
      imgSrc: './../../../../assets/icons/message/comment_black.svg',
      shownInThread: false,
      clickFunction: () => this.openThread()
    },
    { 
      imgSrc: './../../../../assets/icons/message/more_options_black.svg',
      shownInThread: true,
      clickFunction: () => this.editMode = true
    },
  ];

  ngOnInit() {
    this.messageEditText = this.text();
  }

  openThread() {
    localStorage.setItem('currentThread', this.message.id);
    const currentThreadId = localStorage.getItem('currentThread');
    const currentChannelId = localStorage.getItem('currentChannel');
    if (currentChannelId && currentThreadId) {
      this.channelService.subscribeToThreadMessages(currentChannelId, currentThreadId);
    }
    this.signalService.showThread.set(true);
    this.signalService.focusThread.set(true);
  }

  dateDayMonthYear(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    return `${day}.${month}.${year}`;
  }

  timeHourMinute(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  dateLastThread(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}.${month}.${year} | ${hours}:${minutes}`;
  }

  createdAt():string {
    if (this.isChannelMessage) {
        return this.timeHourMinute(this.message.createdAt.toDate())
      } else if (this.isThreadMessage) {
        return this.timeHourMinute(this.threadMessage.createdAt.toDate());
      } else if (this.isThreadTitle) {
        return this.timeHourMinute(this.threadTitle.createdAt.toDate());
      } else {
      return '';
    }
  }

  text() {
    if (this.isChannelMessage) {
      return this.message.text;
    } else if (this.isThreadMessage) {
      return this.threadMessage.text;
    } else if (this.isThreadTitle) {
      return this.threadTitle.text;
    } else {
      return '';
    }
  }

  reactions() {
    if (this.isChannelMessage) {
      return this.message.reactions;
    } else if (this.isThreadMessage) {
      return this.threadMessage.reactions;
    }
  }

  singleMessageId():string {
    if (this.isChannelMessage) {
      return this.message.id;
    } else if (this.isThreadMessage) {
      return this.threadMessage.id;
    } else {
      return 'unknown';
    }
  }

  sendMessageUpdate(id: string) {
    const message = this.messageEditText;
    if(this.isChannelMessage) {
      this.messageService.updateMessage(id, { text: message }, {});
    } else {
      this.messageService.updateMessage(id, { text: message }, { isThread: true });
    }
  }

  showName(): string {
    if (this.isChannelMessage && this.message?.senderId) {
      return this.usersService.findName(this.message.senderId);
    } else if (this.isThreadMessage && this.threadMessage?.senderId) {
      return this.usersService.findName(this.threadMessage.senderId);
    } else if (this.isThreadTitle && this.threadTitle.senderId) {
      return this.usersService.findName(this.threadTitle.senderId);
    }
    return 'Unknown';
  }

  showAvatar(): string {
    if (this.isChannelMessage && this.message?.senderId) {
      return this.usersService.getAvatar(this.message.senderId)
    } else if (this.isThreadMessage && this.threadMessage?.senderId) {
      return this.usersService.getAvatar(this.threadMessage.senderId);
    } else if (this.isThreadTitle && this.threadTitle.senderId) {
      return this.usersService.getAvatar(this.threadTitle.senderId);
    }
    return './../../../../assets/icons/user/user_0.svg';
  }

  onEmojiSelect(event: any):void {
    if(this.emojiBar) {
      this.messageService.postReaction
        (
          this.singleMessageId(),
          event.emoji.native,
          this.reactions(),
          this.isChannelMessage
        )
    } else {
      console.log("post in edit mode");
      this.messageEditText += " " + event.emoji.native;
      this.emojiBarEditMode = false;
    }
  }

  toggleShownEmojis():void {
    this.showAll = !this.showAll;
    this.maxEmoji = this.showAll ? this.reactions()?.length || 0 : 7;
  }

  showUserName(id: string):string {
    return this.usersService.findName(id);
  }

  showReactionInfos(index: number) {
    this.hoveredReactionIndex = index;
  }

  hideReactionInfos() {
    this.hoveredReactionIndex = null;
  }

}
