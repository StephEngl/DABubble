/**
 * SearchAppComponent provides a unified search interface for users,
 * channels, and direct messages.
 */
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

  /** Returns channel search results that the current user is a member of. */
  get searchResultsChannel():ChannelInterface[] {
    const searchTerm = this.searchInput.trim().toLowerCase();
    if (!searchTerm) return [];

    return this.channelService.channels
      .filter(channel =>
        channel.channelName.toLowerCase().includes(searchTerm) &&
        this.isChannelMember(channel)
      );
  }

  /** Returns matching users based on the search input. */
  get searchResultsUser() {
    const searchTerm = this.searchInput.trim().toLowerCase();
    if (!searchTerm) return [];
    const matches = this.userService.users.filter(user =>
      user.name.toLowerCase().includes(searchTerm)
    );
    return matches.length > 0 ? matches : [];
  }

  /** Placeholder for direct message search results. */
  get searchResultsDirectMessages() {
    return '';
  }

  /**
   * Checks whether the current user is a member of the specified channel.
   * @param channel - The channel to check membership for.
   * @returns True if the user is a member of the channel.
   */
  isChannelMember(channel: ChannelInterface):boolean {
    return channel.members!.includes(this.authService.userId);
  }
  
  /** Returns true if the edited name equals the current user's name. */
  noChangesToName() {
    return this.editName == this.authService.currentUser()!.name;
  }

  /**
   * Opens the user info panel for the given user ID.
   * @param id - The ID of the user whose info should be displayed.
   */
  showUserInfo(id: string) {
    this.signalService.userInfoId.set(id);
    this.signalService.showUserInfo.set(true)
    this.searchInput = '';
  }

  /**
   * Displays the selected channel and prepares the UI accordingly.
   * @param id - The ID of the channel to be shown.
   */
  showChannel(id: string) {
    this.signalService.conversationActive.set(false);
    localStorage.setItem("currentChannel", id);
    this.channelService.subscribeToChannelMessages(id);
    this.signalService.hideWorkspaceOnMobile();
    this.signalService.scrollChannelToBottom.set(true);
    this.searchInput = '';
  }



}
