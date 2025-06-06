import { Injectable, signal } from '@angular/core';
import { ToastInterface } from '../interfaces/toast.interface';

@Injectable({
  providedIn: 'root',
})
export class SignalsService {
  constructor() {}

  // signals for controlling various channel & message statuses
  focusChat = signal<boolean>(false);
  focusThread = signal<boolean>(false);
  focusConversation = signal<boolean>(false);
  startConversation = signal<boolean>(false);
  sendingMessage = signal<boolean>(false);
  channelActive = signal<boolean>(true);
  conversationActive = signal<boolean>(false);
  activeConId = signal<string>('');
  activeReplyToId = signal<string>('');
  userInfoId = signal<string>('');

  showWorkspace = signal<boolean>(true);
  showThread = signal<boolean>(false);
  showChannel = signal<boolean>(true);
  showCreateChannel = signal<boolean>(false);
  showChannelInfo = signal<boolean>(true);
  showChannelMembers = signal<boolean>(false);
  showUserInfo = signal<boolean>(false);
  showAddMembers = signal<boolean>(false);

  scrollChannelToBottom = signal<boolean>(false);

  // signal to toggle icon colors
  themeColorMain = signal<string>('black');

  // Signals for intro animation
  showIntro = signal<boolean>(false);
  slideOut = signal<boolean>(false);
  moveUp = signal<boolean>(false);
  fadeOut = signal<boolean>(false);

  startIntroAnimation() {
      // Slide out title logo after 1,3s
      setTimeout(() => this.slideOut.set(true), 1300);
      // Animate complete logo to the upper left after 2,5s
      setTimeout(() => this.moveUp.set(true), 2500);
      // // Fade out intro after 3,5s
      setTimeout(() => this.fadeOut.set(true), 3500);
      // // End intro and delete from DOM after 4,2s
      setTimeout(() => this.showIntro.set(false), 4200);
    }

  // Signal for current User-ID
  currentUid = signal<string>('');

  // Signals for password match of confirming password
  passwordsMatch = signal<boolean>(false)
  confirmPasswordInput = signal<string>('');

  // Signalmethods for showing the different dialogs at login-section
  isLoginDialog = signal<boolean>(true);
  isRegisterDialog = signal<boolean>(false);
  isChoosingAvatarDialog = signal<boolean>(false);
  isPasswordForgottenDialog = signal<boolean>(false);
  isPasswordResetDialog = signal<boolean>(false);

  backToLogin() {
    this.isLoginDialog.set(true);
    this.isRegisterDialog.set(false);
    this.isChoosingAvatarDialog.set(false);
    this.isPasswordForgottenDialog.set(false);
    this.isPasswordResetDialog.set(false);
  }

  showRegisterDialog() {
    this.isLoginDialog.set(false);
    this.isRegisterDialog.set(true);
    this.isChoosingAvatarDialog.set(false);
    this.isPasswordForgottenDialog.set(false);
    this.isPasswordResetDialog.set(false);
  }

  goToAvatarChoice() {
    this.isLoginDialog.set(false);
    this.isRegisterDialog.set(false);
    this.isChoosingAvatarDialog.set(true);
    this.isPasswordForgottenDialog.set(false);
    this.isPasswordResetDialog.set(false);
  }

  showPasswordForgottenDialog() {
    this.isPasswordForgottenDialog.set(true);
    this.isLoginDialog.set(false);
    this.isRegisterDialog.set(false);
    this.isChoosingAvatarDialog.set(false);
    this.isPasswordResetDialog.set(false);
  }

  showPasswordResetDialog() {
    this.isLoginDialog.set(false);
    this.isRegisterDialog.set(false);
    this.isChoosingAvatarDialog.set(false);
    this.isPasswordForgottenDialog.set(false);
    this.isPasswordResetDialog.set(true);
  }

  // Signals for toasts
  toast = signal<ToastInterface>({
    message: '',
    type: 'confirm',
    isOpen: false,
    isAnimated: false,
    icon: '',
  });

  triggerToast(message: string,type: ToastInterface['type'],icon: string = '') {
    this.toast.set({
      message,
      type,
      icon,
      isOpen: true,
      isAnimated: false,
    });
    setTimeout(() => this.toast.update((t) => ({ ...t, isAnimated: true })),10);
    setTimeout(() => this.toast.update((t) => ({ ...t, isAnimated: false })),3000);
    setTimeout(() => this.toast.update((t) => ({ ...t, isOpen: false })), 3500);
  }

  // signal methods for triggering the different chat channels
  setChannelSignals(id:string):void {
    this.activeReplyToId.set('');
    this.conversationActive.set(false);
    this.scrollChannelToBottom.set(true);
    this.focusChat.set(true);
    this.startConversation.set(false);
  }

  setConversationSignals(id:string):void {
    this.activeReplyToId.set('');
    this.channelActive.set(false);
    this.conversationActive.set(true);
    this.activeConId.set(id);
    this.showThread.set(false);
    this.startConversation.set(false);
  }

  hideWorkspaceOnMobile():void {
    if (window.innerWidth < 850) {
      this.showChannel.set(true);
      this.showWorkspace.set(false);
    }
  }

  showOnlyThreadOnMobile():void {
    if (window.innerWidth < 850) {
      this.showChannel.set(false);
    } else if (window.innerWidth < 1500) {
      this.showWorkspace.set(false);
    }
  }

  backToChannelOnMobile():void {
    if (window.innerWidth < 850) {
      this.showChannel.set(true);
      this.showThread.set(false);
    } else {
      this.showThread.set(false);
    }
  }

}
