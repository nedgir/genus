import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { Push } from '@ionic-native/push';
import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { CalendarModule } from 'angular-calendar';
import { CognitoUtil } from "../providers/auth/cognito.service";
import { AwsUtil } from "../providers/auth/aws.service";
import { S3Service } from "../providers/auth/s3.service";
import '../../node_modules/chart.js/dist/Chart.bundle.min.js';
import { EventProvider } from '../providers/event/event';
import { AuthProvider } from '../providers/auth/auth';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { SessionProvider } from '../providers/session/session';
import { TouchID } from '@ionic-native/touch-id';
import { Camera } from '@ionic-native/camera';
import { PhoneNumberPipe } from '../pipes/phone-number/phone-number';
import { CallNumber } from '@ionic-native/call-number';
import { Contacts, Contact } from '@ionic-native/contacts';
import { ImageProvider } from '../providers/image/image';
import { CameraProvider } from '../providers/camera/camera';
import { DataServiceProvider } from '../providers/data-service/data-service';
import { SyncServiceProvider } from '../providers/sync-service/sync-service';
import { MomentsProvider } from '../providers/moments/moments';
import { CommunityProvider } from '../providers/community/community';
import { PushProvider } from '../providers/push/push';
import { HttpModule } from '@angular/http';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ResourceProvider } from '../providers/resource/resource';

@NgModule({
  declarations: [
    MyApp,
    PhoneNumberPipe
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      backButtonText: '',
      backButtonIcon: 'arrow-back'
    }),
    CalendarModule.forRoot(),
    HttpModule
  ],
  bootstrap: [IonicApp],
  schemas: [ ],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Push,
    ScreenOrientation,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    EventProvider,
    AuthProvider,
    CognitoUtil,
    AwsUtil,
    S3Service,
    SessionProvider,
    CallNumber,
    TouchID,
    Contacts,
    Contact,
    Camera,
    ImageProvider,
    CameraProvider,
    DataServiceProvider,
    SyncServiceProvider,
    MomentsProvider,
    CommunityProvider,
    PushProvider,
    InAppBrowser,
    ResourceProvider
  ]
})
export class AppModule { }
