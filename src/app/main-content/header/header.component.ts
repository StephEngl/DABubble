import { Component, inject, HostListener, ViewChild, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { UsersService } from '../../services/users.service';
import { FormsModule } from '@angular/forms';
import { ChannelsService } from '../../services/channels.service';
import { SignalsService } from '../../services/signals.service';
import { ChannelInterface } from '../../interfaces/channel.interface';
import { SearchAppComponent } from '../../shared/search-app/search-app.component';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FormsModule, SearchAppComponent, NgClass],
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
  editName: string = "";
  //@ViewChild('dropdownContainer') dropdownRef!: ElementRef;

  /** Logs out the current user and closes the logout popup. */
  logout() {
    this.authService.signOutUser();
  }

  toggleDropdown(){
    this.dropdownOpen = !this.dropdownOpen;
    this.showProfileInfo = false;
    this.editProfile = false;
  }

  showProfile() {
    this.showProfileInfo = true;
    this.dropdownOpen = true;
    this.editName = this.authService.currentUser()!.name;
  }

  changeUserName() {
    if(this.editName != this.authService.currentUser()!.name) {
      this.usersService.updateUserName(
        this.authService.userId,
        this.editName
      );
      this.editProfile = false;
      //trigger Toast
    } else {
      this.editProfile = false;
    }
  }

  noChangesToName() {
    return this.editName == this.authService.currentUser()!.name;
  }

  showUserInfo(id: string) {
    this.signalService.userInfoId.set(id);
    this.signalService.showUserInfo.set(true)
    this.searchInput = '';
  }

}
