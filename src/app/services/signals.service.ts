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

  showWorkspace = signal<boolean>(true);
  showCreateChannel = signal<boolean>(false);

}
