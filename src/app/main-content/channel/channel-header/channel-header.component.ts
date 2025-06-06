import { Component, inject, ViewChild, ElementRef } from '@angular/core';
import { ChannelsService } from '../../../services/channels.service';
import { ChannelInterface } from '../../../interfaces/channel.interface';
import { UsersService } from '../../../services/users.service';
import { SignalsService } from '../../../services/signals.service';
import { FormsModule } from '@angular/forms';
import { ConversationService } from '../../../services/conversations.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { ConversationInterface } from '../../../interfaces/conversation.interface';
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

  get currentChannel(): ChannelInterface | undefined {
    const currentId = localStorage.getItem('currentChannel');
    if (!currentId) return undefined;
    return this.channelService.getChannelById(currentId);
  }

  onMentionSelect(): void {
    if (this.inputText?.slice(-1) === "@") return;
    this.inputText += "@";
    this.triggerUserOrChannelList();
    this.onFocus();
  }

  tagChannel(id: string): void {
    this.inputText = "";
    this.showList = false;
    localStorage.setItem("currentChannel", id);
    this.channelService.subscribeToChannelMessages(id);
    this.signalService.scrollChannelToBottom.set(true);
    this.signalService.focusChat.set(true);
  }

  onFocus(): void {
    this.messageInputRef?.nativeElement.focus();
    this.signalService.focusChat.set(false);
    this.signalService.focusThread.set(false);
  }

  get searchResultsChannel(): ChannelInterface[] {
    const match = this.inputText.match(/#(\w*)$/);
    const searchTerm = match?.[1]?.toLowerCase() ?? 'no results';
    return this.channelService.channels
      .filter(channel =>
        channel.channelName.toLowerCase().includes(searchTerm) &&
        this.isChannelMember(channel)
      );
  }

  isChannelMember(channel: ChannelInterface):boolean {
    return channel.members!.includes(this.authService.userId);
  }

  get searchResultsUser(): UserInterface[] {
    if (!this.messageInputRef) return [];
    const match = this.inputText.match(/@([^@]*)$/);
    const searchTerm = match?.[1]?.toLowerCase().trim() ?? 'no results';
    return this.usersService.users
      .filter(user =>
        user.name.toLowerCase().includes(searchTerm)
      );
  }

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

  get directMessageContact(): string {
    const currentConId = this.signalService.activeConId();
    const currentConversation = this.conService.getConversationById(currentConId);
    const participant = this.conService.participant(currentConversation!);
    return participant;
  }

  darkModeTest(): void {
    const currentMode = localStorage.getItem('theme');
    if (currentMode === 'dark-theme') {
      localStorage.setItem('theme', 'light');
    } else {
      localStorage.setItem('theme', 'dark-theme');
    }
    this.refreshPage();
  }

  refreshPage(): void {
    window.location.reload();
  }

  startConversation(id: string): void {
    this.conService.startNewConversation(id);
    this.inputText = "";
    this.showList = false;
  }

  showUserInfo(id: string): void {
    this.signalService.userInfoId.set(id);
    this.signalService.showUserInfo.set(true)
  }

}
