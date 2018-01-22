import { OnInit, Component } from '@angular/core';
import { IonicPage, AlertController, LoadingController, Loading, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-device-contacts',
  templateUrl: 'device-contacts.html',
})
export class DeviceContactsPage implements OnInit {
  contacts: any;
  sendInvite: any; //function
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.initializeContacts();
    this.sendInvite = this.navParams.get('sendCallBack');
  }

  back() {
    this.navCtrl.pop();
  }

  initializeContacts() {
    this.contacts = this.navParams.get('contacts');
  }

  search(ev) {
    this.initializeContacts();
    let val = ev.target.value;
    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.contacts = this.contacts.filter((item) => {
        return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  submit() {
    let loading = this.showLoading('Sending Invites...');
    try {
      this.contacts.forEach(contact => {
        if (contact.checked) {
          if (contact.email) this.sendInvite(contact.name, 'email', contact.email);
          else if (contact.phone) this.sendInvite(contact.name, 'sms', '1' + contact.phone.replace(/\D/g, ''));
        }
      });
      loading.dismiss();
      this.presentInviteSent();
    } catch (error) {
      console.log("Error occurred:", error);
    }

  }

  showLoading(loadingText) {
    let loading: Loading = this.loadingCtrl.create({
      content: loadingText,
    });
    loading.present();
    return loading;
  }

  presentInviteSent() {
    let alert = this.alertCtrl.create({
      title: 'Invite Sent',
      subTitle: 'Your invite was successfully sent.',
      buttons: [{
        text: 'OK',
        handler: data => {
          this.navCtrl.setRoot("DashboardPage", {});
        }
      }]
    });
    alert.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DeviceContactsPage');
  }

}
