import { Component, OnInit } from '@angular/core';
import { Events, IonicPage, NavController, NavParams, AlertController, LoadingController, Loading } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthProvider } from '../../providers/auth/auth';
import { CognitoCallback } from "../../providers/auth/cognito.service";
import { CommunityProvider } from '../../providers/community/community';
import { PushProvider } from '../../providers/push/push';
import { DataServiceProvider } from '../../providers/data-service/data-service';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage implements CognitoCallback, OnInit {
  loading: Loading;
  password:string ="";
  partOfEmail:string="";
  email:string ="";
  emailLengthA:number;
  emailLengthB:number;
  emailLengthC:number;
  errorMessage: string;
  showPassword: boolean = false;

  constructor(
    public events:Events,
    public navCtrl: NavController,
    public authProvider: AuthProvider,
    public splashScreen: SplashScreen,
    private loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public navParams: NavParams,
    public communityProvider: CommunityProvider,
    public dataServiceProvider: DataServiceProvider,
    public pushProvider: PushProvider) {
  }

  ngOnInit() {
    this.errorMessage = null;
    if(this.navParams.get('autologin')){
      this.email = this.navParams.get('email');
      this.password = this.navParams.get('password');
      this.Login();
    }
    this.events.subscribe('user:login', (username, password)=>{
      this.LoginFromRegisterPage(username, password);
    });

    this.dataServiceProvider.getDocument('LastUserEmail').then(data => {
      if(data) this.email = data.email;     /* Get last user email */
    });
  }

  async saveLastUserEmail(email) {
    let lastUserEmail =  {
      _id: 'LastUserEmail',
      email: email
    };
    await this.dataServiceProvider.putDocument(lastUserEmail);
  }

  btnActiv() {
    var reg = new RegExp(/ /g,"");
    var withOutWhiteSpaces = this.email.replace(/ /g,"");
    var last = withOutWhiteSpaces.charAt(withOutWhiteSpaces.length-1);
    var a =this.email.indexOf("@");
    var b =this.email.lastIndexOf(".");
    var c =this.email.lastIndexOf(last);
    var allEmail = this.email.slice(0 , c);
    this.partOfEmail = this.email.slice(0 , a);
    this.emailLengthA = this.partOfEmail.length;
    this.partOfEmail = this.email.slice(a , b);
    this.emailLengthB = this.partOfEmail.length;
    this.partOfEmail = this.email.slice(b , c);
    this.emailLengthC = this.partOfEmail.length;

    if((this.email.indexOf('@')> -1)&&(this.email.indexOf('.')> -1)&&(this.emailLengthA >=1)&&(this.emailLengthB >=2)&&
    (this.emailLengthC >=2)&&(this.emailLengthC <=4)&&(reg.test(allEmail) == false))
      document.getElementById('myBtn').removeAttribute("disabled");
    else document.getElementById('myBtn').setAttribute("disabled","disabled");
  }

  Login() {
    this.presentLoginSpinner();
    this.errorMessage = null;
    this.authProvider.authenticate(this.email.toLowerCase(), this.password, this);
  }

  LoginFromRegisterPage (username, password) {
    this.presentLoginSpinner();
    this.errorMessage = null;
    this.authProvider.authenticate(username.toLowerCase(), password, this);
  }

  presentLoginSpinner() {
    this.loading = this.loadingCtrl.create({
      content: 'Logging In...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }

  cognitoCallback(message: string, result: any) {
    if (message != null) {
    this.errorMessage = message;
      let alert = this.alertCtrl.create({
        title: 'Login Failure',
        message: this.errorMessage,
        buttons: [{
          text: 'Ok',
          handler: () => { this.password = '' }
        }]
      });
      alert.present()
      this.loading.dismiss();
    } else {
      this.saveLastUserEmail(this.email); /* Save user email to last login */
      /* Everytime we login as user*/
      this.pushProvider.initPushNotification(result);
      this.communityProvider.switchToNewCommunity().then(() => {
        this.navCtrl.setRoot("DashboardPage", {}, {animate: true, direction: 'forward'});
      });
    }
  }

  Recover() {
    this.navCtrl.push("RecoverPasswordPage", { email: this.email }, {animate: true, direction: 'forward'});
  }

  Register() {
    this.navCtrl.push("RegisterPage", { email: this.email }, {animate: true, direction: 'forward'});
  }
}
