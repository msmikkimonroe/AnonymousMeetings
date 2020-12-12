import { Inject, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, ReplaySubject, Subscription } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';

import { HomeGroup, IGroup, IUser } from '../../shared/models';
import { User } from '../../shared/models';

import { IAuthService, IUserService, ILogService, ITranslateService, IFirestoreService } from './';
import { LOG_SERVICE, AUTH_SERVICE, TRANSLATE_SERVICE, ANGULAR_FIRESTORE, USER_BLL_SERVICE, FIRESTORE_SERVICE, ANGULAR_FIRE_FUNCTIONS } from './injection-tokens';
import { IAngularFirestore } from './angular-firestore.interface';
import { delay, switchMap } from 'rxjs/operators';
import _ from 'lodash';
import LogRocket from 'logrocket';
import { IUserBLLService } from '../../shared/bll/user-bll.service.interface';
import { IAngularFireFunctions } from './angular-fire-functions.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService implements IUserService {

  user$: ReplaySubject<User> = new ReplaySubject<User>(1);

  public user: User;
  private userDocPath: string;
  private _userValueChanges: Observable<IUser>;
  private _userValueChangesSubscription: Subscription;

  private authStateSubscription: Subscription;
  constructor(
    @Inject(FIRESTORE_SERVICE) private fss: IFirestoreService,
    @Inject(ANGULAR_FIRESTORE) private afs: IAngularFirestore,
    @Inject(ANGULAR_FIRE_FUNCTIONS) private aff: IAngularFireFunctions,
    @Inject(TRANSLATE_SERVICE) private translate: ITranslateService,
    @Inject(LOG_SERVICE) private logService: ILogService,
    @Inject(AUTH_SERVICE) private authService: IAuthService,
    @Inject(USER_BLL_SERVICE) private userBLLService: IUserBLLService) { }

  public async getUser(id: string, timeout = 0): Promise<IUser> {
    return new Promise(async (resolve, reject) => {
      setTimeout(async () => {
        try {
          const user = await this.fss.col(`users`).doc<IUser>(id).get().toPromise();
          if (user.exists) {
            this.user = new User(user.data());
            this.userValueChanges();
            this.user$.next(this.user);
            resolve(this.user);
          } else {
            throw new Error(`Unable to find User ${id}`);
          }
        } catch (e) {
          this.logService.error(e);
          resolve(null);
        }
      }, timeout);
    })

  }
  userValueChanges() {
    if (!_.isEmpty(this._userValueChangesSubscription)) this._userValueChangesSubscription.unsubscribe();

    this._userValueChanges = this.afs.doc<IUser>(`users/${this.user.id}`).valueChanges();
    this._userValueChangesSubscription = this._userValueChanges.subscribe({
      next: async (user) => {
        this.user = new User(user);
        this.user$.next(this.user);
      },
      error: async (error) => {
        this.logService.error(error);
      },
    });
  }

  async saveUserAsync(user: User) {
    if (user) {
      try {
        await this.afs.doc<IUser>(`users/${this.user.id}`).update(user.toObject());
      } catch (e) {
        console.error(e);
        LogRocket.error(e);
      }
    }
  }

  hasFeature(features: string[]) {
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

  
  private async makeCallableAsync<T>(func: string, data: any): Promise<T> {
    let callable: any = this.aff.httpsCallable(func);
    let rv = await callable(data).toPromise().then((result) => {
      if (result) return <T>result;
      throw new Error(`Callable ${func} failed`);
    }, (error) => {
      LogRocket.error(error);
      console.log(error);
      throw new Error("Network call failed");
    })
    return null;
  }

  async setName(firstName: string, lastInitial: string) {
    await this.makeCallableAsync('setName', {firstName: firstName, lastInitial: lastInitial});
  }

  async makeHomeGroup(gid: string) {
    await this.makeCallableAsync('makeHomeGroup', {gid: gid});
  }
}
