import { Component, inject } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { ThreadComponent } from './thread/thread.component';
import { ChannelComponent } from './channel/channel.component';
import { WorkspaceComponent } from './workspace/workspace.component';
import { MenuToggleService } from '../services/menu-toggle.service';

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [HeaderComponent, ThreadComponent, ChannelComponent, WorkspaceComponent],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss'
})
export class MainContentComponent {

  toggleMenu = inject(MenuToggleService);
  workspaceOpened: boolean = false;
  workspaceHovered: boolean = false;
  workspaceStatus:  "Open" | "Close" = "Open";


  toggleWorkspaceMenu():void {
    this.workspaceOpened = !this.workspaceOpened;
    this.workspaceStatus = this.workspaceOpened ? 'Close' : 'Open';
    this.workspaceOpened ? this.toggleMenu.showWorkspace.set(true) : this.toggleMenu.showWorkspace.set(false);
  }

  getWorkspaceIcon(): string {
  const color = this.workspaceHovered ? 'blue' : 'black';
  const status = this.workspaceStatus === 'Open' ? 'workspace_open' : 'workspace_close';
  return `./../../assets/icons/menu/${status}_${color}.svg`;
}

}
