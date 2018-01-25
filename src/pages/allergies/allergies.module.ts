import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AllergiesPage } from './allergies';
import { ComponentsModule } from '../../components/components.module';
@NgModule({
  declarations: [
    AllergiesPage,
  ],
  imports: [
    IonicPageModule.forChild(AllergiesPage),
    ComponentsModule
  ],
  exports: [
    AllergiesPage
  ]
})
export class AllergiesPageModule {}
