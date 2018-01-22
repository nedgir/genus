import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewPhotoPage } from './new-photo';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    NewPhotoPage,
  ],
  imports: [
    IonicPageModule.forChild(NewPhotoPage),
    ComponentsModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  exports: [
    NewPhotoPage
  ]
})
export class NewPhotoPageModule {}
