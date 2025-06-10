/**
 * MainContentComponent manages the primary layout areas of the app, including channels, threads, workspace,
 * and user status tracking (e.g. AFK detection, responsive behavior).
 */
import { Component, Host, HostListener, inject, OnInit } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { ThreadComponent } from './thread/thread.component';
import { ChannelComponent } from './channel/channel.component';
import { WorkspaceComponent } from './workspace/workspace.component';
import { CreateChannelComponent } from './channel/create-channel/create-channel.component';
import { ChannelsService } from '../services/channels.service';
import { SignalsService } from '../services/signals.service';
import { AuthenticationService } from '../services/authentication.service';
import { UsersService } from '../services/users.service';
import { ConversationService } from '../services/conversations.service';
import { UserInfoComponent } from './user-info/user-info.component';
import { AddMembersComponent } from './channel/add-members/add-members.component';
import { ChannelInfoComponent } from './channel/channel-info/channel-info.component';

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [
    HeaderComponent,
    ThreadComponent,
    ChannelComponent,
    WorkspaceComponent,
    CreateChannelComponent,
    UserInfoComponent,
    AddMembersComponent,
    ChannelInfoComponent
  ],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss'
})
export class MainContentComponent implements OnInit {

  signalService = inject(SignalsService);
  channelService = inject(ChannelsService);
  authService = inject(AuthenticationService);
  usersService = inject(UsersService);
  conService = inject(ConversationService);
  workspaceOpened: boolean = false;
  workspaceHovered: boolean = false;
  workspaceStatus:  "Open" | "Close" = "Open";
  userInactive: boolean = true;
  afkTimeoutId: any;

  constructor() {
    this.setInitialChannel();
    this.handleResize();
  }

  /** Initializes services and sets initial channel on component load. */
  async ngOnInit() {
    const currentChannelId = localStorage.getItem('currentChannel');
    await this.conService.loadCons();
    if (currentChannelId) {
      this.signalService.conversationActive.set(false);
      await this.channelService.loadChannel(currentChannelId!);
    }
    await this.authService.getActiveUserId();
    this.listenToActivity();
  }

  /** Handles window resize and adjusts layout display. */
  @HostListener('window:resize', [])
  handleResize(): void {
    if (window.innerWidth < 1500) {
      this.toggleWorkspaceAndThread();
    }
    if (window.innerWidth < 850) {
      this.signalService.showThread.set(false);
      this.signalService.showChannel.set(false);
      this.signalService.showWorkspace.set(true);
    }
    else {
      this.signalService.showChannel.set(true);
    }
  }

  /** Toggles visibility between workspace and thread on smaller screens. */
  toggleWorkspaceAndThread() {
    if (this.signalService.showThread()) {
      this.signalService.showWorkspace.set(false);
    } else if (this.signalService.showWorkspace()) {
      this.signalService.showThread.set(false);
    }
  }

  /** Adds event listeners to track user activity for AFK status. */
  listenToActivity(): void {
    const events = ['click', 'mousemove', 'keydown', 'scroll'];
    for (let i = 0; i < events.length; i++) {
      document.addEventListener(events[i], this.setStatus.bind(this));
    }
    this.setStatus();
  }

  /** 
   * Sets or resets the AFK status of the current user.
   * Sends 'online' if activity is detected and 'afk' after 5 min of inactivity.
   */
  setStatus(): void {
    clearTimeout(this.afkTimeoutId);
    if (this.userInactive) {
      this.userInactive = false;
      this.usersService.updateUserStatus(this.authService.userId, 'online');
    }
    this.afkTimeoutId = setTimeout(() => {
      this.userInactive = true;
      this.usersService.updateUserStatus(this.authService.userId, 'afk');
    }, 300000); // => 5min 300000
  }

  /** Sets the initial channel from the channel list if none is stored. */
  setInitialChannel() {
    if (!localStorage.getItem('currentChannel') && this.channelService.channels.length > 0) {
      localStorage.setItem('currentChannel', this.channelService.channels[0].id!);
    }
  };
  
  /** Toggles the workspace menu and adjusts thread/channel visibility. */
  toggleWorkspaceMenu():void {
    if (this.signalService.showWorkspace()) {
      if(window.innerWidth < 850) {
        this.signalService.showChannel.set(true);
      }
      this.signalService.showWorkspace.set(false);
      this.workspaceStatus = 'Close'
    } else {
      if(window.innerWidth < 1500) {
        this.signalService.showThread.set(false);
      }
      this.signalService.showWorkspace.set(true);
      this.workspaceStatus = 'Open'
    }
  }

  /** Returns the correct workspace icon path based on current state. */
  getWorkspaceIcon(): string {
    const color = this.workspaceHovered ? 'blue' : ''+ this.signalService.themeColorMain() +'';
    const status = this.workspaceStatus === 'Open' ? 'workspace_open' : 'workspace_close';
    return `./../../assets/icons/menu/${status}_${color}.svg`;
  }

}
