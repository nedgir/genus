import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OpenInvitationsPage } from './open-invitations';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    OpenInvitationsPage,
  ],
  imports: [
    IonicPageModule.forChild(OpenInvitationsPage),
    ComponentsModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  exports: [
    OpenInvitationsPage
  ]
})
export class OpenInvitationsPageModule {}
