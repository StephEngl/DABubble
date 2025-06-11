/**
 * Component for displaying and interacting with a single chat message.
 * Supports channel messages, direct messages, thread messages, and thread titles.
 * Provides UI for editing, reacting, and replying to messages.
 */

import { Component, HostListener, Input, inject } from '@angular/core';
import { ChannelsService } from '../../../services/channels.service';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SignalsService } from '../../../services/signals.service';
import { UsersService } from '../../../services/users.service';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import data from '@emoji-mart/data';
import { EmojiMartData } from '@emoji-mart/data';
import { MessageService } from '../../../services/message.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { TimeService } from '../../../services/time.service';
import { ConversationService } from '../../../services/conversations.service';
import { ChannelMessageInterface, DirectMessageInterface, ReactionInterface, ThreadMessageInterface } from '../../../interfaces/message.interface';

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
  conService = inject(ConversationService);
  signalService = inject(SignalsService);
  usersService = inject(UsersService);
  authService = inject(AuthenticationService);
  timeService = inject(TimeService);
  emojiData: EmojiMartData = data as EmojiMartData;

  @Input() paddingHorizontal: string = '';
  @Input() message: any = {};
  @Input() threadMessage: any = {};
  @Input() directMessage: any = {};
  @Input() threadTitle: any = {};

  @Input() isChannelMessage: boolean = false;
  @Input() isThreadMessage: boolean = false;
  @Input() isDirectMessage: boolean = false;
  @Input() isThreadTitle: boolean = false;

  currentMessageType: ChannelMessageInterface | DirectMessageInterface | ThreadMessageInterface | undefined = undefined;
  editMode: boolean = false;
  emojiBar: boolean = false;
  emojiBarEditMode: boolean = false;
  hoverMessage: boolean = false;
  messageEditText: string = '';
  hoveredReactionIndex: number | null = null;
  maxEmoji: number = 7;
  showAll: boolean = false;
  reactionHovered: boolean = false;
  paddingValue: string = '';

  /** Menu bar actions including reactions and thread actions */
  menuBar: {emoji?: string, imgSrc?: string, shownInThread: boolean, shownIfOwnMessage?: boolean, clickFunction: () => void}[] = [
    { 
      emoji : this.lastReactions()[0],
      shownInThread: false,
      clickFunction: () => this.messageService.postReaction(this.singleMessageId(), this.lastReactions()[0], this.reactions(), this.isChannelMessage)
    },
    { 
      emoji : this.lastReactions()[1],
      shownInThread: false,
      clickFunction: () => this.messageService.postReaction(this.singleMessageId(), this.lastReactions()[1], this.reactions(), this.isChannelMessage)
    },
    { 
      imgSrc: './../../../../assets/icons/message/add_reaction_'+ this.signalService.themeColorMain() + '.svg',
      shownInThread: true,
      clickFunction: () => this.emojiBar = true
    },
    { 
      imgSrc: './../../../../assets/icons/message/comment_'+ this.signalService.themeColorMain() + '.svg',
      shownInThread: false,
      clickFunction: () => this.openThread()
    },
    { 
      imgSrc: './../../../../assets/icons/message/more_options_'+ this.signalService.themeColorMain() + '.svg',
      shownInThread: true,
      shownIfOwnMessage: true,
      clickFunction: () => this.editMode = true
    },
  ];

  ngOnInit() {
    this.setMessageSource();
    this.setInitialReactionsToBar();
    this.paddingValue = this.getPadding();
    this.messageEditText = this.text();
    this.checkifOwnMessage();
    this.maxEmoji = this.setMaxEmojiLength();
  }

  /** Recalculate padding on window resize */
  @HostListener('window: resize')
    setPadding() {
      this.paddingValue = this.getPadding();
    }

  /** Determine which message input is active based on context */
  setMessageSource():void {
    if (this.isChannelMessage) {
      this.currentMessageType = this.message;
    } else if (this.isThreadMessage) {
      this.currentMessageType = this.threadMessage;
    } else if (this.isThreadTitle) {
      this.currentMessageType = this.threadTitle;
    } else if (this.isDirectMessage) {
      this.currentMessageType = this.directMessage;
    }
  }

  /** Check whether any message exists */
  messageExist():boolean {
    return this.isChannelMessage || this.isThreadTitle || this.isThreadMessage || this.isDirectMessage
  }

  /** Determine whether the current message was sent by the logged-in user */
  checkifOwnMessage():boolean {
    return ((this.message.senderId || this.threadMessage.senderId || this.directMessage.senderId) === this.authService.userId);
  }

  /** Open a thread view and set active context */
  openThread():void {
    localStorage.setItem('currentThread', this.message.id);
    const currentThreadId = localStorage.getItem('currentThread');
    const currentChannelId = localStorage.getItem('currentChannel');
    if (currentChannelId && currentThreadId) {
      this.channelService.subscribeToThreadMessages(currentChannelId, currentThreadId);
    }
    this.signalService.showThread.set(true);
    this.signalService.focusThread.set(true);
    this.signalService.showOnlyThreadOnMobile();
  }

  /** Set a direct reply-to context */
  replyTo():void {
    this.signalService.activeReplyToId.set(this.directMessage.id);
    this.signalService.focusConversation.set(true);
  }

  /** Fetch referenced reply message */
  replyMessageInfo() {
    if (this.isDirectMessage) {
      const conId = this.signalService.activeConId();
      const messageId = this.directMessage.replyTo;
      return this.conService.getMessageById(conId, messageId);
    } else {
      return null;
    }
  }

  /** Returns the timestamp of the last reply in the thread */
  get lastReply():any {
    const indexLastEntry = this.message.threadMessages.length -1;
    if (window.innerWidth > 950) {
      return this.timeService.getDate(this.message.threadMessages[indexLastEntry].createdAt.toDate(), 'last-thread')
    } else {
      return this.timeService.getDate(this.message.threadMessages[indexLastEntry].createdAt.toDate(), 'dd-mm-yyyy')
    }
  }

  /** Returns the creation time of the current message */
  createdAt():string {
    return this.currentMessageType
    ? this.timeService.getDate(this.currentMessageType.createdAt.toDate(), 'hh-mm')
    : 'Unknown';
  }

  /** Returns the text of the current message */
  text():string {
    return this.currentMessageType ? this.currentMessageType.text : '';
  }

  /** Returns the list of emoji reactions */
  reactions(): ReactionInterface[] {
    return this.currentMessageType ? this.currentMessageType.reactions : [];
  }

  /** Returns the ID of the current message */
  singleMessageId():string {
    return this.currentMessageType ? this.currentMessageType.id! : 'Unknown';
  }

  /**
   * Sends an updated message text to the backend.
   * @param id ID of the message being edited
   */
  sendMessageUpdate(id: string) {
    const message = this.messageEditText;
    if(this.isChannelMessage) {
      this.messageService.updateMessage(id, { text: message }, {});
    } else if(this.isDirectMessage) {
      this.messageService.updateDirectMessage(id, { text: message });
    } else {
      this.messageService.updateMessage(id, { text: message }, { isThread: true });
    }
  }

  /** Returns the sender's display name */
  showName(): string {
    return this.currentMessageType ? this.usersService.findName(this.currentMessageType.senderId) : 'Unknown';
  }

  /** Returns the sender's avatar image path */
  showAvatar(): string {
    return this.currentMessageType
    ? this.usersService.getAvatar(this.currentMessageType.senderId)
    : './../../../../assets/icons/user/user_0.png';
  }

  /** Initializes the localStorage with default reactions if none exist. */
  setInitialReactionsToBar():void {
    const lastReactions = localStorage.getItem('lastReactions');
    if (!lastReactions) {
      localStorage.setItem('lastReactions', JSON.stringify(['😂','👍']));
    }
  }

  /**
   * Returns the last used reactions from localStorage or initializes them.
   * @returns An array of the last used emoji reactions.
   */
  lastReactions(): string[] {
    const lastReactions = localStorage.getItem('lastReactions');
    if (!lastReactions) {
      this.setInitialReactionsToBar();
      return ['😂', '👍'];
    } else {
      return JSON.parse(lastReactions);
    }
  }

  /**
   * Adds a new emoji to the recent reactions list.
   * @param emoji The emoji to be added to the recent reactions.
   */
  addToLastReactions(emoji: string) {
    let reactionsArray = this.lastReactions();
    if (reactionsArray.includes(emoji)) return;
    reactionsArray.unshift(emoji);
    reactionsArray = reactionsArray.slice(0, 2);
    localStorage.setItem('lastReactions', JSON.stringify(reactionsArray));
    this.lastReactions();
  }

  /**
   * Handles emoji selection from the picker.
   * @param event Emoji selection event
   */
  emojiSelect(event: any): void {
    if (this.emojiBar) {
      this.handleEmojiReaction(event.emoji.native);
    } else {
      this.appendEmojiToMessage(event.emoji.native);
    }
  }

  /**
   * Handles posting a reaction emoji.
   * @param emoji The emoji character
   */
  handleEmojiReaction(emoji: string): void {
    if (!this.isDirectMessage) {
      this.postChannelReaction(emoji);
    } else {
      this.postDirectMessageReaction(emoji);
    }
  }

  /**
   * Posts a reaction for a channel message.
   * @param emoji The emoji character
   */
  postChannelReaction(emoji: string): void {
    this.messageService.postReaction(
      this.singleMessageId(),
      emoji,
      this.reactions(),
      this.isChannelMessage
    );
    this.addToLastReactions(emoji);
  }

  /**
   * Posts a reaction for a direct message.
   * @param emoji The emoji character
   */
  postDirectMessageReaction(emoji: string): void {
    this.messageService.postDirectMessageReaction(
      this.singleMessageId(),
      emoji,
      this.reactions()
    );
  }

  /**
   * Appends emoji to the message being edited.
   * @param emoji The emoji character
   */
  appendEmojiToMessage(emoji: string): void {
    this.messageEditText += " " + emoji;
    this.emojiBarEditMode = false;
  }

  /** Toggle whether to show all emoji reactions */
  toggleShownEmojis():void {
    this.showAll = !this.showAll;
    const totalEmojis = this.reactions()?.length || 0;
    this.showAll ? this.maxEmoji = totalEmojis : this.maxEmoji = this.setMaxEmojiLength();
  }

  /** Set maximum number of emoji to display based on screen size */
  setMaxEmojiLength():number {
    return window.innerWidth < 850 ? 3 : 7;
  }

  /**
   * Returns display name for a user by ID.
   * @param id User ID
   */
  showUserName(id: string):string {
    return this.usersService.findName(id);
  }

  /**
   * Shows reaction hover info at given index.
   * @param index Reaction index
   */
  showReactionInfos(index: number) {
    this.hoveredReactionIndex = index;
  }

  /** Hide emoji reaction info */
  hideReactionInfos() {
    this.hoveredReactionIndex = null;
  }

  /** Get appropriate padding based on screen width */
  getPadding(): string {
    return window.innerWidth < 850
    ? '20px 16px 20px ' + this.paddingHorizontal + 'px'
    : '20px ' + this.paddingHorizontal + 'px';
  }

}
