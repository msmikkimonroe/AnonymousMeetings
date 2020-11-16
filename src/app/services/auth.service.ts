import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
//import firebase from 'firebase';
import * as firebaseui from 'firebaseui';
import { Subscription, ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthServiceInterface } from './auth.service.interface';

import { LogService } from './log.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements AuthServiceInterface {

  authUser: firebase.User = null;

  firebaseUi: any;

  authStateUser: ReplaySubject<firebase.User> = new ReplaySubject<firebase.User>()
  isAnonymous: boolean = true;

  private authStateSubscription: Subscription;
  constructor(private logService: LogService, private firebaseAuth: AngularFireAuth) {
    firebase.initializeApp(environment.firebaseConfig);

    this.authStateSubscription = firebaseAuth.authState.subscribe(
      (user: firebase.User) => {
        this.isAnonymous = user !== null ? user.isAnonymous : true;
        this.authUser = user;
        this.authStateUser.next(user);
      },
      (error: any) => {
        this.logService.error(error);
      },
      () => {
        this.logService.message('firebaseAuth.authState.complete()');
      });

    let auth = firebase.auth();
    auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .catch(function (error) {
        this.logService.error(error);
      });

    // Initialize the FirebaseUI Widget using Firebase.
    this.firebaseUi = new firebaseui.auth.AuthUI(auth);
  }

  isAuthenticated(): boolean {
    return this.authUser !== null ? true : false;
  }

  public async createAnonymous(complete?: boolean) {
    // all anonymous users have an anonymous firebase account
    // complete anonymity will be indicated with a scope or flag for Business Logic
    await this.firebaseAuth.signInAnonymously()
      .catch(error => {
        this.logService.error(error);
      });
  }

  async logout() {
    await this.firebaseAuth.signOut();
  }

  // TODO customize prompts for both "signin" and "signup"
  public static getUiConfig() {
    // FirebaseUI config.
    return {
      callbacks: {
        signInSuccessWithAuthResult: (authResult: firebase.auth.UserCredential) => {
          const user = authResult.user;
          const isNewUser = authResult.additionalUserInfo.isNewUser;

          // initialize new user
          if (isNewUser) {
            // do initialization stuff here (ex. create profile)
            return true;
          }

          // Return type determines whether we continue the redirect automatically
          // or whether we leave that to developer to handle.
          return true;
        }
      },
      credentialHelper: firebaseui.auth.CredentialHelper.NONE,
      signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        'apple.com',
        {
          provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          customParameters: {
            // Forces account selection even when one account
            // is available.
            prompt: 'select_account'
          }
        },
        {
          provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID,
          scopes: [
            'public_profile',
          ]
        },
        'microsoft.com',
        'yahoo.com',
        // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        // firebase.auth.GithubAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        // firebase.auth.PhoneAuthProvider.PROVIDER_ID // not available for Ionic apps
      ],
      // Terms of service url.
      tosUrl: 'https://anonymousmeetings.us/assets/pages/tos.html',
      privacyPolicyUrl: 'https://anonymousmeetings.us/assets/pages/privacy.html',
      //enableRedirectHandling: false,
      signInSuccessUrl: '/landing'
    };
  }
}





