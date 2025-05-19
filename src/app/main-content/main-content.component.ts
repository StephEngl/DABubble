import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { ThreadComponent } from './thread/thread.component';
import { ChannelComponent } from './channel/channel.component';
import { WorkspaceComponent } from './workspace/workspace.component';

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [HeaderComponent, ThreadComponent, ChannelComponent, WorkspaceComponent],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss'
})
export class MainContentComponent {

}
