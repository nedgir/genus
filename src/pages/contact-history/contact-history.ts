import { ViewChild, Component, OnInit } from '@angular/core';
import { IonicPage, Content, NavController, NavParams, ActionSheetController, Platform } from 'ionic-angular';
import { EventProvider } from '../../providers/event/event';
import { SessionProvider } from '../../providers/session/session';
import { CallNumber } from '@ionic-native/call-number';
import { EventListInfiniteComponent } from '../../components/event-list-infinite/event-list-infinite';
import { ChartComponent } from '../../components/chart/chart';

@IonicPage()
@Component({
  selector: 'page-contact-history',
  templateUrl: 'contact-history.html',
})
export class ContactHistoryPage implements OnInit {
  private haveEvents: boolean;
  private is_mobile: boolean;
  @ViewChild(Content) content: Content;
  @ViewChild(ChartComponent) chart: ChartComponent;
  @ViewChild(EventListInfiniteComponent) eventListInfinite : EventListInfiniteComponent;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public eventProvider: EventProvider,
    public sessionProvider: SessionProvider,
    public actionSheetCtrl: ActionSheetController,
    public callNumber: CallNumber,
    public plt: Platform) { }

  ngOnInit() {
    this.is_mobile = !this.plt.is('ipad') && !this.plt.is('tablet') && !this.plt.is('core') && this.plt.is('mobile');
    this.haveEvents = this.navParams.get('haveEvents');
  }

  refreshEvents = async () => {
    await this.eventListInfinite.refreshEvents();
    await this.chart.setUpEvents();
  }

  async addEventContactHistoryPage() {
    let currentCommunity = await this.eventProvider.getCommunity();
    if (currentCommunity.phone) this.lastInTouchActionSheet(currentCommunity.phone);
    else{
      this.navCtrl.push("EventDetailPage", { eventType: "CALL", refreshEventsCallback: this.refreshEvents }, { animate: true, direction: 'forward' });
    }
  }

  async lastInTouchActionSheet(communityPhone) {
    let buttons_array = [
      {
        text: 'Log a Call or Visit',
        handler: () => {
          this.navCtrl.push("EventDetailPage", { eventType: "CALL", refreshEventsCallback: this.refreshEvents }, { animate: true, direction: 'forward' });
        }
      },
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => { }
      }
    ];

    if(this.is_mobile) {
      buttons_array.unshift({
        text: 'Call ' + this.sessionProvider.getCurrentCommunityName(),
        handler: () => {
          this.callNumber.callNumber(communityPhone, true)
            .then(() => console.log('Launched dialer!'))
            .catch(() => console.log('Error launching dialer'));
        }
      });
    }

    let actionSheet = this.actionSheetCtrl.create({
      title: this.is_mobile ? 'Call or share an experience with your community' : 'Share an experience with your community',
      buttons: buttons_array
    });
    actionSheet.present();
  }
}
