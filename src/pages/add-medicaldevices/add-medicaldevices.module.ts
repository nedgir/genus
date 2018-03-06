import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddMedicaldevicesPage } from './add-medicaldevices';

@NgModule({
  declarations: [
    AddMedicaldevicesPage,
  ],
  imports: [
    IonicPageModule.forChild(AddMedicaldevicesPage),
  ],
  exports: [
    AddMedicaldevicesPage
  ]
})
export class AddMedicaldevicesPageModule {}
