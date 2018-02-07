import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddEmergencycontactPage } from './add-emergencycontact';

@NgModule({
  declarations: [
    AddEmergencycontactPage,
  ],
  imports: [
    IonicPageModule.forChild(AddEmergencycontactPage),
  ],
  exports: [
    AddEmergencycontactPage
  ]
})
export class AddEmergencycontactPageModule {}
