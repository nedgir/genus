import { Component,OnInit } from '@angular/core';
import { IonicPage, NavController, ActionSheetController, Platform } from 'ionic-angular';
import { SessionProvider } from '../../providers/session/session';
import { EventProvider } from '../../providers/event/event';
import { CallNumber } from '@ionic-native/call-number';
import { Community } from '../../models/community';

@IonicPage()
@Component({
  selector: 'page-emergency',
  templateUrl: 'emergency.html',
})
export class EmergencyPage implements OnInit {
  historyPage;
  private communityName: string;
  private is_mobile: boolean;
  communityInformation: Community;

  constructor(public navCtrl: NavController,
    public actionsheetCtrl: ActionSheetController,
    public sessionProvider: SessionProvider,
    public eventProvider: EventProvider,
    public plt: Platform,
    public callNumber: CallNumber) {
      this.is_mobile = !this.plt.is('ipad') && !this.plt.is('tablet') && !this.plt.is('core') && this.plt.is('mobile');
      this.communityInformation = new Community();
  }

  ngOnInit(){
    this.historyPage = "EmergencyHistoryPage";
    this.eventProvider.getCommunity().then((communityInformation: Community) => {
      this.communityInformation = communityInformation;
    });
  }

  emergency() {
    this.communityName = this.sessionProvider.getCurrentCommunityName();
    let button_array = [];
    if(this.communityInformation.emergencyNumber){
      button_array.push({
        text: 'Call ' + this.communityInformation.emergencyNumber,
        cssClass: 'red-text',
        handler: () => {
          this.callNumber.callNumber(this.communityInformation.emergencyNumber, true)
            .then(() => console.log('Launched dialer!'))
            .catch(() => console.log('Error launching dialer'));
        }
      });
    }
    button_array.push({
      text: 'Dial 911',
      handler: () => {
        this.callNumber.callNumber("911", true)
          .then(() => console.log('Launched dialer!'))
          .catch(() => console.log('Error launching dialer'));
      }
    });
    button_array.push({
      text: 'Cancel',
      role: 'cancel',
      handler: () => {}
    });
    let actionSheet = this.actionsheetCtrl.create({
      title: 'ATTENTION!',
      subTitle: 'The number below will contact local emergency services for ' + this.communityName,
      buttons: button_array
    });
    actionSheet.present();
  }

  notify() {
    this.navCtrl.push("UrgentSituationPage", {}, { animate: true, direction: 'forward' });
  }
  ionViewDidLoad() {}

}
