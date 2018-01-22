import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UrgentSituationPage } from './urgent-situation';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    UrgentSituationPage,
  ],
  imports: [
    IonicPageModule.forChild(UrgentSituationPage),
    ComponentsModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  exports: [
    UrgentSituationPage
  ]
})
export class UrgentSituationPageModule {}
