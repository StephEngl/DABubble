/**
 * Header component that provides user interaction controls like
 * profile viewing/editing, avatar selection, logout, and user search.
 */
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { UsersService } from '../../services/users.service';
import { FormsModule } from '@angular/forms';
import { ChannelsService } from '../../services/channels.service';
import { SignalsService } from '../../services/signals.service';
import { SearchAppComponent } from '../../shared/search-app/search-app.component';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FormsModule, SearchAppComponent, NgClass, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})

export class HeaderComponent {
  authService = inject(AuthenticationService);
  usersService = inject(UsersService);
  channelsService = inject(ChannelsService);
  signalService = inject(SignalsService);
  searchInput: string = '';
  hoverMenu: boolean = false;
  dropdownOpen: boolean = false;
  showProfileInfo: boolean = false;
  editProfile: boolean = false;
  editAvatar: boolean = false;
  darkMode: boolean = false;
  editName: string = "";
  chosenAvatar: string | undefined = undefined;

  avatarList: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  /** Logs out the current user and closes the logout popup. */
  logout() {
    this.authService.signOutUser();
  }

  /** Toggles the profile dropdown visibility. */
  toggleDropdown(){
    this.dropdownOpen = !this.dropdownOpen;
    this.showProfileInfo = false;
    this.editProfile = false;
  }

  /** Displays the user's profile info and opens dropdown. */
  showProfile() {
    this.showProfileInfo = true;
    this.dropdownOpen = true;
    this.editName = this.authService.currentUser()!.name;
  }

  /** Changes the user's name if it's different from the current one. */
  changeUserName() {
    if (this.userAlreadyExists()) {
      this.signalService.triggerToast('User Name already exists', 'error');
      return;
    }
    if(!this.noChangesToName()) {
      this.usersService.updateUserName(
        this.authService.userId,
        this.editName
      );
      this.editProfile = false;
      this.signalService.triggerToast('User Name changed successfully','confirm');
    }
    this.editProfile = false;
  }

  userAlreadyExists(): boolean {
    const searchName = this.editName.toLowerCase();
    return this.usersService.users.some(u => u.name.toLowerCase() === searchName);
  }

  /** Returns true if the edited name equals the current name. */
  noChangesToName() {
    return this.editName == this.authService.currentUser()!.name || this.editName.trim().length < 2;
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

  /** Cancels any ongoing profile or avatar edit. */
  cancelEdit() {
    this.editProfile = false;
    this.editAvatar = false;
    this.chosenAvatar = undefined;
  }
  
  /**
   * Sets the currently selected avatar ID.
   * @param avatar - The ID of the avatar to set.
   */
  setChosenAvatarId(avatar: string) {
    this.chosenAvatar = avatar;
  }

  /**
   * Updates the user avatar if one was selected.
   * @returns A promise that resolves after the avatar is updated.
   */
  async changeAvatar() {
    if (this.chosenAvatar) {
      await this.usersService.updateUserAvatar(this.authService.userId, this.chosenAvatar);
      this.editAvatar = false;
      this.chosenAvatar = undefined;
      this.signalService.triggerToast('User Avatar changed successfully','confirm');
    }
  }

  /** Toggles between light and dark themes and reloads the page. */
  toggleDarkMode(): void {
    this.darkMode = !this.darkMode;
    const currentMode = localStorage.getItem('theme');
    if (currentMode === 'dark-theme') {
      localStorage.setItem('theme', 'light');
      this.signalService.themeColorMain.set('black');
    } else {
      localStorage.setItem('theme', 'dark-theme');
      this.signalService.themeColorMain.set('white');
    }
    // window.location.reload()
  }

  isDarkMode(): boolean {
    return localStorage.getItem('theme') === 'dark-theme';
  }

}
