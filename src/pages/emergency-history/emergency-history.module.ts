import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EmergencyHistoryPage } from './emergency-history';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    EmergencyHistoryPage,
  ],
  imports: [
    IonicPageModule.forChild(EmergencyHistoryPage),
    ComponentsModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  exports: [
    EmergencyHistoryPage
  ]
})
export class EmergencyHistoryPageModule {}
