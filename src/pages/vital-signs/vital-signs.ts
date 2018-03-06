import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the VitalSignsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-vital-signs',
  templateUrl: 'vital-signs.html',
})
export class VitalSignsPage implements OnInit {
  openInvitations: boolean = false;
  pages: Array<{title: string, component: any, image: string, count:string ,date:string}>;
  constructor(public navCtrl: NavController,
  public navParams: NavParams) {}

  ngOnInit() {
    this.pages = [
      { title: 'Heart Rate', component: "MedicalProfilePage", image: 'assets/Vitals_Icons/HeartRateIcon.svg',count:'8' , date:'1/2/24/4:33pm'},
      { title: 'Blood Pressure', component: "OpenInvitationsPage", image: 'assets/Vitals_Icons/BP.svg',count:'2' , date:'1/2/24/4:33pm'},
      { title: 'Glucose Level', component: "CalendarPage", image: 'assets/Vitals_Icons/Glucose.svg',count:'3' , date:'1/2/24/4:33pm'},
      { title: 'Oxygen Level', component: "ChatPage", image: 'assets/Vitals_Icons/PulseO2.svg',count:'6' , date:'1/2/24/4:33pm'},
      { title: 'Respiratory Rate', component: "MembersPage", image: 'assets/Vitals_Icons/Respiratory.svg',count:'8' , date:'1/2/24/4:33pm'},
      { title: 'Body Temperature', component: "InformationPage", image: 'assets/Vitals_Icons/Temperature.svg',count:'9' , date:'1/2/24/4:33pm'},
      { title: 'Sleep Patt', component: "InformationPage", image: 'assets/Vitals_Icons/Sleep.svg',count:'8' , date:'1/2/24/4:33pm'},
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
