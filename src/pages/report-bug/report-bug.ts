import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController } from 'ionic-angular';
import { EventProvider } from '../../providers/event/event';
import { SessionProvider } from '../../providers/session/session';
import moment from 'moment';
import { UUID } from 'angular2-uuid';

@IonicPage()
@Component({
  selector: 'page-report-bug',
  templateUrl: 'report-bug.html',
})
export class ReportBugPage {
  private bug: string = "";
  private hearBack: boolean = false;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public eventProvider: EventProvider,
    public sessionProvider: SessionProvider) {}

  save() {
    let data = {
      guid: UUID.UUID().toUpperCase(),
      date: moment().format(),
      type: 'bug',
      reportedBy: this.sessionProvider.getUser().cognitoId,
      reportedByName: this.sessionProvider.getUser().name,
      reportedByEmail: this.sessionProvider.getUser().email,
      body: this.bug,
      respond: this.hearBack,
    };
    this.eventProvider.postFeedback(data).then(()=>{
      this.navCtrl.pop();
    });
  }

  reportBugAlert() {
    if(this.bug.length){
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
              this.save();
            }
          },
          {
            text: 'No',
            cssClass: 'btn-no',
            handler: () => {
              this.navCtrl.pop();
            }
          },
          {
            text: 'Continue Editing',
            handler: () => {}
          }
        ]
      });
      alert.present();
    }else {
      this.navCtrl.pop();
    }
  }

  ionViewDidLoad() {}

}
