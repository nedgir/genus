import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VerifyAccountPage } from './verify-account';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    VerifyAccountPage,
  ],
  imports: [
    IonicPageModule.forChild(VerifyAccountPage),
    ComponentsModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  exports: [
    VerifyAccountPage
  ]
})
export class VerifyAccountPageModule {}
