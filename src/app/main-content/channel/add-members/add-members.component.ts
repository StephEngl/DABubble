import { Component, inject } from '@angular/core';
import { SignalsService } from '../../../services/signals.service';
import { ChannelsService } from '../../../services/channels.service';

@Component({
  selector: 'app-add-members',
  standalone: true,
  imports: [],
  templateUrl: './add-members.component.html',
  styleUrl: './add-members.component.scss'
})
export class AddMembersComponent {

  signalService = inject(SignalsService);
  channelService = inject(ChannelsService);

  addAllMembers: boolean = false;
  addSpecificMembers: boolean = false;
  userSelectionActive: boolean = false;
  allMembersCheckStatus: string = './../../../../assets/icons/menu/circle_blue.svg';
  specificMembersCheckStatus: string = './../../../../assets/icons/menu/circle_blue.svg';
  selectedMembers: string[] = ['2'];


  toggleAddAllMembers():void {
    this.addSpecificMembers = false;
    this.addAllMembers = !this.addAllMembers;
    this.toggleImages();
  }

  toggleAddSpecificMembers():void {
    this.addAllMembers = false;
    this.addSpecificMembers = !this.addSpecificMembers;
    this.toggleImages();
  }

  toggleImages():void {
    this.allMembersCheckStatus = this.addAllMembers ? './../../../../assets/icons/menu/check_circle_blue.svg' : './../../../../assets/icons/menu/circle_blue.svg';
    this.specificMembersCheckStatus = this.addSpecificMembers ? './../../../../assets/icons/menu/check_circle_blue.svg' : './../../../../assets/icons/menu/circle_blue.svg';
  }

  selectUsers():void {
    if (this.addSpecificMembers) {
      this.userSelectionActive = true;
    } else {
      console.log("all members selected");
    }
  }

  get currentChannelId() {
    return localStorage.getItem('currentChannel')
  }

  removeMember(id:string) {

  }

}
