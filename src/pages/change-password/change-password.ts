import { Component } from '@angular/core';
import { IonicPage, AlertController, NavController, NavParams } from 'ionic-angular';
import { CognitoUtil } from "../../providers/auth/cognito.service";

@IonicPage()
@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePasswordPage {

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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private cognitoUtil: CognitoUtil,
    public alertCtrl: AlertController,
  ) {
    this.changePasswordButtonDisabled = true;
  }

  validate(input) {

    this.validateHasDigit = this.hasDigit(input);
    this.validateHasCapital = this.hasCap(input);
    this.validateHasLower = this.hasLow(input);
    this.validateHasSpecial = this.hasSpec(input);
    this.passwordLength = input.length;

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

  public changePassword(oldPassword: string, newPassword: string): void {
    this.cognitoUtil.changePassword(oldPassword, newPassword, (err, result) => {
      if (err) {
        this.showMessage(false, 'Changing Password Error', err.message);
      }else {
        this.showMessage(true, 'Password Changed!', 'Your password was successfully changed.');
      }
    });
  }

  public showMessage(success: boolean, title: string, subTitle: string): void {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: [{
        text: 'Ok',
        handler: () => {
          if(success){
            let grandParentPage = this.navCtrl.getPrevious(this.navCtrl.getPrevious(this.navCtrl.getActive()));
            this.navCtrl.setRoot(grandParentPage, {}, { animate: true, direction: 'forward' })
          }
        }
      }]
    });
    alert.present();
  }
}
