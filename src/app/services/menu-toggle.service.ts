import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MenuToggleService {

  constructor() { }

  showWorkspace = signal<boolean>(false);
  showCreateChannel = signal<boolean>(false);
}
