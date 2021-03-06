import { SharedModule } from './shared.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
// import { ServiceWorkerModule } from '@angular/service-worker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';

import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';

import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { environment } from '../environments/environment';

//import { Geolocation } from '@ionic-native/geolocation/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
//import { Contacts } from '@ionic-native/contacts/ngx';

import { google } from '@google/maps';
import { AgmCoreModule } from '@agm/core';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule, AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireFunctions, AngularFireFunctionsModule, USE_EMULATOR as USE_FUNCTIONS_EMULATOR } from '@angular/fire/functions';

import { FirestoreService } from './services/firestore.service';

import { TagInputModule } from 'ngx-chips';
import { Zoom } from '@ionic-native/zoom/ngx';
import { NgCalendarModule  } from 'ionic2-calendar';

import { TranslateUniversalLoader } from './utils/translateuniversalloader';
import { GroupService, GroupsService, UserService, AuthService, BusyService, SettingsService, SharedDataService, ZoomService,
  GROUP_SERVICE, SETTINGS_SERVICE, BUSY_SERVICE, USER_SERVICE, GROUPS_SERVICE, 
  AUTH_SERVICE, ANGULAR_FIRE_AUTH, TRANSLATE_SERVICE, FIRESTORE_SERVICE, 
  ANGULAR_FIRE_FUNCTIONS, TOAST_SERVICE, ToastService, MEETING_SERVICE, MeetingService, DataService, DATA_SERVICE } from './services';

import { CoreModule } from './pages/core/core.module';
import { HomeTabPageModule } from './pages/home-tab/home-tab.module';
import { MeetingsTabPageModule } from './pages/meetings-tab/meetings-tab.module';
import { AdminTabPageModule } from './pages/admin-tab/admin-tab.module';
import { AuthGuard, FeatureGuard } from './guards';
import { NbThemeModule } from '@nebular/theme';
import { CommonModule } from './pages/common/common.module';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    SharedModule,
    BrowserModule,
    AppRoutingModule,
    IonicModule.forRoot(),
    NbThemeModule.forRoot(),
    IonicStorageModule.forRoot(),
    // ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: TranslateUniversalLoader
      }
    }),
    AgmCoreModule.forRoot({ apiKey: environment.googleCloudConfig.agmKey }),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireFunctionsModule,
    AngularFirestoreModule,     // TODO AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,
    BrowserAnimationsModule,
    TagInputModule,
    NgCalendarModule,
    // CoreModule,
    // CommonModule,
    // HomeTabPageModule,
    // MeetingsTabPageModule,
    // AdminTabPageModule
  ],
  providers: [
    InAppBrowser,
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    // Geolocation,
    EmailComposer,
    SocialSharing,
    // Contacts,
    AngularFirestore,
    TranslateService,
    AngularFireAuth,
    AuthGuard,
    FeatureGuard,
    Zoom,

    { provide: USE_FUNCTIONS_EMULATOR, useValue: environment.firebaseConfig.useEmulators ? ['localhost', 5001] : undefined },
    { provide: FIRESTORE_SERVICE, useExisting: FirestoreService},
    { provide: ANGULAR_FIRE_FUNCTIONS, useExisting: AngularFireFunctions },
    { provide: DATA_SERVICE, useExisting: DataService},
    { provide: TRANSLATE_SERVICE, useExisting: TranslateService},
    { provide: AUTH_SERVICE, useExisting: AuthService },
    { provide: MEETING_SERVICE, useExisting: MeetingService },
    { provide: GROUPS_SERVICE, useExisting: GroupsService },
    { provide: GROUP_SERVICE, useExisting: GroupService },
    { provide: USER_SERVICE, useExisting: UserService },
    { provide: BUSY_SERVICE, useExisting: BusyService },
    { provide: TOAST_SERVICE, useExisting: ToastService },
    { provide: SETTINGS_SERVICE, useExisting: SettingsService },
    ZoomService,
    SharedDataService,

    // { provide: USE_FUNCTIONS_EMULATOR, useValue: environment.firebaseConfig.useEmulators ? ['localhost', 5001] : undefined },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
 }
