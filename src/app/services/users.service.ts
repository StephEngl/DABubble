import { Injectable, inject, OnDestroy } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  onSnapshot,
  setDoc,
  DocumentReference,
} from '@angular/fire/firestore';
import { UserInterface } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UsersService implements OnDestroy {
  firestore: Firestore = inject(Firestore);
  users: UserInterface[] = [];
  unsubscribeUser;

  constructor() {
    this.unsubscribeUser = this.subUsersList();
  }

  ngOnDestroy(): void {
    // if (this.unsubscribeUser) {
    //   this.unsubscribeUser();
    // }
  }

  getUsersRef() {
    return collection(this.firestore, 'users');
  }

  subUsersList() {
    return onSnapshot( this.getUsersRef(),(snapshot) => {
        this.users = [];
        snapshot.forEach((element) => {
          const user = element.data();
          // this.users.push( this.usersContactsService.setObjectData(element.id, user));
        });
      },
      (error) => {
        console.error('Firestore Error', error.message);
      }
    );
  }
}
