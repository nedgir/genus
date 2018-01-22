import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InviteOthersPage } from './invite-others';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    InviteOthersPage,
  ],
  imports: [
    IonicPageModule.forChild(InviteOthersPage),
    ComponentsModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  exports: [
    InviteOthersPage
  ]
})
export class InviteOthersPageModule {}
