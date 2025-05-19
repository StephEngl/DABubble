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

}