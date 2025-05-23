import { Component, inject } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { ThreadComponent } from './thread/thread.component';
import { ChannelComponent } from './channel/channel.component';
import { WorkspaceComponent } from './workspace/workspace.component';
import { CreateChannelComponent } from './channel/create-channel/create-channel.component';
import { ChannelsService } from '../services/channels.service';
import { SignalsService } from '../services/signals.service';

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [
    HeaderComponent,
    ThreadComponent,
    ChannelComponent,
    WorkspaceComponent,
    CreateChannelComponent
  ],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss'
})
export class MainContentComponent {

  signalService = inject(SignalsService);
  channelService = inject(ChannelsService);
  workspaceOpened: boolean = true;
  workspaceHovered: boolean = false;
  workspaceStatus:  "Open" | "Close" = "Open";

  constructor() {
    this.setInitialChannel();
  }

  setInitialChannel() {
    if (!localStorage.getItem('currentChannel') && this.channelService.channels.length > 0) {
      localStorage.setItem('currentChannel', this.channelService.channels[0].id!);
    }
  };
  
  toggleWorkspaceMenu():void {
    this.workspaceOpened = !this.workspaceOpened;
    this.workspaceStatus = this.workspaceOpened ? 'Close' : 'Open';
    this.workspaceOpened ? this.signalService.showWorkspace.set(true) : this.signalService.showWorkspace.set(false);
  }

  getWorkspaceIcon(): string {
    const color = this.workspaceHovered ? 'blue' : 'black';
    const status = this.workspaceStatus === 'Open' ? 'workspace_open' : 'workspace_close';
    return `./../../assets/icons/menu/${status}_${color}.svg`;
  }

}
