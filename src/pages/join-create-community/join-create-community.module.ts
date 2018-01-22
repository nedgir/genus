import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { JoinCreateCommunityPage } from './join-create-community';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    JoinCreateCommunityPage,
  ],
  imports: [
    IonicPageModule.forChild(JoinCreateCommunityPage),
    ComponentsModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  exports: [
    JoinCreateCommunityPage
  ]
})
export class JoinCreateCommunityPageModule {}
