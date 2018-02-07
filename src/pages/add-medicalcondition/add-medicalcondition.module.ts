import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddMedicalconditionPage } from './add-medicalcondition';

@NgModule({
  declarations: [
    AddMedicalconditionPage,
  ],
  imports: [
    IonicPageModule.forChild(AddMedicalconditionPage),
  ],
  exports: [
    AddMedicalconditionPage
  ]
})
export class AddMedicalconditionPageModule {}
