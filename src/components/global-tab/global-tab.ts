import { Component, Input, OnInit } from '@angular/core';
import { NavController, Platform, ActionSheetController } from 'ionic-angular';

@Component({
  selector: 'global-tab',
  templateUrl: 'global-tab.html',
})
export class GlobalTabComponent implements OnInit {
  @Input('name') page;

  showHelp: boolean = true;
  showHome: boolean = true;
  showEmergency: boolean = true;
  showCallLog: boolean = false;
  showPhoneIcon: boolean = true;

  show: boolean = true;

  constructor(public navCtrl: NavController,
              public platform: Platform,
              public actionsheetCtrl: ActionSheetController) {}

  ngOnInit() {
    this.showHome = this.page == "dashboard" ? false : true;
    this.showEmergency = this.page == "emergency" ? false : true;
    this.showPhoneIcon = this.page == "call" ? true : false;
    this.showCallLog = this.page == "dashboard" ? true : false;
  }

  goHome() {
    this.navCtrl.setRoot("DashboardPage", {}, {animate: true, direction: 'forward'});
  }

  goToHelp() {
    let actionSheet = this.actionsheetCtrl.create({
    title: 'Are we helping you? Or are you helping us?',
      buttons: [
        {
          text: 'Make a Suggestion',
          handler: () => {
            this.navCtrl.push("MakeSuggestionPage", {}, {animate: true, direction: 'forward'});
          }
        },
        {
          text: 'Report a Bug',
          handler: () => {
            this.navCtrl.push("ReportBugPage", {}, {animate: true, direction: 'forward'});
          }
        },
        {
          text: 'View genusConnect Help',
          handler: () => {
            this.navCtrl.push("HelpPage", {}, {animate: true, direction: 'forward'});
          }
        },
        {
          text: 'Cancel',
          role: 'cancel', // will always sort to be on the bottom
          handler: () => {}
        }
      ]
    });
    actionSheet.present();
  }

  pageMedkit() {
    this.navCtrl.push("EmergencyPage", {}, {animate: true, direction: 'forward'});
  }

  clickCallLog() {
    this.navCtrl.push("ContactHistoryPage", {}, {animate: true, direction: 'forward'});
  }

  clickCall() {
    this.navCtrl.getActive().instance.addEventContactHistoryPage();
  }
}
