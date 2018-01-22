import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddEditPhotoFramePage } from './add-edit-photo-frame';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    AddEditPhotoFramePage,
  ],
  imports: [
    IonicPageModule.forChild(AddEditPhotoFramePage),
    ComponentsModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  exports: [
    AddEditPhotoFramePage
  ]
})
export class AddEditPhotoFramePageModule {}
