import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MomentsPage } from './moments';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    MomentsPage,
  ],
  imports: [
    IonicPageModule.forChild(MomentsPage),
    ComponentsModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  exports: [
    MomentsPage
  ]
})
export class MomentsPageModule {}
