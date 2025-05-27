import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SignalsService {

  constructor() { }

  isLoginDialog = signal<boolean>(true);
  isRegisterDialog = signal<boolean>(false);
  isChoosingAvatarDialog = signal<boolean>(false);
  isPasswordForgottenDialog = signal<boolean>(false);
  focusChat = signal<boolean>(false);
  focusThread = signal<boolean>(false);

  showWorkspace = signal<boolean>(true);
  showThread = signal<boolean>(false);
  showCreateChannel = signal<boolean>(false);

  scrollChannelToBottom = signal<boolean>(false);

  // Signal for current User-ID
  currentUid = signal<string>('');
}
