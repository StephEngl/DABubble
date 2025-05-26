import { Injectable, inject, OnDestroy, signal } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  onSnapshot,
  setDoc,
  getDoc,
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
    if (this.unsubscribeUser) {
      this.unsubscribeUser();
    }
  }

  getUsersRef() {
    return collection(this.firestore, 'users');
  }

  subUsersList() {
    return onSnapshot(
      this.getUsersRef(),
      (snapshot) => {
        this.users = [];
        snapshot.forEach((element) => {
          const user = element.data();
          this.users.push(this.setObjectData(element.id, user));
        });
        console.log('User', this.users);
      },
      (error) => {
        console.error('Firestore Error', error.message);
      }
    );
  }

  /**
   * Adds a new user to the Firestore database.
   * @param uid The unique identifier for the user
   * @param user The user data to be added
   * @returns A promise that resolves with the document reference of the newly added user
   */
  async addUser(uid: string, user: UserInterface): Promise<void | DocumentReference> {
    try {
      const userRef = doc(this.getUsersRef(), uid);
      await setDoc(userRef, user);
      return userRef;
    } catch (err) {
      console.error(err);
    }
  }

  async getUserByUid(uid: string): Promise<UserInterface | undefined> {
    try {
      const userRef = doc(this.getUsersRef(), uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        return this.setObjectData(userSnap.id, data);
      } else {
        console.warn("User not found");
        return
      }
    } catch (err) {
      console.error(err);
      return undefined;
    }
  }

  setObjectData(id: string, obj: any): UserInterface {
    return {
      id: id,
      name: obj.name || '',
      email: obj.email || '',
      avatarId: obj.avatarId || '0',
      status: obj.status,
    };
  }

  async updateUserAvatar(uid: string, avatarId: string): Promise<void> {
    try {
      const userRef = doc(this.getUsersRef(), uid);
      await setDoc(userRef, { avatarId }, { merge: true }); // just adapt avatarId
    } catch (err) {
      console.error(err);
    }
  }


  findName(id: string): string {
    const searchedUser = this.users.find(user => user.id === id);
    return searchedUser?.name ?? 'Unknown';
  }

  getAvatar(id: string): string {
    const searchedUser = this.users.find(user => user.id === id);
    if (searchedUser?.avatarId !== undefined) {
      return `./../../../../assets/icons/user/user_${searchedUser.avatarId}.svg`;
    }
    return './../../../../assets/icons/user/user_0.svg';
  }


}
