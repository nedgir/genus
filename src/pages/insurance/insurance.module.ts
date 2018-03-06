import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InsurancePage } from './insurance';
import { ComponentsModule } from '../../components/components.module';
@NgModule({
  declarations: [
    InsurancePage,
  ],
  imports: [
    IonicPageModule.forChild(InsurancePage),
    ComponentsModule
  ],
  exports: [
    InsurancePage
  ]
})
export class InsurancePageModule {}
