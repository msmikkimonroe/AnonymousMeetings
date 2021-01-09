import { SharedModule } from './shared.module';

import { Component, enableProdMode, Inject, Injector } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

import { MenuController, Platform, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { InitializeService } from './services/initialize.service';

import { AUTH_SERVICE, IAuthService, IBusyService, IUserService, BUSY_SERVICE, USER_SERVICE, BusyService, ISettingsService, SETTINGS_SERVICE, TOAST_SERVICE, IToastService, ILogService, LOG_SERVICE } from './services';
import { Router } from '@angular/router';
import _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { Zoom } from '@ionic-native/zoom/ngx';
import LogRocket from 'logrocket';
declare var navigator: any;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  SDK_KEY = 'd1BznmF4HfrvRZmabIyCcp2a6bpcZYbqmCXB';
  SDK_SECRET = 'U0j5w2XB4CURvIhIpwf6cJnjRknjCZdG4Sva';

  loggedIn = true;
  dark = true;

  get showLogin() {
    return this.authService.isAnonymous;
  }

  constructor(
    // private menu: MenuController,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private swUpdate: SwUpdate,
    private initializeService: InitializeService,
    private router: Router,
    private translateService: TranslateService,
    private zoomService: Zoom,
    private toastCtrl: ToastController,
    @Inject(LOG_SERVICE) private logService: ILogService,
    @Inject(TOAST_SERVICE) private toastService: IToastService,
    @Inject(BUSY_SERVICE) private busyService: IBusyService,
    @Inject(AUTH_SERVICE) private authService: IAuthService,
    @Inject(USER_SERVICE) private userService: IUserService,
    @Inject(SETTINGS_SERVICE) private settingsService: ISettingsService
  ) {
    if (environment.production) {
      enableProdMode();
    }
    this.initializeApp();
    this.settingsService.initialize(false);
  }

  async initializeApp() {
    this.logService.trace("initializeApp()");
    this.platform.ready().then(async () => {

      console.log("Platform ready");
      await this.initializeService.initializeServices();

      if (this.platform.is('hybrid')) { // 'hybrid' detects both Cordova and Capacitor
        // make your native API calls
      } else {
        // fallback to browser APIs
      }

      this.zoomService.initialize(this.SDK_KEY, this.SDK_SECRET)
      .then((success) => {
        console.log(success);
      })
      .catch((error)=>{
        console.log(error);
      });

      let creating = false;
      let pleaseWait = await this.translateService.get('PLEASE_WAIT').toPromise();
      let creatingUser = await this.translateService.get('CREATING_USER').toPromise();
      this.authService.authUser$.subscribe(
        async authUser => {
          await this.initializeService.initializeServices();
          if (!_.isEmpty(authUser) && !_.isEmpty(this.userService.user)) {
            // TODO config
            LogRocket.log('auth!_.isEmpty(authUser) && !_.isEmpty(this.userService.user)User', 'navigate', '/home/tab/home');
            this.router.navigateByUrl('/home/tab/home');
          } else if (!_.isEmpty(authUser)) {
            let user = await this.userService.getUser(authUser.uid);
            if (user) {
              LogRocket.log('userService.getUser(authUser.uid)', 'navigate', '/home/tab/home')
              this.router.navigateByUrl('/home/tab/home');
            } 
            // else {
            //   this.router.navigateByUrl('/core/logout');
            // }
          }
          // else {
          //   this.router.navigateByUrl('/core/landing');
          // }
        });
    });

    this.statusBar.styleDefault();
    this.splashScreen.hide();
  }

  async ngOnInit() {
    this.swUpdate.available.subscribe(async res => {
      const toast = await this.toastCtrl.create({
        message: 'Update available!',
        position: 'bottom',
        buttons: [
          {
            role: 'cancel',
            text: 'Reload'
          }
        ]
      });

      await toast.present();

      toast
        .onDidDismiss()
        .then(() => this.swUpdate.activateUpdate())
        .then(() => window.location.reload());
    });
  }
}
