import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommunityMenuPage } from './community-menu';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    CommunityMenuPage
  ],
  imports: [
    IonicPageModule.forChild(CommunityMenuPage),
    ComponentsModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  exports: [
    CommunityMenuPage
  ]
})
export class CommunityMenuPageModule {}
