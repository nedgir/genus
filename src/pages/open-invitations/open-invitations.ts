import { Component, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Event } from '../../models/event';
import { CognitoUtil } from "../../providers/auth/cognito.service";
import { EventProvider } from '../../providers/event/event';
import { EventListComponent } from '../../components/event-list/event-list';

@IonicPage()
@Component({
  selector: 'page-open-invitations',
  templateUrl: 'open-invitations.html',
})
export class OpenInvitationsPage implements OnInit {
  invitationType: string = 'assistance';
  allEvents = Array<Event>();
  @ViewChild(EventListComponent) eventList: EventListComponent;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public cognitoUtil: CognitoUtil,
    public eventProvider: EventProvider ){}

  ngOnInit() {
    this.eventList.refreshAllEvents();
  }

  changeInvitaitonType() {
    this.eventList.refreshAllEvents();
  }

  setUpEvents = () => {
    this.eventList.refreshAllEvents();
  }
}
