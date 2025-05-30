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
import { AuthenticationService } from '../../../services/authentication.service';
import { TimeService } from '../../../services/time.service';

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
  authService = inject(AuthenticationService);
  timeService = inject(TimeService);

  emojiData: EmojiMartData = data as EmojiMartData;

  @Input() paddingHorizontal: string = '';
  @Input() message: any = {};
  @Input() threadMessage: any = {};
  @Input() threadTitle: any = {};
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
    this.checkifOwnMessage();
  }

  checkifOwnMessage() {
    return ((this.message.senderId || this.threadMessage.senderId) === this.authService.userId);
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


  createdAt():string {
    if (this.isChannelMessage) {
        return this.timeService.getDate(this.message.createdAt.toDate(), 'hh-mm');
      } else if (this.isThreadMessage) {
        return this.timeService.getDate(this.threadMessage.createdAt.toDate(), 'hh-mm');
      } else if (this.isThreadTitle) {
        return this.timeService.getDate(this.threadTitle.createdAt.toDate(), 'hh-mm');
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
    return './../../../../assets/icons/user/user_0.png';
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
