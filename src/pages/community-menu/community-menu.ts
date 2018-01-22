import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-community-menu',
  templateUrl: 'community-menu.html',
})
export class CommunityMenuPage implements OnInit {
  openInvitations: boolean = false;
  pages: Array<{title: string, component: any, image: string}>;
  constructor(public navCtrl: NavController,
  public navParams: NavParams) {}

  ngOnInit() {
    this.pages = [
      { title: 'Contact History', component: "ContactHistoryPage", image: 'assets/LastInTouch.svg'},
      { title: 'Open Invitations', component: "OpenInvitationsPage", image: 'assets/OpenInvitations.svg'},
      { title: 'Calendar', component: "CalendarPage", image: 'assets/Calendar.svg'},
      { title: 'Chat', component: "ChatPage", image: 'assets/Chat.svg'},
      { title: 'Members', component: "MembersPage", image: 'assets/Members.svg'},
      { title: 'Information', component: "InformationPage", image: 'assets/Information.svg'},
    ];
    this.openInvitations = this.navParams.get('haveInvitations');
  }

  navToPage(page) {
    this.navCtrl.push(page.component, { haveEvents: this.navParams.get('haveEvents')  }, {animate: true, direction: 'forward'});
  }

  showHidePage(page) {
    return page.component != 'OpenInvitationsPage' || this.openInvitations;
  }
}
