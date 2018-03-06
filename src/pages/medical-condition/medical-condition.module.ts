import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MedicalConditionPage } from './medical-condition';
import { ComponentsModule } from '../../components/components.module';
@NgModule({
  declarations: [
    MedicalConditionPage,
  ],
  imports: [
    IonicPageModule.forChild(MedicalConditionPage),
    ComponentsModule
  ],
  exports: [
    MedicalConditionPage
  ]
})
export class MedicalConditionPageModule {}
