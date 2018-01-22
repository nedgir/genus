import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SendToFramesPage } from './send-to-frames';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    SendToFramesPage,
  ],
  imports: [
    IonicPageModule.forChild(SendToFramesPage),
    ComponentsModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  exports: [
    SendToFramesPage
  ]
})
export class SendToFramesPageModule {}
