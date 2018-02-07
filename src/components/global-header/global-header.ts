import { Input, Component, OnInit } from '@angular/core';
import { App, NavController } from 'ionic-angular';
import { EventProvider } from '../../providers/event/event';
import { CognitoUtil } from "../../providers/auth/cognito.service";
import { SessionProvider } from '../../providers/session/session';
import { SyncServiceProvider } from '../../providers/sync-service/sync-service';
import { CommunityProvider } from '../../providers/community/community';

@Component({
  selector: 'global-header',
  templateUrl: 'global-header.html'
})

export class GlobalHeaderComponent implements OnInit {
  @Input('page') title;
  @Input('group') family;
  @Input('pop') pop;
  @Input('data') data;
  @Input('event') event;
  @Input('root') root;
  @Input('dashboard') dashboard;
  @Input('module_color') custom_module_color;
  selectedCommunity: string;
  communities: Array<any> = null;
  buttonClicked: boolean = false;

  constructor(
    public navCtrl: NavController,
    public cognitoUtil: CognitoUtil,
    public eventProvider: EventProvider,
    public sessionProvider: SessionProvider,
    public syncServiceProvider: SyncServiceProvider,
    private communityProvider: CommunityProvider,
    public appCtrl: App) {}

  ngOnInit() {}

  getGroupColor() {
    switch (this.family) {
      case 'community':
        return 'community-color';
      case 'health':
        return 'health-color';
      case 'moments':
        return 'moments-color';
      case 'other':
        return 'other-color';
      case 'emergency':
        return 'other-color';
      default:
        break;
    }
  }

  presentPopover(myEvent) {
    this.buttonClicked = !this.buttonClicked;
    this.setupCommunities();
  }

  async setupCommunities() {
    let user = this.sessionProvider.getUser();
    let communities = await this.eventProvider.getCommunities();

    let icons = new Map<string, any>();
    for(let i in communities) {
      icons.set(communities[i].guid, communities[i].icon);
    }

    let comms = Array<any>();
    for(let key in user.communities) {
      let icon = icons.get(key) ? icons.get(key) : 'assets/icon/logoCircle.png';
      comms.push({ guid: key, name: user.communities[key], icon: icon});
    }
    this.communities = comms;
  }

  isCurrentCommunity(community): string {
    return community.guid === this.sessionProvider.getCurrentCommunityId() ? '(current)' : '';
  }

  selectCommunity(community: any) {
    if (community && community.guid != this.sessionProvider.getCurrentCommunityId()) {
      this.buttonClicked = !this.buttonClicked;
      this.communityProvider.switchToNewCommunity(community.guid).then(() => {
        this.navCtrl.setRoot("DashboardPage");
      });
    }
  }

  joinAddCommunity() {
    this.appCtrl.getRootNav().push("JoinCreateCommunityPage", {}, { animate: true, direction: "forward" });
  }

  getCommunityNickName() {
    return this.sessionProvider.getCurrentCommunityName();
  }

  getCommunityIcon2(community) {
    if(community.icon) return community.icon;
    else return 'assets/icon/logoCircle.png';
  }

  getCommunityIcon() {
    let icon = this.sessionProvider.getCurrentCommunityIcon();
    if(icon) return icon;
    else return 'assets/icon/logoCircle.png';
  }

  goBack() {
    // TODO: Set target based on root page
    let target: any;
    switch (this.family) {
      case 'emergency':
        target = "EmergencyPage";
        break;
      default:
        target = "DashboardPage";
    }

    let currentPage = this.navCtrl.getActive();
    switch(this.title) {
      case 'INFORMATION':
        currentPage.instance.updateInformationAlert();
        break;
      case 'MAKE A SUGGESTION':
        currentPage.instance.makeSuggestionAlert();
        break;
      case 'NEW PHOTO':
        this.navCtrl.setRoot("MomentsPage", {}, { animate: true, direction: "back" })
        break;
      case 'MOMENTS':
      case 'CONTACT HISTORY':
        if(!this.navCtrl.canGoBack())
          this.navCtrl.setRoot("DashboardPage", {}, { animate: true, direction: "back" });
        else
          this.navCtrl.pop({ animate: true, direction: "back" });
        break;
      default:
        this.navCtrl.pop({ animate: true, direction: "back" });
    }
  }

  openPage() {
    let currentPage = this.navCtrl.getActive();
    switch(this.title) {
      case 'CONTACT HISTORY':
        currentPage.instance.addEventContactHistoryPage();
        break;
      case 'CALENDAR':
        currentPage.instance.addEventCalendarPage();
        break;
      case 'MEMBERS':
        this.navCtrl.push("InviteOthersPage", {}, { animate: true, direction: 'forward' });
        break;
      case 'MOMENTS':
        currentPage.instance.momentsActionSheet('globalHeader');
        break;
      case 'DASHBOARD':
        currentPage.instance.addCustomModulesAlert();
        break;
        case 'FAMILY HISTORY':
        this.navCtrl.push("AddFamilyhistoryPage", {}, { animate: true, direction: 'forward' });
        break;
        case 'EMERGENCY CONTACTS':
        this.navCtrl.push("AddEmergencycontactPage", {}, { animate: true, direction: 'forward' });
        break;
        case 'MEDICAL CONDITIONS':
        this.navCtrl.push("AddMedicalconditionPage", {}, { animate: true, direction: 'forward' });
        break;
        case 'SURGERIES':
        this.navCtrl.push("AddSurgeryPage", {}, { animate: true, direction: 'forward' });
        break;
        case 'ALLERGIES':
        this.navCtrl.push("AddAllergyPage", {}, { animate: true, direction: 'forward' });
        break;
        case 'MEDICAL DOCUMENTS':
        this.navCtrl.push("AddMedicaldocumentPage", {}, { animate: true, direction: 'forward' });
        break;
        case 'INSURANCE':
        this.navCtrl.push("AddInsurancePage", {}, { animate: true, direction: 'forward' });
        break;
        case 'MEDICAL DEVICES':
        this.navCtrl.push("AddMedicaldevicesPage", {}, { animate: true, direction: 'forward' });
        break;
      default:
        ;
    }
  }
}
