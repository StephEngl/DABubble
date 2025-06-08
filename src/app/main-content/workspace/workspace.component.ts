/**
 * WorkspaceComponent manages the sidebar area of the app,
 * including the channel list, direct messages, and search bar.
 * It also handles responsive layout behavior.
 */
import { Component, HostListener, inject } from '@angular/core';
import { ChannelListComponent } from './channel-list/channel-list.component';
import { DirectMessagesListComponent } from './direct-messages-list/direct-messages-list.component';
import { SignalsService } from '../../services/signals.service';
import { SearchAppComponent } from '../../shared/search-app/search-app.component';

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [ChannelListComponent, DirectMessagesListComponent, SearchAppComponent],
  templateUrl: './workspace.component.html',
  styleUrl: './workspace.component.scss'
})

export class WorkspaceComponent {

  signalService = inject(SignalsService);
  startConversationHovered: boolean = false;
  showSearchBar:boolean = false;

  /** Checks screen size on init and toggles search bar visibility. */
  ngOnInit() {
    this.checkSize();
  }

  /** Starts a new conversation and hides workspace on mobile. */
  newConversation() {
    this.signalService.hideWorkspaceOnMobile();
    this.signalService.startConversation.set(true);
  }

   /** Adjusts search bar visibility based on window size. */
  @HostListener('window:resize')
  checkSize() {
    window.innerWidth < 950 ? this.showSearchBar = true : this.showSearchBar = false;
  }

}
