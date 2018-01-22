import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, Platform } from 'ionic-angular';
import { CognitoUtil } from '../../providers/auth/cognito.service';
import { TouchID } from '@ionic-native/touch-id';
import { EventProvider } from '../../providers/event/event';
import { CameraProvider } from '../../providers/camera/camera';
import { EmailFormatValid } from "../../validators/email";

@IonicPage()
@Component({
  selector: 'page-personal-profile',
  templateUrl: 'personal-profile.html',
})
export class PersonalProfilePage implements OnInit {
  phoneLength: number;
  phone: string = "";
  firstName: any;
  lastName: any;
  email: any;
  touchIdAvailable: boolean;
  data: any;
  userPicture: string;
  private emailButtonHidden: boolean;
  private phoneNumberButtonHidden: boolean;
  private userPictureExists: boolean = false;
  private is_mobile: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private touchId: TouchID,
    public cognitoUtil: CognitoUtil,
    public eventProvider: EventProvider,
    public cameraProvider: CameraProvider,
    public actionsheetCtrl: ActionSheetController,
    public plt: Platform) {
    this.touchIdAvailable = false;
    this.touchId.isAvailable()
      .then(
      res => this.touchIdAvailable = true,
      err => this.touchIdAvailable = false
      );
    this.emailButtonHidden = false;
    this.phoneNumberButtonHidden = false;
  }

  ngOnInit() {
    this.is_mobile = !this.plt.is('core') && this.plt.is('mobile');
    this.eventProvider.getUser().then((user) => {
      if (user) {
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.phoneFocusOut(user.phone);
        this.email = user.email;
        if(user.imageKeyPath)
          this.userPictureExists = true;
        this.userPicture = user.icon;
      }
    });

    this.cognitoUtil.getCurrentUser().getUserAttributes((err: Error, attributes: any) => {
      if (err) {
        this.emailButtonHidden = false;
        this.phoneNumberButtonHidden = false;
      }
      this.emailButtonHidden = this.getAttribute(attributes, "email_verified");
      this.phoneNumberButtonHidden = this.getAttribute(attributes, "phone_number_verified");
      this.email = this.getAttribute(attributes, "email");
      this.phone = this.formatPhoneNumber(this.getAttribute(attributes, "phone_number"));
    });
  }

  changeMyImage() {
    let actionSheet = this.actionsheetCtrl.create({
    title: 'Add/Update your Photo',
      buttons: [{
          text: 'Take a Picture',
          handler: () => {this.uploadPhoto('Camera')}
        }, {
          text: 'Add Photo from Library',
          handler: () => {this.uploadPhoto('Photolibrary')}
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {}
      }]
    });
    actionSheet.present();
  }

  private async uploadPhoto(sourceType) {
    let imageData = await this.cameraProvider.getPicture(512, 512, sourceType);
    await this.eventProvider.uploadUserImageS3(imageData);
    this.userPicture = 'data:image/jpeg;base64,' + imageData;
    this.userPictureExists = true;
  }

  /**
   * Retrieves the attribute specified.
   * @param attributes Attributes array.
   * @param attributeName Attribute required.
   */
  private getAttribute(attributes: any, attributeName: string): any {

    let auxiliar: any;

    /**
     * IF ATTRIBUTE EXISTS => ASSIGN THE VALUE, ELSE => ASSIGN NULL
     */
    if (attributes.find(attribute => attribute.getName() === attributeName)) {
      auxiliar = attributes.find(attribute => attribute.getName() === attributeName).getValue();
    } else {
      auxiliar = null;
    }

    /**
     * IF ATTRIBUTE MEANS A VERIFIED FIELD => CAST THE VALUE TO BOOLEAN, ELSE => ASSIGN IT AS STRING
     */
    if (attributeName.includes("verified")) {
      if (!auxiliar) {
        auxiliar = false;
      } else {
        auxiliar = (auxiliar == "true");
      }
    } else {
      if (!auxiliar) {
        auxiliar = "";
      }
    }

    return auxiliar;

  }

  validate() {
    this.phoneLength = this.phone.length;
    var reg = new RegExp("([0-9])");
    var re = new RegExp("([a-zA-Z-\s])");
    var test = re.test(this.phone)

    if ((this.phoneLength >= 10) && (this.phoneLength <= 14) && (reg.test(this.phone)) && (test == false)) {
      this.phoneNumberButtonHidden = false;
    } else {
      this.phoneNumberButtonHidden = true;
    }
  }

  back() {
    this.navCtrl.pop();
  }

  pageConfirmEmail() {
    // TO DO: SEND THE CONFIRMATION CODE VIA EMAIL.
    this.pageVerifyAccount("email", this.email);
  }

  pageConfirmPhone() {
    // TO DO : SEND THE CONFIRMATION CODE VIA PHONE NUMBER.
    this.pageVerifyAccount("phone_number", this.formatPhoneNumber(this.phone));
  }

  pageVerifyAccount(attributeName: string, attributeValue: string) {
    this.navCtrl.setRoot("VerifyAccountPage", { attributeName: attributeName, attributeValue: attributeValue }, { animate: true, direction: 'forward' });
  }

  pageChangeEmail() {
    // this.navCtrl.setRoot(ChangeEmailPage, {}, {animate: true, direction: 'forward'});
  }

  pageChangePassword() {
    this.navCtrl.push("ChangePasswordPage", {}, { animate: true, direction: 'forward' });
  }

  /**
   * Clean and format a phone number to a standard form.
   * @param phoneNumber Phone number.
   */
  private formatPhoneNumber(phoneNumber: string): string {
    if (phoneNumber) {
      phoneNumber = (phoneNumber as any).match(/\d/g).join("");
      if (phoneNumber.length === 10) {
        phoneNumber = "+1" + phoneNumber;
      }
      if (phoneNumber.length === 11) {
        phoneNumber = "+" + phoneNumber;
      }
    }
    return phoneNumber;
  }

  phoneFocusOut(data) {
    if (data != "911") {
      if (this.invalidPhoneData(data)) return;
      data = data.match(/\d/g);
      if (!data) return;
      data = data.join("");
      let len = data.length;
      let offset = data.length == 10 ? 0 : 1;
      data = this.insertIntoString(data, ' (', offset);
      data = this.insertIntoString(data, ') ', 5 + offset);
      data = this.insertIntoString(data, '-', 10 + offset);
      if (len == 11) data = this.insertIntoString(data, '+', 0);
    }
    this.phone = data;
  }

  phoneFocusIn(data) {
    if (this.invalidPhoneData(data)) return;
    var numb = data.match(/\d/g);
    if (!numb) return;
    numb = numb.join("");
    this.phone = numb;
  }

  insertIntoString(str, substr, idx) {
    let result = str.slice(0, idx) + substr + str.slice(idx);
    return result;
  }

  invalidPhoneData(data) {
    return data == null || !data || data == "" || data.length == 0 || !this.validEntry(data, 'phone');
  }

  /**
   * Validates the format of the entry.
   * @param entry Object to validate.
   * @param type Type of object to validate (name, phone, email).
   */
  public validEntry(entry: any, type: string): boolean {
    let valid: boolean;
    switch (type) {
      case "name": valid = this.validateName(entry); break;
      case "phone": valid = this.validatePhone(entry); break;
      case "email": valid = this.validateEmail(entry); break;
      default: valid = false; break;
    }
    return valid;
  }

  /**
   *
   * Validates that the entry is not null or empty and has at least two letters.
   * @param name First name or last name.
   */
  private validateName(name: string): boolean {
    return !this.isNullEmptyEntry(name) && name.length >= 2;
  }

  /**
   * Validates that the entry has a phone number format including space, dash, and parentheses.
   * @param phone Phone number of 10 or 11 digits including 911.
   */
  private validatePhone(phone: any): boolean {
    if (this.isNullEmptyEntry(phone)) return true;
    var numb = phone.match(/\d/g);
    if (!numb) return false;
    numb = numb.join("");
    if (numb.length == 10) return true;
    if (numb.length == 11 && numb[0] == '1') return true;
    if (phone === "911") return true;
    return false;
    // return phone == "911" || /^\s*(?:\+?(\d{1,1}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})?\s*$/.test(phone);
  }

  /**
   * Validates that the entry has an email format.
   * @param email Email format account@provider.domain (test@email.com).
   */
  private validateEmail(email: string): boolean {
    if (this.isNullEmptyEntry(email)) return true;
    return EmailFormatValid(email);
  }

  /**
   * Validates if the object is undefined, null, or empty.
   * @param entry Object to validate.
   */
  public isNullEmptyEntry(entry: any): boolean {
    return entry === undefined || entry === null || !entry || entry.length === 0;
  }

}
