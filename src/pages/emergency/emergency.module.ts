import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EmergencyPage } from './emergency';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    EmergencyPage,
  ],
  imports: [
    IonicPageModule.forChild(EmergencyPage),
    ComponentsModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  exports: [
    EmergencyPage
  ]
})
export class EmergencyPageModule {}
