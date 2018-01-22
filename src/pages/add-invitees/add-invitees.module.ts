import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddInviteesPage } from './add-invitees';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    AddInviteesPage,
  ],
  imports: [
    IonicPageModule.forChild(AddInviteesPage),
    ComponentsModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  exports: [
    AddInviteesPage
  ]
})
export class AddInviteesPageModule {}
