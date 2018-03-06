import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the EmergencyContactPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-emergency-contact',
  templateUrl: 'emergency-contact.html',
})
export class EmergencyContactPage {
  pages: Array<{name: string, component: any, image: string, count:string ,contact:string}>;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.pages = [
      { name: 'John Smith', component: "MedicalProfilePage", image: 'assets/LandingPage_Icons/MedicalProfile.svg',count:'22%' , contact:'(040)234-7474'},
      { name: 'Peter Henriks', component: "OpenInvitationsPage", image: 'assets/LandingPage_Icons/CareReport.svg',count:'2' , contact:'(090)234-8474'},
      // { title: 'Vital Signs', component: "CalendarPage", image: 'assets/LandingPage_Icons/VitalSigns.svg',count:'3' , date:'1/2/24/4:33pm'},
      // { title: 'Observations', component: "ChatPage", image: 'assets/LandingPage_Icons/Observations.svg',count:'6' , date:'1/2/24/4:33pm'},
      // { title: 'Medications', component: "MembersPage", image: 'assets/LandingPage_Icons/Medications.svg',count:'8' , date:'1/2/24/4:33pm'},
      // { title: 'Physicians', component: "InformationPage", image: 'assets/LandingPage_Icons/Physicians.svg',count:'9' , date:'1/2/24/4:33pm'},
      // { title: 'Medical Visits', component: "InformationPage", image: 'assets/LandingPage_Icons/MedicalVisits.svg',count:'8' , date:'1/2/24/4:33pm'},
    ];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EmergencyContactPage');
  }

}
