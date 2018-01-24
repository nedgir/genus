import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the HealthMenuPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-health-menu',
  templateUrl: 'health-menu.html',
})
export class HealthMenuPage implements OnInit {
  openInvitations: boolean = false;
  pages: Array<{title: string, component: any, image: string, count:string ,date:string}>;
  constructor(public navCtrl: NavController,
  public navParams: NavParams) {}

  ngOnInit() {
    this.pages = [
      { title: 'Medical Profile', component: "MedicalProfilePage", image: 'assets/LandingPage_Icons/MedicalProfile.svg',count:'22%' , date:'1/2/24/4:33pm'},
      { title: 'Care Report', component: "OpenInvitationsPage", image: 'assets/LandingPage_Icons/CareReport.svg',count:'2' , date:'1/2/24/4:33pm'},
      { title: 'Vital Signs', component: "CalendarPage", image: 'assets/LandingPage_Icons/VitalSigns.svg',count:'3' , date:'1/2/24/4:33pm'},
      { title: 'Observations', component: "ChatPage", image: 'assets/LandingPage_Icons/Observations.svg',count:'6' , date:'1/2/24/4:33pm'},
      { title: 'Medications', component: "MembersPage", image: 'assets/LandingPage_Icons/Medications.svg',count:'8' , date:'1/2/24/4:33pm'},
      { title: 'Physicians', component: "InformationPage", image: 'assets/LandingPage_Icons/Physicians.svg',count:'9' , date:'1/2/24/4:33pm'},
      { title: 'Medical Visits', component: "InformationPage", image: 'assets/LandingPage_Icons/MedicalVisits.svg',count:'8' , date:'1/2/24/4:33pm'},
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
