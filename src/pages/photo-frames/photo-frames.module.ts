import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PhotoFramesPage } from './photo-frames';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    PhotoFramesPage,
  ],
  imports: [
    IonicPageModule.forChild(PhotoFramesPage),
    ComponentsModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  exports: [
    PhotoFramesPage
  ]
})
export class PhotoFramesPageModule {}
