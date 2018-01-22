import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { CognitoUtil, CognitoCallback } from "../../providers/auth/cognito.service";
import { RegistrationUser } from '../../models/registration-user';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage implements CognitoCallback {
  //ngModel
  password: string = "";
  email: string = "";
  firstname: string = "";
  lastname: string = "";

  hasSpecial: boolean = false;
  hasNumber: boolean = false;
  hasCapital: boolean = false;
  hasLower: boolean = false;

  validFirstName: boolean = false;
  validLastName: boolean = false;
  validEmail: boolean = false;
  validPassword: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public cognitoUtil: CognitoUtil, public authProvider: AuthProvider) {
    this.email = this.navParams.get('email') || '';
  }

  ionViewDidLoad() { }

  validateFirstName() {
    this.validFirstName = this.firstname.length >= 2;
  }

  validateLastName() {
    this.validLastName = this.lastname.length >= 3;
  }

  validateEmail() {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.validEmail = re.test(this.email);
  }

  validatePassword() {
    this.hasNumber = this.hasDigit(this.password);
    this.hasCapital = this.hasCap(this.password);
    this.hasLower = this.hasLow(this.password);
    this.hasSpecial = this.hasSpec(this.password);
    this.validPassword = this.password.length >= 8 && this.hasNumber && this.hasCapital && this.hasLower && this.hasSpecial;
  }

  hasDigit(password) {
    var re = new RegExp("\\d");
    return re.test(password);
  }

  hasCap(password) {
    var re = new RegExp("([A-Z])");
    return re.test(password);
  }

  hasLow(password) {
    var re = new RegExp("([a-z])");
    return re.test(password);
  }

  hasSpec(password) {
    var re = new RegExp("([\.\+\\\-\,\@\!\#\$\%\^\&\*\(\)\;\/\<\>\"\'\:\|\_])");
    return re.test(password);
  }

  Back() {
    this.navCtrl.pop();
  }

  cognitoCallback(message: string, result: any) {
     if (message != null) { //error
         console.log("ERROR:", message);
     } else { //success
         console.log("RESULT:",result);
     }
  }

  register() {
    let user = new RegistrationUser();
    user.email = this.email.toLowerCase();
    user.password= this.password;
    user.firstName = this.firstname;
    user.lastName = this.lastname;

    this.authProvider.register(user, this);
  }
}
