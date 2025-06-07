import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChannelsService } from '../../services/channels.service';
import { AuthenticationService } from '../../services/authentication.service';
import { UsersService } from '../../services/users.service';
import { ChannelInterface } from '../../interfaces/channel.interface';
import { SignalsService } from '../../services/signals.service';

@Component({
  selector: 'app-search-app',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search-app.component.html',
  styleUrl: './search-app.component.scss'
})
export class SearchAppComponent {
  authService = inject(AuthenticationService);
  userService = inject(UsersService);
  channelService = inject(ChannelsService);
  signalService = inject(SignalsService);
  searchInput: string = '';
  editName: string = "";

  get searchResultsChannel():ChannelInterface[] {
    const searchTerm = this.searchInput.trim().toLowerCase();
    if (!searchTerm) return [];

    return this.channelService.channels
      .filter(channel =>
        channel.channelName.toLowerCase().includes(searchTerm) &&
        this.isChannelMember(channel)
      );
  }

  get searchResultsUser() {
    const searchTerm = this.searchInput.trim().toLowerCase();
    if (!searchTerm) return [];
    const matches = this.userService.users.filter(user =>
      user.name.toLowerCase().includes(searchTerm)
    );
    return matches.length > 0 ? matches : [];
  }

  get searchResultsDirectMessages() {
    return '';
  }

  isChannelMember(channel: ChannelInterface):boolean {
    return channel.members!.includes(this.authService.userId);
  }
  
  noChangesToName() {
    return this.editName == this.authService.currentUser()!.name;
  }

  showUserInfo(id: string) {
    this.signalService.userInfoId.set(id);
    this.signalService.showUserInfo.set(true)
    this.searchInput = '';
  }

  showChannel(id: string) {
    this.signalService.conversationActive.set(false);
    localStorage.setItem("currentChannel", id);
    this.channelService.subscribeToChannelMessages(id);
    this.signalService.hideWorkspaceOnMobile();
    this.signalService.scrollChannelToBottom.set(true);
    this.searchInput = '';
  }


  darkModeTest(): void {
    const currentMode = localStorage.getItem('theme');
    if (currentMode === 'dark-theme') {
      localStorage.setItem('theme', 'light');
      this.signalService.themeColorMain.set('black');
    } else {
      localStorage.setItem('theme', 'dark-theme');
      this.signalService.themeColorMain.set('white');
    }
    window.location.reload()
  }

}
