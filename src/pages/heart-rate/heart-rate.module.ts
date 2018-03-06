import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HeartRatePage } from './heart-rate';
import { ComponentsModule } from '../../components/components.module';
@NgModule({
  declarations: [
    HeartRatePage,
  ],
  imports: [
    IonicPageModule.forChild(HeartRatePage),
    ComponentsModule
  ],
  exports: [
    HeartRatePage
  ]
})
export class HeartRatePageModule {}
