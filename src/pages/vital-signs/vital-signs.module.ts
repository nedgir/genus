import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VitalSignsPage } from './vital-signs';
import { ComponentsModule } from '../../components/components.module';
@NgModule({
  declarations: [
    VitalSignsPage,
  ],
  imports: [
    IonicPageModule.forChild(VitalSignsPage),
    ComponentsModule
  ],
  exports: [
    VitalSignsPage
  ]
})
export class VitalSignsPageModule {}
