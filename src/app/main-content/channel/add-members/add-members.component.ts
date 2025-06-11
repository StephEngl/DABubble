/**
 * Component for adding users to a channel, either all at once or selectively.
 */
import { Component, inject } from '@angular/core';
import { SignalsService } from '../../../services/signals.service';
import { ChannelsService } from '../../../services/channels.service';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../../services/users.service';
import { UserInterface } from '../../../interfaces/user.interface';

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
  allMembersCheckStatus: string = './assets/icons/menu/circle_blue.svg';
  specificMembersCheckStatus: string = './assets/icons/menu/circle_blue.svg';
  selectedMembers: UserInterface[] = [];
  textInput: string = '';

  /** Toggles the "add all members" option. */
  toggleAddAllMembers():void {
    this.addSpecificMembers = false;
    this.addAllMembers = !this.addAllMembers;
    this.toggleImages();
  }

  /** Toggles the "add specific members" option. */
  toggleAddSpecificMembers():void {
    this.addAllMembers = false;
    this.addSpecificMembers = !this.addSpecificMembers;
    this.toggleImages();
  }

  /** Updates checkmark icons based on selected options. */
  toggleImages():void {
    this.allMembersCheckStatus = this.addAllMembers
    ? './/menu/check_circle_blue.svg'
    : './assets/icons/menu/circle_blue.svg';
    this.specificMembersCheckStatus = this.addSpecificMembers
    ? './assets/icons/menu/check_circle_blue.svg'
    : './assets/icons/menu/circle_blue.svg';
  }

  /** Triggers user selection or adds all users. */
  selectUsers():void {
    if (this.addSpecificMembers) {
      this.userSelectionActive = true;
    } else {
      this.channelService.addMembersToChannel(this.otherUsers);
    }
  }

  /** Returns IDs of selected members. */
  get selectedMemberIds() {
    return this.selectedMembers.map(m => m.id!);
  }

  /** Returns the current channel ID from local storage. */
  get currentChannelId() {
    return localStorage.getItem('currentChannel')
  }

  /**
   * Removes a member from the selected list.
   * @param id ID of the user to remove
   */
  removeMember(id:string) {
    this.selectedMembers = this.selectedMembers.filter(m => m.id !== id);
  }

  /** Filters users by input, excluding selected and current members. */
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

  /** Returns users not yet in the current channel. */
  get otherUsers(): string[] {
    const currentChannelId = localStorage.getItem('currentChannel');
    const currentChannel = this.channelService.getChannelById(currentChannelId!);
    const currentMembers = currentChannel?.members ?? [];

    return this.userService.users
      .filter(user => user.id && !currentMembers.includes(user.id))
      .map(user => user.id!);
  }

  /**
   * Adds a user to selectedMembers if not already present.
   * @param member The user to add
   */
  addMember(member: UserInterface):void {
    const alreadyExists = this.selectedMembers.find((m) => m === member);
    if (!alreadyExists) {
      this.selectedMembers.push(member);
      this.textInput= '';
    }
  }

}
