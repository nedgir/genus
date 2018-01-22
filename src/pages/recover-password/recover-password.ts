import { Component } from '@angular/core';
import { IonicPage, AlertController, NavController, NavParams } from 'ionic-angular';
import { CognitoUtil } from "../../providers/auth/cognito.service";
import { CognitoUser } from "amazon-cognito-identity-js";

@IonicPage()
@Component({
  selector: 'page-recover-password',
  templateUrl: 'recover-password.html',
})
export class RecoverPasswordPage {

  email:string ="";
  partOfEmail:string="";
  emailLengthA:number;
  emailLengthB:number;
  emailLengthC:number;
  public unauthenticatedUser: CognitoUser

  constructor(
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public cognitoUtil: CognitoUtil,
  ) {
    this.email = this.navParams.get('email') || '';
  }

  ionViewDidLoad() {
    this.btnActiv(); /* Initial validation */
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

    if((this.email.indexOf('@')> -1)&&(this.email.indexOf('.')> -1)&&(this.emailLengthA >=1)&&
      (this.emailLengthB >=2)&&(this.emailLengthC >=2)&&(this.emailLengthC <=4)&&(reg.test(allEmail) == false))
      document.getElementById('recoverBtn').removeAttribute("disabled");
    else document.getElementById('recoverBtn').setAttribute("disabled","disabled");
  }

  Back() {
    this.navCtrl.pop();
  }

  public recoverPassword(userName: string): void {
    this.unauthenticatedUser = this.cognitoUtil.getUnauthenticatedUser(userName.toLowerCase());
    this.unauthenticatedUser.forgotPassword({
      onSuccess: () => {
        console.log('CodeDeliveryData from forgotPassword: ');
      },
      onFailure: (err) => {
        if(err.name === 'InvalidParameterException') {
          this.showMessage(false, 'Password Recovery', 'Cannot reset your password because there is no registered/verified email or phone number. To prevent this issue in the future, please validate your email address in Settings. To reset your password, call (877) 203-7604');
        } else if (err.name === 'LimitExceededException') {
          this.showMessage(false, 'Password Recovery', err.message);
        } else {
          this.showMessage(false, 'Password Recovery', `Other Error: Name ${err.name}, Message ${err.message}`);
        }
      },
      inputVerificationCode: (data) => {
        this.showMessage(true, 'Recovery Code Sent', `Your recovery code was sent to ${data.CodeDeliveryDetails.Destination}.`);
      }
    });

  }

  private showMessage(success_recover: boolean, title: string, subTitle: string): void {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: [{
        text: 'Ok',
        handler: () => {
          if(success_recover) this.navCtrl.push("ConfirmPasswordPage", { unauthenticatedUser: this.unauthenticatedUser, email: this.email });
        }
      }]
    });
    alert.present();
  }

}
