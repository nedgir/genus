import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MedicalDocumentsPage } from './medical-documents';
import { ComponentsModule } from '../../components/components.module';
@NgModule({
  declarations: [
    MedicalDocumentsPage,
  ],
  imports: [
    IonicPageModule.forChild(MedicalDocumentsPage),
    ComponentsModule
  ],
  exports: [
    MedicalDocumentsPage
  ]
})
export class MedicalDocumentsPageModule {}
