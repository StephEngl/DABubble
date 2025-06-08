/**
 * UI component for the channel header section, including user mentions, 
 * channel tagging, and direct message interactions. Handles input, search, 
 * and dynamic UI behaviors related to chat context.
 */
import { Component, inject, ViewChild, ElementRef } from '@angular/core';
import { ChannelsService } from '../../../services/channels.service';
import { ChannelInterface } from '../../../interfaces/channel.interface';
import { UsersService } from '../../../services/users.service';
import { SignalsService } from '../../../services/signals.service';
import { FormsModule } from '@angular/forms';
import { ConversationService } from '../../../services/conversations.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { UserInterface } from '../../../interfaces/user.interface';

@Component({
  selector: 'app-channel-header',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './channel-header.component.html',
  styleUrl: './channel-header.component.scss'
})
export class ChannelHeaderComponent {

  channelService = inject(ChannelsService);
  usersService = inject(UsersService);
  conService = inject(ConversationService);
  signalService = inject(SignalsService);
  authService = inject(AuthenticationService);

  @ViewChild('messageInput') messageInputRef!: ElementRef<HTMLTextAreaElement>;

  addMembersHovered: boolean = false;
  showMembersHovered: boolean = false;
  dropdownMembers: boolean = true;
  inputText: string = '';
  mentionTrigger: '@' | '#' | null = null;
  showList: boolean = false;

  dropdownOpen:boolean = false;

  /** Returns the current channel based on local storage. */
  get currentChannel(): ChannelInterface | undefined {
    const currentId = localStorage.getItem('currentChannel');
    if (!currentId) return undefined;
    return this.channelService.getChannelById(currentId);
  }

  /** Appends '@' to input and shows user/channel list. */
  onMentionSelect(): void {
    if (this.inputText?.slice(-1) === "@") return;
    this.inputText += "@";
    this.triggerUserOrChannelList();
    this.onFocus();
  }

  /**
   * Switches to the tagged channel.
   * @param id ID of the selected channel
   */
  tagChannel(id: string): void {
    this.inputText = "";
    this.showList = false;
    localStorage.setItem("currentChannel", id);
    this.channelService.subscribeToChannelMessages(id);
    this.signalService.scrollChannelToBottom.set(true);
    this.signalService.focusChat.set(true);
  }

  /** Focuses the message input and resets focus signals. */
  onFocus(): void {
    this.messageInputRef?.nativeElement.focus();
    this.signalService.focusChat.set(false);
    this.signalService.focusThread.set(false);
  }

  /** Filters channels based on current #mention input. */
  get searchResultsChannel(): ChannelInterface[] {
    const match = this.inputText.match(/#(\w*)$/);
    const searchTerm = match?.[1]?.toLowerCase() ?? 'no results';
    return this.channelService.channels
      .filter(channel =>
        channel.channelName.toLowerCase().includes(searchTerm) &&
        this.isChannelMember(channel)
      );
  }

  /**
   * Checks whether current user is a member of given channel.
   * @param channel Channel to check membership for
   */
  isChannelMember(channel: ChannelInterface):boolean {
    return channel.members!.includes(this.authService.userId);
  }

  /** Filters users based on current @mention input. */
  get searchResultsUser(): UserInterface[] {
    if (!this.messageInputRef) return [];
    const match = this.inputText.match(/@([^@]*)$/);
    const searchTerm = match?.[1]?.toLowerCase().trim() ?? 'no results';
    return this.usersService.users
      .filter(user =>
        user.name.toLowerCase().includes(searchTerm)
      );
  }

  /** Detects @ or # triggers in input and shows matching list. */
  triggerUserOrChannelList(): void {
    const adressUser = this.inputText.match(/@([^@]*)$/);
    const adressChannel = this.inputText.match(/#(\w*)$/);
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

  /** Returns the user ID of the current direct message contact. */
  get directMessageContact(): string {
    const currentConId = this.signalService.activeConId();
    const currentConversation = this.conService.getConversationById(currentConId);
    const participant = this.conService.participant(currentConversation!);
    return participant;
  }

  /**
   * Starts a new conversation with the given user.
   * @param id User ID to start a conversation with
   */
  startConversation(id: string): void {
    this.conService.startNewConversation(id);
    this.inputText = "";
    this.showList = false;
  }

  /**
   * Opens the user info sidebar for the given user.
   * @param id User ID to show info for
   */
  showUserInfo(id: string): void {
    this.signalService.userInfoId.set(id);
    this.signalService.showUserInfo.set(true)
  }

}
