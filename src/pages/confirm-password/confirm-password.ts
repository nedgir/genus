import { Component } from '@angular/core';
import { IonicPage, AlertController, NavController, NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { CognitoUser } from "amazon-cognito-identity-js";

@IonicPage()
@Component({
  selector: 'page-confirm-password',
  templateUrl: 'confirm-password.html',
})
export class ConfirmPasswordPage {
  email: string;
  verificationCode: string = "";
  validateHasDigit = false;
  validateHasCapital = false;
  validateHasLower = false;
  validateHasSpecial = false;
  passwordLength: number;
  newPassword: string = "";
  isCorrectLength = false;
  hasSpecial = false;
  hasNumber = false;
  hasCapital = false;
  hasLower = false;
  changePasswordButtonDisabled: boolean;
  private unauthenticatedUser: CognitoUser;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
  ) {
    this.changePasswordButtonDisabled = true;
    this.unauthenticatedUser = navParams.get('unauthenticatedUser');
    this.email = navParams.get('email');
  }

  validate() {
    this.validateHasDigit = this.hasDigit(this.newPassword);
    this.validateHasCapital = this.hasCap(this.newPassword);
    this.validateHasLower = this.hasLow(this.newPassword);
    this.validateHasSpecial = this.hasSpec(this.newPassword);
    this.passwordLength = this.newPassword.length;

    if (this.passwordLength >= 8) {
      this.isCorrectLength = true;
    } else {
      this.isCorrectLength = false;
    }

    if ((this.validateHasDigit == true)
      && (this.validateHasCapital == true)
      && (this.validateHasLower == true)
      && (this.validateHasSpecial == true)
      && (this.passwordLength >= 8)
      && (this.verificationCode.length == 6)
    ) {
      this.changePasswordButtonDisabled = false;
    } else {
      this.changePasswordButtonDisabled = true;
    }

  }

  hasDigit(str) {
    var re = new RegExp("\\d");
    if (re.test(str)) {
      this.hasNumber = true;
      return true;
    } else {
      this.hasNumber = false;
      return false;
    }
  }

  hasCap(str) {
    var re = new RegExp("([A-Z])");
    if (re.test(str)) {
      this.hasCapital = true;
      return true;
    } else {
      this.hasCapital = false;
      return false;
    }
  }

  hasLow(str) {
    var re = new RegExp("([a-z])");
    if (re.test(str)) {
      this.hasLower = true;
      return true;
    } else {
      this.hasLower = false;
      return false;
    }
  }

  hasSpec(str) {
    var re = new RegExp("([\.\+\\\-\,\@\!\#\$\%\^\&\*\(\)\;\/\<\>\"\'\:\|\_])");
    if (re.test(str)) {
      this.hasSpecial = true;
      return true;
    } else {
      this.hasSpecial = false;
      return false;
    }
  }

  Back() {
    this.navCtrl.pop();
  }

  public changePassword(verificationCode: string, newPassword: string): void {
    this.unauthenticatedUser.confirmPassword(verificationCode, newPassword, {
      onSuccess: () => {
        this.showMessage(true, 'Password Reset', 'Your password was reset.');
      },
      onFailure: (err: Error) => {
        this.showMessage(false, 'Error Changing Password', err.message);
      }
    });

  }

  public showMessage(success_change: boolean, title: string, subTitle: string): void {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: [{
        text: 'Ok',
        handler: () => {
          if(success_change)  {
            this.navCtrl.setRoot(LoginPage, {autologin: true, email: this.email, password: this.newPassword}, { animate: true, direction: 'back' });
          }
        }
      }]
    });
    alert.present();
  }
}
