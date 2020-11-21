import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

import { AuthService } from './auth.service';

import { UserServiceInterface } from './user.service.interface';

import { IUser } from '../models/user';
import { TranslateService } from '@ngx-translate/core';
import { LogService } from './log.service';
import { User } from '../classes/user';




@Injectable({
  providedIn: 'root'
})
export class UserService implements UserServiceInterface {
  
  user$: BehaviorSubject<IUser> = new BehaviorSubject<IUser>(null);

  public user: IUser;
  private userDocPath: string;
  private userValueChanges: Observable<IUser>;

  private authStateSubscription: Subscription;
  constructor(private logService: LogService, private afs: AngularFirestore, private translate: TranslateService, private authService: AuthService) {}

  async initialize() {
    this.authStateSubscription = this.authService.authUser$.subscribe(
      async authUser => {
        if( this.authService.authUser ) {
          this.userDocPath = `users/${this.authService.authUser.uid}`
          try {
            this.user = <IUser>(await this.afs.doc<IUser>(this.userDocPath).get().toPromise()).data();
          } catch(error) {
            this.logService.error(error);
            this.user = null;
          }

          if( !this.user ) {
            this.user = new User(this.authService.authUser).export();
            await this.afs.doc<IUser>(this.userDocPath).set(this.user);
          }

          this.userValueChanges = this.afs.doc<IUser>(this.userDocPath).valueChanges();
          this.userValueChanges.subscribe( {
            next: async (user) => {
              this.user = user;
              this.user$.next(this.user);
            },
            error: async (error) => {
              this.logService.error(error);
             },
          });
        } else {
          this.user = null;
          this.user$.next(null);
        }
      })
  }

  async saveUserAsync(user: IUser) {
    if (user) {
      user.name = `${user.firstName} ${user.lastInitial}.`;
      await this.afs.doc<IUser>(this.userDocPath).update(user);
    }
  }

  hasFeature( features: string[] ) {
    // TODO
    return true;
  }

  translateName() {
    // translate new ANONYMOUS user names into local language
              // if (this.user.firstName === 'ANONYMOUS') {
              //   this.user.firstName = <string>await this.translate.get('ANONYMOUS').toPromise();
              //   let alphabet = <string>await this.translate.get('ALPHABET').toPromise();
              //   this.user.lastInitial = alphabet[Math.floor(Math.random() * alphabet.length)];
              //   this.user.name = `${this.user.firstName} ${this.user.lastInitial}.`;
              //   await this.saveUserAsync(this.user);
              // }
  }
}
