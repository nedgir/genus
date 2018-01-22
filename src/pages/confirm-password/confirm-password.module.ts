import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConfirmPasswordPage } from './confirm-password';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    ConfirmPasswordPage,
  ],
  imports: [
    IonicPageModule.forChild(ConfirmPasswordPage),
    ComponentsModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  exports: [
    ConfirmPasswordPage
  ]
})
export class ConfirmPasswordPageModule {}
