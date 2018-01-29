import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the MedicalProfilePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-medical-profile',
  templateUrl: 'medical-profile.html',
})
export class MedicalProfilePage implements OnInit {
  openInvitations: boolean = false;
  pages: Array<{title: string, component: any, image: string , count:string ,date:string}>;
  constructor(public navCtrl: NavController,
  public navParams: NavParams) {}

  ngOnInit() {
    this.pages = [
      { title: 'About POC', component: "AboutPocPage", image: 'assets/MedicalProfile_Icons/AboutPOC.svg',count:'1' , date:'1/2/24/4:33pm'},
      { title: 'Emergency Contact', component: "EmergencyContactPage", image: 'assets/MedicalProfile_Icons/EmergencyContact.svg',count:'3' , date:'1/2/24/4:33pm'},
      { title: 'Medical Conditions', component: "CalendarPage", image: 'assets/MedicalProfile_Icons/MedicalConditions.svg',count:'7' , date:'1/2/24/4:33pm'},
      { title: 'Surgeries', component: "ChatPage", image: 'assets/MedicalProfile_Icons/Surgeries.svg',count:'3' , date:'1/2/24/4:33pm'},
      { title: 'Allergies', component: "AllergiesPage", image: 'assets/MedicalProfile_Icons/Allergies.svg',count:'5' , date:'1/2/24/4:33pm'},
      { title: 'Medical Documents', component: "MedicalDocumentsPage", image: 'assets/MedicalProfile_Icons/MedicalDocuments.svg',count:'4' , date:'1/2/24/4:33pm'},
      { title: 'Insurance', component: "InsurancePage", image: 'assets/MedicalProfile_Icons/Insurance.svg',count:'3' , date:'1/2/24/4:33pm'},
      { title: 'Family History', component: "FamilyHistoryPage", image: 'assets/MedicalProfile_Icons/FamilyHistory.svg',count:'3' , date:'1/2/24/4:33pm'},
      { title: 'Medical Devices', component: "MedicalDevicesPage", image: 'assets/MedicalProfile_Icons/MedicalDevices.svg',count:'6' , date:'1/2/24/4:33pm'},
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
 