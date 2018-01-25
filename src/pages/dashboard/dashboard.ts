import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { SessionProvider } from '../../providers/session/session';
import { EventProvider } from '../../providers/event/event';
import { MomentsProvider } from '../../providers/moments/moments';
import { CommunityProvider } from '../../providers/community/community';
import { ResourceProvider } from '../../providers/resource/resource';
import { ScrollableTabsComponent } from '../../components/scrollable-tabs/scrollable-tabs';
import moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage implements OnInit {
  community_pages: any;
  community_last_contact: any;
  community_open_invitations: any;
  moments_last_photo: any;
  moments_photos: any;
  openInvitations: boolean = false;
  resources_module: any = [];
  tabsColor: string = "secondary";
  tabsMode: string = "md";
  tabsPlacement: string = "top";

  tabToShow: Array<boolean> = [true, true, true, true, true, true, true, true, true];
  scrollableTabsopts: any = {}
  public haveEvents: boolean;
  public haveMoments: boolean;
  healthList: Array<{title: string, component: any, image: string, count:string ,date:string}>;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public eventProvider: EventProvider,
    public momentProvider: MomentsProvider,
    public sessionProvider: SessionProvider,
    public communityProvider: CommunityProvider,
    public resourceProvider: ResourceProvider,
    public alertCtrl: AlertController
  ) {
    this.setLocale();
    this.healthList = [
      { title: 'Medical Profile', component: "MedicalProfilePage", image: 'assets/LandingPage_Icons/MedicalProfile.svg',count:'22%' , date:'1/2/24/4:33pm'},
      { title: 'Care Report', component: "OpenInvitationsPage", image: 'assets/LandingPage_Icons/CareReport.svg',count:'2' , date:'1/2/24/4:33pm'},
      { title: 'Vital Signs', component: "CalendarPage", image: 'assets/LandingPage_Icons/VitalSigns.svg',count:'3' , date:'1/2/24/4:33pm'},
      // { title: 'Observations', component: "ChatPage", image: 'assets/LandingPage_Icons/Observations.svg',count:'6' , date:'1/2/24/4:33pm'},
      { title: 'Medications', component: "MembersPage", image: 'assets/LandingPage_Icons/Medications.svg',count:'8' , date:'1/2/24/4:33pm'},
      { title: 'Physicians', component: "InformationPage", image: 'assets/LandingPage_Icons/Physicians.svg',count:'9' , date:'1/2/24/4:33pm'},
      { title: 'Medical Visits', component: "InformationPage", image: 'assets/LandingPage_Icons/MedicalVisits.svg',count:'8' , date:'1/2/24/4:33pm'},
    ];
  }

  ngOnInit() {
    this.initializeCells();
    this.startPage();
  }

  doRefresh(refresher) {
    Promise.all(  this.startPage(true)  ).then(() => {
      refresher.complete()
    });
  }

  startPage(forceSync?: boolean) {
    return [
      this.updateMomentsModule(forceSync),
      this.updateCommunityModule(forceSync),
      this.communityProvider.updateAllUserComunties(),
      this.setUpResources()];
  }

  async updateMomentsModule(forceSync) {
    await this.communityProvider.updateMomentsModule(forceSync);
    let moments = await this.momentProvider.getMoments();
    this.haveMoments = moments.length > 0;
    this.calculateMoments(moments);
  }

  async updateCommunityModule(forceSync) {
    await this.communityProvider.updateCommunityModule(forceSync);
    let events = await this.eventProvider.getEvents(true);
    this.haveEvents = events.length > 0;
    this.calculateLastInTouch(events);
  }

  async setUpResources() {
    let community = await this.eventProvider.getCommunity();
    let { resources: array } = JSON.parse(community.resourcesJSON);
    this.resources_module = [];
    for(let item of array) {
      this.resources_module.push(await this.resourceProvider.getResourcesById(item.identifier));
    }
  }

  calculateMoments(moments) {
    let [me_moments, others_moments] = [0, 0];
    let [me_last_photo, others_last_photo] = ['', ''];
    let my_cognitoId = this.sessionProvider.getUser().cognitoId;
    for(let moment of moments) {
      if(moment.creatorId === my_cognitoId) {
        me_moments++;
        if(!me_last_photo) me_last_photo = moment.createdDate;
      } else {
        others_moments++;
        if(!others_last_photo) others_last_photo = moment.createdDate;
      }
    }
    this.moments_photos['left']['number'] = others_moments;
    this.moments_photos['right']['number'] = me_moments;
    if(others_last_photo) {
      [this.moments_last_photo['left']['number'], this.moments_last_photo['left']['unit']] = this.displayReadableTime(others_last_photo);
    }

    if(me_last_photo) {
      [this.moments_last_photo['right']['number'], this.moments_last_photo['right']['unit']] = this.displayReadableTime(me_last_photo);
    }
  }

  calculateLastInTouch(events) {
    let [assistance_count, rsvp_count] = [0, 0];
    let [me_last_contact, others_last_contact] = ['', ''];
    let my_cognitoId = this.sessionProvider.getUser().cognitoId;
    for (let event of events) {
      if(this.checkAssistance(event)) assistance_count++;
      if(this.checkRSVP(event)) rsvp_count++;
      if(moment(event.startDate).isAfter(moment()) || this.callNotConnected(event) || (me_last_contact && others_last_contact)) continue;
      if( event.reportedBy === my_cognitoId || this.userInEvent(event, my_cognitoId) ) {
        if(!me_last_contact) me_last_contact = event.startDate;
      }

      if(event.reportedBy != my_cognitoId || event.ownerId != my_cognitoId) {
        if(!others_last_contact) others_last_contact = event.startDate;
      }
    }
    this.openInvitations = Boolean(assistance_count || rsvp_count);
    this.community_open_invitations['left']['number'] = assistance_count;
    this.community_open_invitations['right']['number'] = rsvp_count;
    if(others_last_contact) {
      [this.community_last_contact['left']['number'], this.community_last_contact['left']['unit']] = this.displayReadableTime(others_last_contact);
      this.community_last_contact['left']['alert'] = this.alertLastContact(others_last_contact);
    }
    if(me_last_contact) {
      [this.community_last_contact['right']['number'], this.community_last_contact['right']['unit']] = this.displayReadableTime(me_last_contact);
      this.community_last_contact['right']['alert'] = this.alertLastContact(me_last_contact);
    }
  }

  alertLastContact(time) {
    return moment().diff(moment(time), 'days', true) > 3;
  }

  userInEvent(event, userId) {
    let userIsPresent = false;
    for(let person of event.people) {
      if( person.identifier === userId ) {
        userIsPresent = true;
        break;
      }
    }
    return userIsPresent;
  }

  checkRSVP = (event) =>{
    let rsvp = false;
    if(event.people) {
      event.people.forEach(person => {
        if(person.identifier == this.sessionProvider.getUser().cognitoId && person.flags == 0) rsvp = true;
      });
    }
    return rsvp;
  }

  checkAssistance = (event) => {
    return (parseInt(event.flags) >> 1) & 1;
  }

  callNotConnected(event) {
    return event.type === 'call' && !this.eventProvider.eventFlagCallConnected(event);
  }

  navToPage(pageComponent, data?) {
    switch(pageComponent) {
      case 'ContactHistoryPage':
        this.navCtrl.push(pageComponent, {  haveEvents: this.haveEvents  }, {  animate: true, direction: 'forward' });
        break;
      case 'CommunityMenuPage':
        this.navCtrl.push(pageComponent, {  haveInvitations: this.openInvitations, haveEvents: true  }, {  animate: true, direction: 'forward' });
        break;
      case 'MomentsPage':
        this.navCtrl.push(pageComponent, {  haveMoments: this.haveMoments  }, { animate: true, direction: 'forward' });
        break;
      case 'ResourcesPage':
        this.navCtrl.push(pageComponent, { data: data, module_name: data.name, module_color: data.color }, {  animate: true, direction: 'forward' });
        break;
      default:
        this.navCtrl.push(pageComponent, {}, {animate: true, direction: 'forward'});
    }
  }

  displayReadableTime(time) {
    return moment(time).fromNow(true).split(" ");
  }

  addCustomModulesAlert() {
    let alert = this.alertCtrl.create({
      title: 'Enter Module Code',
      subTitle: 'To add a new module to this community, enter it\'s short code:',
      inputs: [
        {
          name: 'moduleCode',
          placeholder: 'Module Short Code',
          type: 'text'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {}
        },
        {
          text: 'Add',
          handler: data => {
            if(data.moduleCode) {
              this.resourceProvider.addCustomModule(data.moduleCode).then(result => {
                result && this.resources_module.push(result);
              });
            }
          }
        }
      ]
    });
    alert.present();
  }

  initializeCells() {
    this.community_pages = [
      { title: 'Calendar', component: "CalendarPage", image: 'assets/Calendar.svg'},
      { title: 'Chat', component: "ChatPage", image: 'assets/Chat.svg'},
      { title: 'Members', component: "MembersPage", image: 'assets/Members.svg'},
      { title: 'Information', component: "InformationPage", image: 'assets/Information.svg'}
    ];

    this.community_last_contact = {
      title: 'Last Contact',
      left: {
        title: 'OTHERS',
        number: '--',
        unit: '',
        alert: false
      },
      right: {
        title: 'ME',
        number: '--',
        unit: '',
        alert: false
      }
    };

    this.community_open_invitations = {
      title: 'Open Invitations',
      left: {
        title: 'ASSISTANCE',
        number: '--',
      },
      right: {
        title: 'RSVP',
        number: '--',
      }
    };

    this.moments_last_photo = {
      title: 'Last Photo',
      left: {
        title: 'OTHERS',
        number: '--',
        unit: ''
      },
      right: {
        title: 'ME',
        number: '--',
        unit: ''
      }
    };

    this.moments_photos = {
      title: 'Photos',
      left: {
        title: 'OTHERS',
        number: '--',
      },
      right: {
        title: 'ME',
        number: '--',
      }
    };
  }

  setLocale() {
    moment.updateLocale('en', {
      relativeTime : {
          future: "in %s",
          past:   "%s ago",
          s  : "1 sec",
          ss : "%d sec",
          m:  "1 min",
          mm: "%d mins",
          h:  "1 hr",
          hh: "%d hrs",
          d:  "1 day",
          dd: (number) => {
            if (number < 7) {
              return `${number} days`;
            } else {
              let num_week = Math.floor(number / 7);
              return num_week > 1 ? `${num_week} weeks` : '1 week';
            }
          },
          M:  "1 month",
          MM: "%d months",
          y:  "1 year",
          yy: "%d years"
      }
    });
    moment.relativeTimeRounding(Math.floor);
  }
}
