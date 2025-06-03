import { Component, inject, ViewChild, ElementRef } from '@angular/core';
import { ChannelsService } from '../../../services/channels.service';
import { ChannelInterface } from '../../../interfaces/channel.interface';
import { UsersService } from '../../../services/users.service';
import { SignalsService } from '../../../services/signals.service';
import { FormsModule } from '@angular/forms';
import { ConversationService } from '../../../services/conversations.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { ConversationInterface } from '../../../interfaces/conversation.interface';

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
  inputText: string = '';
  mentionTrigger: '@' | '#' | null = null;
  showList: boolean = false;

  get currentChannel(): ChannelInterface | undefined {
    const currentId = localStorage.getItem('currentChannel');
    if (!currentId) return undefined;
    return this.channelService.getChannelById(currentId);
  }

  onMentionSelect() {
    if (this.inputText?.slice(-1) === "@") return;
    this.inputText += "@";
    this.triggerUserOrChannelList();
    this.onFocus();
  }

  tagChannel(id: string) {
    this.inputText = "";
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
    const match = this.inputText.match(/#(\w*)$/);
    const searchTerm = match?.[1]?.toLowerCase() ?? 'no results';
    return this.channelService.channels.filter(channel =>
      channel.channelName.toLowerCase().includes(searchTerm)
    );
  }

  get searchResultsUser() {
    if (!this.messageInputRef) return [];
    const match = this.inputText.match(/@([^@]*)$/);
    const searchTerm = match?.[1]?.toLowerCase().trim() ?? 'no results';
    return this.usersService.users
      .filter(user =>
        user.name.toLowerCase().includes(searchTerm)
      );
  }

  triggerUserOrChannelList() {
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

  get directMessageContact() {
    const currentConId = this.signalService.activeConId();
    const currentConversation = this.conService.getConversationById(currentConId);
    const participant = this.conService.participant(currentConversation!);
    return participant;
  }

  darkModeTest() {
    const currentMode = localStorage.getItem('theme');
    if (currentMode === 'dark-theme') {
      localStorage.setItem('theme', 'light');
    } else {
      localStorage.setItem('theme', 'dark-theme');
    }
    this.refreshPage();
  }

  refreshPage() {
    window.location.reload();
  }

  startConversation(id: string):void {
    this.conService.startNewConversation(id);
    this.inputText = "";
    this.showList = false;
  }

}
