import { Component, inject } from '@angular/core';
import { SignalsService } from '../../../services/signals.service';
import { ChannelsService } from '../../../services/channels.service';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../../services/users.service';
import { UserInterface } from '../../../interfaces/user.interface';
import { ChannelInterface } from '../../../interfaces/channel.interface';


@Component({
  selector: 'app-add-members',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-members.component.html',
  styleUrl: './add-members.component.scss'
})
export class AddMembersComponent {

  signalService = inject(SignalsService);
  channelService = inject(ChannelsService);
  userService = inject(UsersService);

  addAllMembers: boolean = false;
  addSpecificMembers: boolean = false;
  userSelectionActive: boolean = false;
  allMembersCheckStatus: string = './../../../../assets/icons/menu/circle_blue.svg';
  specificMembersCheckStatus: string = './../../../../assets/icons/menu/circle_blue.svg';
  selectedMembers: UserInterface[] = [];
  textInput: string = '';

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
      this.addMembersToChannel(this.otherUsers);
    }
  }

  async addMembersToChannel(users: Array<string>) {
    const collectedMembers = users;
    const currentChannelId = localStorage.getItem('currentChannel');
    if (!currentChannelId) return;
    const currentChannel = this.channelService.getChannelById(currentChannelId);
    if (!currentChannel) return;
    const currentMembers = currentChannel.members;
    if(!currentMembers) return;

    currentMembers.push(...collectedMembers);
    
    if (!currentChannel) return;
    await this.channelService.updateChannel(currentChannel);
    this.signalService.showAddMembers.set(false);
    this.triggerToast(collectedMembers);
  }

  triggerToast(array: Array<string>):void {
    if(array.length === 1) {
      this.signalService.triggerToast('Member added to channel','confirm');
    } else {
      this.signalService.triggerToast('Members added to channel','confirm');
    }
  }

  get selectedMemberIds() {
    return this.selectedMembers.map(m => m.id!);
  }

  get currentChannelId() {
    return localStorage.getItem('currentChannel')
  }

  removeMember(id:string) {
    this.selectedMembers = this.selectedMembers.filter(m => m.id !== id);
  }

  get searchResultsUser() {
    const searchTerm = this.textInput.trim().toLowerCase();
    if (!searchTerm) return [];

    const currentChannelId = localStorage.getItem('currentChannel');
    const currentChannel = this.channelService.getChannelById(currentChannelId!);
    const currentMembers = currentChannel!.members!;

    const selectedIds = this.selectedMembers.map((m) => m.id);

    return this.userService.users
      .filter(user =>
        user.name.toLowerCase().includes(searchTerm) &&
        !currentMembers.includes(user.id!) &&
        !selectedIds.includes(user.id!)
      );
  }

  get otherUsers(): string[] {
    const currentChannelId = localStorage.getItem('currentChannel');
    const currentChannel = this.channelService.getChannelById(currentChannelId!);
    const currentMembers = currentChannel?.members ?? [];

    return this.userService.users
      .filter(user => user.id && !currentMembers.includes(user.id))
      .map(user => user.id!);
  }

  addMember(member: UserInterface):void {
    const alreadyExists = this.selectedMembers.find((m) => m === member);
    if (!alreadyExists) {
      this.selectedMembers.push(member);
      this.textInput= '';
    }
  }

}
