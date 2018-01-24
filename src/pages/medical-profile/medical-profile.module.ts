import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MedicalProfilePage } from './medical-profile';
import { ComponentsModule } from '../../components/components.module';
@NgModule({
  declarations: [
    MedicalProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(MedicalProfilePage),
    ComponentsModule
  ],
  exports: [
    MedicalProfilePage
  ]
})
export class MedicalProfilePageModule {}
