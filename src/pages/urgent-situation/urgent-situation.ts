import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading } from 'ionic-angular';
import { SessionProvider } from '../../providers/session/session';
import { EventProvider } from '../../providers/event/event';
import moment from 'moment';
import { UUID } from 'angular2-uuid';

@IonicPage()
@Component({
  selector: 'page-urgent-situation',
  templateUrl: 'urgent-situation.html',
})
export class UrgentSituationPage {
  public firstName: string;
  public title: string;
  public notes: string;
  public respond: boolean = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public sessionProvider: SessionProvider,
    public eventProvider: EventProvider,
    private loadingCtrl: LoadingController) {

    this.eventProvider.getCommunity().then((community) => {
      this.firstName = community.firstName;
    });

  }

  ionViewDidLoad() {}

  submit() {
    let loading: Loading = this.loadingCtrl.create({
      content: 'Inserting...',
    });
    loading.present();

    let obj = {
      reportedBy: this.sessionProvider.getUser().cognitoId,
      flags: this.eventProvider.eventProduceFlag(false, !this.respond, false, false),
      endDate: moment().format(),
      comments: [],
      communityId: this.sessionProvider.getCurrentCommunityId(),
      reportedByName: this.sessionProvider.getUser().name,
      ownerId: this.sessionProvider.getUser().cognitoId,
      ownerName: this.sessionProvider.getUser().name,
      lastUpdateTimestamp: null,
      guid: UUID.UUID().toUpperCase(),
      notes: this.notes,
      longitude: 0,
      people: [
        {
          flags: 1,
          name: this.sessionProvider.getUser().name,
          identifier: this.sessionProvider.getUser().cognitoId,
          addedDate: moment().format(),
          acceptedDate: moment().format()
        }
      ],
      startDate: moment().format(),
      latitude: 0,
      title: this.title,
      type: "emergency"
    }
    this.eventProvider.postEvent(obj).then(res =>{
      loading.dismiss();
      this.navCtrl.pop({ animate: true, direction: 'back' });
    });
  }
}
