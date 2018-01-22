import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Event } from '../../models/event';
import { EventProvider } from '../../providers/event/event';

@IonicPage()
@Component({
  selector: 'page-emergency-history',
  templateUrl: 'emergency-history.html',
})
export class EmergencyHistoryPage implements OnInit {
  allEvents = Array<Event>();;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public eventProvider: EventProvider) {
  }

  ngOnInit(){
    this.eventProvider.getEvents().then((events)=> {
      if (events != null) {
        this.allEvents = events;
      }
    });
  }

}
