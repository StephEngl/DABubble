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

  ngOnInit() {
    this.checkSize();
  }
  
  newConversation() {
    this.signalService.startConversation.set(true);
  }

  @HostListener('window:resize')
  checkSize() {
    if (window.innerWidth < 950) {
      this.showSearchBar = true;
    } else {
      this.showSearchBar = false;
    }
  }
}
