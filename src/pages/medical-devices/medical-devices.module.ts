import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MedicalDevicesPage } from './medical-devices';
import { ComponentsModule } from '../../components/components.module';
@NgModule({
  declarations: [
    MedicalDevicesPage,
  ],
  imports: [
    IonicPageModule.forChild(MedicalDevicesPage),
    ComponentsModule
  ],
  exports: [
    MedicalDevicesPage
  ]
})
export class MedicalDevicesPageModule {}
