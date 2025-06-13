/**
 * Service for managing UI state using Angular signals across channels, conversations, and authentication flows.
 */

import { Injectable, signal } from '@angular/core';
import { ToastInterface } from '../interfaces/toast.interface';

@Injectable({
  providedIn: 'root',
})
export class SignalsService {
  constructor() {}

  // Signal for info popup
  popupOpen = signal<boolean>(false);

  // signals for controlling various channel & message statuses
  focusChat = signal<boolean>(false);
  focusThread = signal<boolean>(false);
  focusConversation = signal<boolean>(false);
  startConversation = signal<boolean>(false);
  sendingMessage = signal<boolean>(false);
  sendingReaction = signal<boolean>(false);
  channelActive = signal<boolean>(true);
  conversationActive = signal<boolean>(false);
  activeConId = signal<string>('');
  activeReplyToId = signal<string>('');
  userInfoId = signal<string>('');

  showWorkspace = signal<boolean>(true);
  showThread = signal<boolean>(false);
  showChannel = signal<boolean>(true);
  showCreateChannel = signal<boolean>(false);
  showChannelInfo = signal<boolean>(false);
  showChannelMembers = signal<boolean>(false);
  showUserInfo = signal<boolean>(false);
  showAddMembers = signal<boolean>(false);

  scrollChannelToBottom = signal<boolean>(false);
  posScrollY = signal<number>(0);

  // Signals for toasts
  toast = signal<ToastInterface>({
    message: '',
    type: 'confirm',
    isOpen: false,
    isAnimated: false,
    icon: '',
  });

  // signals to toggle icon colors
  themeColorMain = signal<string>('black');

  get invertedThemeColorMain() {
    return this.themeColorMain() === 'black' ? 'white' : 'black';
  }

  // Signals for intro animation
  showIntro = signal<boolean>(true);
  slideOut = signal<boolean>(false);
  moveUp = signal<boolean>(false);
  fadeOut = signal<boolean>(false);

  /** Starts the intro animation sequence */
  startIntroAnimation() {
    setTimeout(() => this.slideOut.set(true), 1300);
    setTimeout(() => this.moveUp.set(true), 2500);
    setTimeout(() => this.fadeOut.set(true), 3500);
    setTimeout(() => this.showIntro.set(false), 4200);
  }

  // Signal for current User-ID
  currentUid = signal<string>('');

  // Signals for password match of confirming password
  passwordsMatch = signal<boolean>(false);
  confirmPasswordInput = signal<string>('');

  // Signalmethods for showing the different dialogs at login-section
  isLoginDialog = signal<boolean>(true);
  isRegisterDialog = signal<boolean>(false);
  isChoosingAvatarDialog = signal<boolean>(false);
  isPasswordForgottenDialog = signal<boolean>(false);
  isPasswordResetDialog = signal<boolean>(false);

  /** Switches to login dialog */
  backToLogin() {
    this.isLoginDialog.set(true);
    this.isRegisterDialog.set(false);
    this.isChoosingAvatarDialog.set(false);
    this.isPasswordForgottenDialog.set(false);
    this.isPasswordResetDialog.set(false);
  }

  /** Shows register dialog */
  showRegisterDialog() {
    this.isLoginDialog.set(false);
    this.isRegisterDialog.set(true);
    this.isChoosingAvatarDialog.set(false);
    this.isPasswordForgottenDialog.set(false);
    this.isPasswordResetDialog.set(false);
  }

  /** Navigates to avatar choice screen */
  goToAvatarChoice() {
    this.isLoginDialog.set(false);
    this.isRegisterDialog.set(false);
    this.isChoosingAvatarDialog.set(true);
    this.isPasswordForgottenDialog.set(false);
    this.isPasswordResetDialog.set(false);
  }

  /** Shows forgotten password dialog */
  showPasswordForgottenDialog() {
    this.isPasswordForgottenDialog.set(true);
    this.isLoginDialog.set(false);
    this.isRegisterDialog.set(false);
    this.isChoosingAvatarDialog.set(false);
    this.isPasswordResetDialog.set(false);
  }

  /** Shows password reset dialog */
  showPasswordResetDialog() {
    this.isLoginDialog.set(false);
    this.isRegisterDialog.set(false);
    this.isChoosingAvatarDialog.set(false);
    this.isPasswordForgottenDialog.set(false);
    this.isPasswordResetDialog.set(true);
  }

  /**
   * Triggers a toast message
   * @param message - Text to display in the toast
   * @param type - Type of toast ('confirm', 'error', etc.)
   * @param icon - Optional icon to display
   */
  triggerToast(
    message: string,
    type: ToastInterface['type'],
    icon: string = ''
  ) {
    this.toast.set({
      message,
      type,
      icon,
      isOpen: true,
      isAnimated: false,
    });
    setTimeout(
      () => this.toast.update((t) => ({ ...t, isAnimated: true })),
      10
    );
    setTimeout(
      () => this.toast.update((t) => ({ ...t, isAnimated: false })),
      4000
    );
    setTimeout(() => this.toast.update((t) => ({ ...t, isOpen: false })), 4500);
  }

  /**
   * Sets channel-related UI state
   * @param id - The channel ID to activate
   */
  setChannelSignals(id: string): void {
    this.activeReplyToId.set('');
    this.conversationActive.set(false);
    this.scrollChannelToBottom.set(true);
    this.focusChat.set(true);
    this.startConversation.set(false);
  }

  /**
   * Sets conversation-related UI state
   * @param id - The conversation ID to activate
   */
  setConversationSignals(id: string): void {
    this.activeReplyToId.set('');
    this.channelActive.set(false);
    this.conversationActive.set(true);
    this.activeConId.set(id);
    this.showThread.set(false);
    this.startConversation.set(false);
  }

  /** Hides workspace view on smaller mobile devices */
  hideWorkspaceOnMobile(): void {
    if (window.innerWidth < 850) {
      this.showChannel.set(true);
      this.showWorkspace.set(false);
    }
  }

  /** Displays thread-only view on mobile or smaller screens */
  showOnlyThreadOnMobile(): void {
    if (window.innerWidth < 850) {
      this.showChannel.set(false);
    } else if (window.innerWidth < 1500) {
      this.showWorkspace.set(false);
    }
  }

  /** Switches back to channel view on mobile */
  backToChannelOnMobile(): void {
    if (window.innerWidth < 850) {
      this.showChannel.set(true);
      this.showThread.set(false);
    } else {
      this.showThread.set(false);
    }
  }
}
