import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, Events, NavParams } from 'ionic-angular';
import { SessionProvider } from '../../providers/session/session';
import { EventProvider } from '../../providers/event/event';

@IonicPage()
@Component({
  selector: 'page-add-invitees',
  templateUrl: 'add-invitees.html',
})
export class AddInviteesPage implements OnInit {
  private peopleArray;
  selectedMap: Map<string, boolean> = new Map<string, boolean>();

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    public eventProvider: EventProvider,
    public sessionProvider: SessionProvider) { }

  ngOnInit() {
    this.peopleArray = this.navParams.get('people');
    this.peopleArray.forEach(person => {
      this.selectedMap.set(person.identifier, person.status);
    });
  }

  toggleSelected(person) {
    let status = this.selectedMap.get(person.identifier) ? false : true;
    this.selectedMap.set(person.identifier, status);
  }

  updatePersonStatus () {
    this.peopleArray.forEach(person => {
      person.status = this.selectedMap.get(person.identifier);
    });
  }

  save() {
    this.updatePersonStatus();
    this.navCtrl.pop();
  }

}
