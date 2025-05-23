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

    /**
   * Signs in a user with the provided email and password.
   * @param email The email of the user.
   * @param password The password of the user.
   * @returns {Promise<any>} The user object after successful sign-in.
   * @throws {Error} Throws an error if the sign-in fails.
   */
  async signInUser(email: string, password: string): Promise<any> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      this.router.navigate(['/']);
      this.isAuthenticated.set(true);
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  }

    /**
   * Updates the profile of the currently authenticated user with the new name.
   * @param name The new name to set for the user.
   * @returns {Promise<void>} Resolves when the profile update is complete.
   * @throws {Error} Throws an error if the profile update fails.
   */
  async updateProfileUser(name: string): Promise<void> {
    if (!this.auth.currentUser) {
      throw new Error('No user is currently logged in.');
    }

    try {
      await updateProfile(this.auth.currentUser, {
        displayName: name
      });
    } catch (error) {
      throw error;
    }
  }
}