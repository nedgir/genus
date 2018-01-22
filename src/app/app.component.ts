import { Component, ViewChild, OnInit } from '@angular/core';
import { Nav, Platform, MenuController, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { AuthProvider } from "../providers/auth/auth";
import { EventProvider } from '../providers/event/event';
import { SessionProvider } from '../providers/session/session';
import { CommunityProvider } from '../providers/community/community';
import { CognitoUtil, LoggedInCallback } from "../providers/auth/cognito.service";
import { AwsUtil } from "../providers/auth/aws.service";
import { PushProvider } from '../providers/push/push';

const { version: appVersion } = require('../../package.json');

@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit, LoggedInCallback {
  @ViewChild(Nav) nav: Nav;
  pages: Array<string>;
  app_version = appVersion;

  constructor(
    public awsUtil: AwsUtil,
    public authProvider: AuthProvider,
    public eventProvider: EventProvider,
    public sessionProvider: SessionProvider,
    public communityProvider: CommunityProvider,
    public cognitoUtil: CognitoUtil,
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public screenOrientation: ScreenOrientation,
    public menu: MenuController,
    public alertCtrl: AlertController,
    public pushProvider: PushProvider) {
    this.initializeApp();
    this.pages = [
      "Invite Others...",
      "Change Community Nickname...",
      "Personal Settings...",
      "Logout"
    ];
  }
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.hide();
      this.menu.swipeEnable(false);
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY).then(() => {
        console.log("succesfully locked orientation");
      }).catch(() => {
        console.log("cannot lock orientation on this device");
      });
    });
  }

  ngOnInit() {
    this.authProvider.isAuthenticated(this);
  }

  async isLoggedIn(message: string, isLoggedIn: boolean) {
    let mythis = this;
    this.cognitoUtil.getIdToken({
      callback() {},
      callbackWithParam(token: any) {
        mythis.awsUtil.initAwsService(null, isLoggedIn, token);
      }
    });
    if (isLoggedIn) {
      /* Everytime app is killed, reenter app starts here*/
      this.pushProvider.initPushNotification(this.cognitoUtil.getCognitoCreds());
      await this.communityProvider.switchToNewCommunity();
      await this.nav.setRoot("DashboardPage", {}, {animate: true, direction: 'forward'});
    }
    else {
      await this.nav.setRoot("LoginPage", {}, { animate: true, direction: 'forward' });
    }
    this.splashScreen.hide();
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if (page === 'Change Community Nickname...') {
      this.changeNickname();
    } else if(page === 'Invite Others...') {
      this.nav.push("InviteOthersPage", {}, { animate: true, direction: 'forward' });
    } else if(page === 'Personal Settings...') {
      this.nav.push("PersonalProfilePage", {}, { animate: true, direction: 'forward' });
    } else if(page === 'Logout'){
      this.authProvider.logout();
      this.nav.setRoot("LoginPage", {}, { animate: true, direction: 'back' });
    }
  }

  changeNickname() {
    let alert = this.alertCtrl.create({
      title: 'Change Nickname',
      message: 'Enter a new name for the person of care',
      inputs: [
        {
          name: 'nickname',
          value: this.sessionProvider.getCurrentCommunityName()
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: (result) => {
            if(result.nickname){
              this.eventProvider.postNickname(result.nickname)
            }
          }
        }
      ]
    });
    alert.present();
  }
}
