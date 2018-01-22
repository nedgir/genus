import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RecoverPasswordPage } from './recover-password';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    RecoverPasswordPage,
  ],
  imports: [
    IonicPageModule.forChild(RecoverPasswordPage),
    ComponentsModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  exports: [
    RecoverPasswordPage
  ]
})
export class RecoverPasswordPageModule {}
