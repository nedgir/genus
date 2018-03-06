import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EmergencyContactPage } from './emergency-contact';
import { ComponentsModule } from '../../components/components.module';
@NgModule({
  declarations: [
    EmergencyContactPage,
    
  ],
  imports: [
    IonicPageModule.forChild(EmergencyContactPage),
    ComponentsModule
  ],
  exports: [
    EmergencyContactPage
  ]
})
export class EmergencyContactPageModule {}
