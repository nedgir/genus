import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, LoadingController, Loading, NavParams, ActionSheetController, AlertController, Platform } from 'ionic-angular';
import { SessionProvider } from '../../providers/session/session';
import { EventProvider } from '../../providers/event/event';
import { Contacts } from '@ionic-native/contacts';
import { UUID } from 'angular2-uuid';

@IonicPage()
@Component({
  selector: 'page-invite-others',
  templateUrl: 'invite-others.html',
})
export class InviteOthersPage implements OnInit {
  private communityName;
  private is_mobile: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public sessionProvider: SessionProvider,
    public eventProvider: EventProvider,
    public actionSheetCtrl: ActionSheetController,
    private loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private contacts: Contacts,
    public plt: Platform) { }

  ngOnInit() {
    this.is_mobile = !this.plt.is('core') && this.plt.is('mobile');
    this.eventProvider.getCommunity().then((community) => {
      this.communityName = community.firstName + " " + community.lastName;
    });
  }

  cancel() {
    this.navCtrl.pop({ animate: true, direction: 'back' });
  }

  sendInviteRemote = async (name, toType, toAddress) => {
    let obj = {
      communityId: this.sessionProvider.getCurrentCommunityId(),
      guid: UUID.UUID().toUpperCase(),
      inviteCode: "REPLACEME",
      communityName: this.communityName,
      permissions: "member",
      fromId: this.sessionProvider.getUser().cognitoId,
      fromName: this.sessionProvider.getUser().name,
      to: null,
      toAddress: null,
      toType: null,
      flags: null,
      sentTime: 0,
      lastUpdateTimestamp: null
    };
    obj.to = name;
    obj.toAddress = toAddress;
    obj.toType = toType;
    return this.eventProvider.postInvitation(obj);
  }

  compare(a,b) {
    if (a.name < b.name)  return -1;
    if (a.name > b.name)  return 1;
    return 0;
  }

  sendInvites() {
    let buttons_array = [
      {
        text: 'By Email Address',
        handler: () => {
          this.presentEmailPrompt();
        }
      },
      {
        text: 'By Phone Number',
        handler: () => {
          this.presentPhonePrompt();
        }
      }
    ];

    if(this.is_mobile) {
      buttons_array.unshift(
        {
          text: 'Email from Contacts',
          handler: () => {
            this.contacts.find(["displayName"], {multiple: true}).then((contacts)=>{
              let count = 0;
              let found_contacts = [];
              contacts.forEach(person => {
                if(person.displayName && person.emails){
                  found_contacts.push({name: person.displayName, email: person.emails[0].value, checked: false});
                  count++;
                }
              });
              this.presentContacts(found_contacts.sort(this.compare));
            }).catch((error)=>{
              alert("Error Contacts" + error);
            });
          }
        },
        {
          text: 'SMS from Contacts',
          handler: () => {
            this.contacts.find(["displayName"], {multiple: true}).then((contacts)=>{
              let count = 0;
              let found_contacts = [];
              contacts.forEach(person => {
                if(person.displayName && person.phoneNumbers){
                  found_contacts.push({name: person.displayName, phone: person.phoneNumbers[0].value, checked: false});
                  count++;
                }
              });
              this.presentContacts(found_contacts.sort(this.compare));
            }).catch((error)=>{
              alert("Error Contacts" + error);
            });
          }
        }
      );
    }

    let actionSheet = this.actionSheetCtrl.create({
      title: 'How would you like to invite them?',
      buttons: buttons_array
    });
    actionSheet.present();
  }

  presentContacts(contacts) {
    this.navCtrl.push("DeviceContactsPage", { contacts: contacts, sendCallBack: this.sendInviteRemote })
  }

  presentEmailPrompt() {
    let alert = this.alertCtrl.create({
      title: 'Enter Email Address',
      message: 'Enter the email address of the person you\'d like to invite.',
      inputs: [
        {
          name: 'name',
          placeholder: 'Name',
          type: 'text'
        },
        {
          name: 'email',
          placeholder: 'Email',
          type: 'email'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Invite',
          handler: data => {
            let loading = this.showLoading('Sending Invites...');
            this.sendInviteRemote(data.name, 'email', data.email).then(()=>{
              loading.dismiss();
              this.presentInviteSent();
            });
          }
        }
      ]
    });
    alert.present();
  }

  presentPhonePrompt() {
    let alert = this.alertCtrl.create({
      title: 'Enter Phone Number',
      message: 'Enter the phone number of the person you\'d like to invite.',
      inputs: [
        {
          name: 'name',
          placeholder: 'Name',
          type: 'text'
        },
        {
          name: 'phone',
          placeholder: 'Phone',
          type: 'tel'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {}
        },
        {
          text: 'Invite',
          handler: data => {
            let loading = this.showLoading('Sending Invites...');
            this.sendInviteRemote(data.name, 'sms', '1' + data.phone).then(()=>{
              loading.dismiss();
              this.presentInviteSent();
            });
          }
        }
      ]
    });
    alert.present();
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

}
