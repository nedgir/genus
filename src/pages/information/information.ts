import { Component, OnInit } from '@angular/core';
import { IonicPage, AlertController, NavController, ActionSheetController, Platform } from 'ionic-angular';
import { Community } from '../../models/community';
import { EventProvider } from '../../providers/event/event';
import { CameraProvider } from '../../providers/camera/camera';

@IonicPage()
@Component({
  selector: 'page-information',
  templateUrl: 'information.html',
})
export class InformationPage implements OnInit {
  private is_mobile: boolean;
  private commInfoViewModel: Community = new Community();;
  formHasChanged: boolean = false;

  constructor(
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public eventProvider: EventProvider,
    public cameraProvider: CameraProvider,
    public actionsheetCtrl: ActionSheetController,
    public plt: Platform) {}

  ngOnInit() {
    this.is_mobile = !this.plt.is('core') && this.plt.is('mobile');
    this.eventProvider.getCommunity().then((community) => {
      this.commInfoViewModel = community;
    });
  }

  async updateInformation() {
    let changedField = {
      firstName: this.commInfoViewModel.firstName,
      lastName: this.commInfoViewModel.lastName,
      phone: this.commInfoViewModel.phone,
      email: this.commInfoViewModel.email,
      emergencyNumber: this.commInfoViewModel.emergencyNumber
    };
    await this.eventProvider.putCommunity(this.commInfoViewModel, changedField);
    this.navCtrl.pop({ animate: true, direction: "back" });
  }

  updateInformationAlert() {
    if (this.madeChanges()) {
      let alert = this.alertCtrl.create({
        title: 'Save Changes?',
        subTitle: 'Would you like to save your changes before exiting?',
        cssClass: "confirm-update-actions",
        enableBackdropDismiss: false,
        buttons: [
          {
            text: 'Yes',
            cssClass: 'btn-yes',
            handler: () => {
              this.updateInformation();
            }
          },
          {
            text: 'No',
            cssClass: 'btn-no',
            handler: () => {
              this.navCtrl.pop({ animate: true, direction: "back" });
            }
          },
          {
            text: 'Continue Editing',
            handler: () => {
            }
          }
        ]
      });
      alert.present();
    }
    else {
      this.navCtrl.pop({ animate: true, direction: "back" });
    }
  }

  public onChange(){
    this.formHasChanged = true;
  }

  public isNullEmptyEntry(entry: any): boolean {
    return entry === undefined || entry === null || !entry || entry.length === 0;
  }

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

  private validateName(name: string): boolean {
    return !this.isNullEmptyEntry(name) && name.length >= 2;
  }

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

  private validateEmail(email: string): boolean {
    if (this.isNullEmptyEntry(email)) return true;
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
  }

  public madeChanges(): boolean {
    return this.formHasChanged;
  }

  allValidEntries() {
    return this.validEntry(this.commInfoViewModel.firstName, 'name')
      && this.validEntry(this.commInfoViewModel.lastName, 'name')
      && this.validEntry(this.commInfoViewModel.phone, 'phone')
      && this.validEntry(this.commInfoViewModel.email, 'email');
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
    this.commInfoViewModel.phone = data;
  }
  phoneFocusIn(data) {
    if (this.invalidPhoneData(data)) return;
    var numb = data.match(/\d/g);
    if (!numb) return;
    numb = numb.join("");
    this.commInfoViewModel.phone = numb;
  }
  insertIntoString(str, substr, idx) {
    let result = str.slice(0, idx) + substr + str.slice(idx);
    return result;
  }
  invalidPhoneData(data) {
    return data == null || !data || data == "" || data.length == 0 || !this.validEntry(data, 'phone');
  }

  changeImage() {
    let actionSheet = this.actionsheetCtrl.create({
    title: 'Change Image',
      buttons: [{
          text: 'Take a Picture',
          handler: () => {this.uploadPhoto('Camera')}
        },{
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
     await this.eventProvider.uploadCommunityImageS3(imageData, null);
  }

}
