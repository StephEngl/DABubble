import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SignalsService {
  constructor() {}

  isLoginDialog = signal<boolean>(true);
  isRegisterDialog = signal<boolean>(false);
  isChoosingAvatarDialog = signal<boolean>(false);
  isPasswordForgottenDialog = signal<boolean>(false);
  isPasswordResetDialog = signal<boolean>(false);
  focusChat = signal<boolean>(false);
  focusThread = signal<boolean>(false);
  startConversation = signal<boolean>(false);
  sendingMessage = signal<boolean>(false);

  channelActive = signal<boolean>(true);
  conversationActive = signal<boolean>(false);
  activeConId = signal<string>('');

  showWorkspace = signal<boolean>(true);
  showThread = signal<boolean>(false);
  showCreateChannel = signal<boolean>(false);

  scrollChannelToBottom = signal<boolean>(false);

  // Signal for current User-ID
  currentUid = signal<string>('');

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
}
