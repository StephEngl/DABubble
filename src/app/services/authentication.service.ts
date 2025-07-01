import { Injectable, signal, inject } from '@angular/core';
import { initializeApp } from 'firebase/app';
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
  deleteUser,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  sendPasswordResetEmail,
  verifyPasswordResetCode,
  confirmPasswordReset,
  fetchSignInMethodsForEmail,
} from '@angular/fire/auth';
import { UsersService } from './users.service';
import { SignalsService } from './signals.service';

/**
 * Provides authentication functionality using Firebase Auth. This includes creating users, signing users in and out,
 * updating user profiles, and managing the authentication state. The service also manages the current user's session
 * and provides reactive signals for tracking login state and active user initials.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  usersService = inject(UsersService);
  signalService = inject(SignalsService);

  isAuthenticated = signal<boolean>(false);
  activeUserName: string = '';
  userId: string = '';
  provider = new GoogleAuthProvider();
  private auth: Auth;

  constructor(private router: Router) {
    this.auth = getAuth();
    this.checkAuthStatus();
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
  async createUser(
    email: string,
    password: string,
    name: string
  ): Promise<UserCredential> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
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
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      this.checkAuthStatus();
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  }

  async signInWithGooglePopup(): Promise<void> {
    try {
      const result = await signInWithPopup(this.auth, this.provider);
      const user = result.user;
      if (user) {
        this.checkAuthStatus();

        await this.usersService.addUser(user.uid, {
          name: user.displayName ?? 'Unknown',
          email: user.email ?? '',
          avatarId: '0',
          status: 'online',
        });
      }
    } catch (error) {
      console.error('Google Sign-In Popup Fehler:', error);
    }
  }

  // Sign in with Google Redirect when webhosting
  // signInWithGoogleRedirect(): void {
  //   localStorage.setItem('isRedirecting', 'true');
  //   signInWithRedirect(this.auth, this.provider);
  // }

  // async handleRedirectResult(): Promise<void> {
  //   const isRedirecting = localStorage.getItem('isRedirecting');

  //   if (!isRedirecting) {
  //     return;
  //   }
  //   localStorage.removeItem('isRedirecting');

  //   try {
  //     const result = await getRedirectResult(this.auth);
  //     console.log('Result', result);
  //     if (result) {
  //       const user = result.user;
  //       console.log('user aus redirect:', user, result);

  //       this.isAuthenticated.set(true);

  //       await this.usersService.addUser(user.uid, {
  //         name: user.displayName ?? 'Unknown',
  //         email: user.email ?? '',
  //         avatarId: '0',
  //         status: 'online',
  //       });

  //       // navigate to main page after signing in with Google
  //       // const returnUrl = localStorage.getItem('returnUrl') || '/';
  //       // localStorage.removeItem('returnUrl');
  //       // this.router.navigateByUrl(returnUrl);
  //     }
  //   } catch (error) {
  //     console.error('Google Sign-In Redirect Fehler:', error);
  //   }
  // }

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
        displayName: name,
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Observes the authentication state and returns the current user (if authenticated).
   * @returns {Promise<any>} A promise resolving to the user object or null if not authenticated.
   * @throws {Error} Throws an error if there's an issue while checking authentication state.
   */
  async onAuthStateChanged(): Promise<any> {
    try {
      return await new Promise((resolve) => {
        onAuthStateChanged(this.auth, (user) => resolve(user));
      });
    } catch (error) {
      console.error('Auth status error:', error);
      return null;
    }
  }

  /**
   * Checks the current authentication status and navigates to
   * the appropriate page based on the user's state.
   */
  checkAuthStatus() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.isAuthenticated.set(true);
        this.router.navigate(['/']);
      } else {
        this.isAuthenticated.set(false);
      }
    });
  }

  /**
   * Signs out the currently authenticated user and redirects to the login page.
   * @returns {Promise<void>} Resolves when the user has been signed out.
   * @throws {Error} Throws an error if the sign-out process fails.
   */
  async signOutUser(): Promise<void> {
    try {
      await this.usersService.updateUserStatus(this.userId, 'offline');
      await signOut(this.auth);
      this.isAuthenticated.set(false);
      this.router.navigate(['/login']);
      this.signalService.triggerToast('Logged out', 'confirm');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }

  /**
   * Deletes the currently authenticated user account.
   * @returns {Promise<void>} Resolves when the user account has been deleted.
   * @throws {Error} Throws an error if deleting the user fails.
   */
  async deleteCurrentUser(): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) return;
    try {
      await deleteUser(user);
      this.isAuthenticated.set(false);
      this.signalService.triggerToast('User deleted', 'confirm');
      this.router.navigate(['/login']).then(() => location.reload());
    } catch (error) {
      console.error('Deleting active user failed', error);
    }
  }

  async getActiveUserId() {
    try {
      const user = await this.onAuthStateChanged();
      this.userId = user?.uid;
    } catch (error) {
      console.error('Error fetching user:', error);
      this.userId = 'error';
    }
  }

  currentUser() {
    const currentUserId = this.userId;
    const user = this.usersService.users.find(
      (user) => user.id === currentUserId
    );
    return user;
  }

  async sendMailForNewPassword(email: string) {
    try {
      await sendPasswordResetEmail(this.auth, email, {
        // Optional: use of a continueUrl
        url: 'https://dabubble.stephanie-englberger.de/',
        handleCodeInApp: true,
      });
      this.signalService.triggerToast(
        'Email sent, if account exists. Please, also check your spam-folder',
        'confirm',
        './assets/icons/login/send.svg'
      );
      setTimeout(() => {
        this.signalService.backToLogin();
      }, 2500);
    } catch (error: any) {
      this.signalService.triggerToast('Error', error);
    }
  }

  /**
   * Checks, if password-reset-code (out of reset-email) is valid.
   * Returns the belonging mail-address.
   */
  async verifyPasswordResetCode(oobCode: string): Promise<string> {
    try {
      const email = await verifyPasswordResetCode(this.auth, oobCode);
      return email; // Mail-adress of the account
    } catch (error) {
      throw error;
    }
  }

  /**
   * Reset password with oobCode and the new password.
   */
  async confirmPasswordReset(
    oobCode: string,
    newPassword: string
  ): Promise<void> {
    try {
      await confirmPasswordReset(this.auth, oobCode, newPassword);
    } catch (error) {
      throw error;
    }
  }
}
