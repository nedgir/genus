import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SyncServiceProvider } from '../../providers/sync-service/sync-service';
import { SessionProvider } from '../../providers/session/session';
import { DataServiceProvider } from '../../providers/data-service/data-service';

@IonicPage()
@Component({
  selector: 'page-members',
  templateUrl: 'members.html',
})
export class MembersPage {
  private members;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public dataServiceProvider: DataServiceProvider,
    public syncServiceProvider: SyncServiceProvider,
    public sessionProvider: SessionProvider) {}

  ngOnInit() {
    this.setUpMembers();
  }

  async setUpMembers() {
    let membersKey = 'Members_' + this.sessionProvider.getCurrentCommunityId();
    this.members = await this.dataServiceProvider.getDocumentsByKey(membersKey);
    if (!this.members.length || this.syncServiceProvider.needsToSync(membersKey)) {
      this.members = await this.syncServiceProvider.syncLocal(membersKey);
    }
    this.sortMembers();
  }

  sortMembers() {
    this.members.sort((a, b) => {
      if (a.permission === 'owner') return -1;
      if (b.permission === 'owner') return 1;
      return a.name.toUpperCase() < b.name.toUpperCase() ? -1 : 1;
    });
  }

  fallbackImage(event) {
    event.target.src = 'assets/icon/logoCircle.png';
  }
}
