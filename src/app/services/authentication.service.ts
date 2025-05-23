import { Injectable, signal, inject } from '@angular/core';
import { initializeApp } from "firebase/app";
import { Router } from '@angular/router';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  Auth,
  updateProfile,
  onAuthStateChanged,
  signOut,
  UserCredential,
  deleteUser
} from "@angular/fire/auth";
import { UsersService } from './users.service';

/**
 * Provides authentication functionality using Firebase Auth. This includes creating users, signing users in and out,
 * updating user profiles, and managing the authentication state. The service also manages the current user's session
 * and provides reactive signals for tracking login state and active user initials.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  isAuthenticated = signal<boolean>(false);
  usersService = inject(UsersService);
  activeUserName: string = '';
  private auth: Auth;

  constructor(private router: Router) {
    this.auth = getAuth();
  }


  /**
   * Returns whether the user is currently authenticated.
   * @returns {boolean} True if the user is authenticated, otherwise false.
   */
  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

 /**
   * Creates a new user account with the provided email, password, and name.
   * @param email The email of the new user.
   * @param password The password of the new user.
   * @param name The name of the new user.
   * @returns {Promise<UserCredential>} The user credential returned by Firebase after user creation.
   * @throws {Error} Throws an error if the user creation fails.
   */
  async createUser(email: string, password: string, name: string): Promise<UserCredential> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      this.router.navigate(['/login']);
      return userCredential;
    } catch (error) {
      throw error;
    }
  }

}