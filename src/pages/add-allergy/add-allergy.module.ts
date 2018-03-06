import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddAllergyPage } from './add-allergy';

@NgModule({
  declarations: [
    AddAllergyPage,
  ],
  imports: [
    IonicPageModule.forChild(AddAllergyPage),
  ],
  exports: [
    AddAllergyPage
  ]
})
export class AddAllergyPageModule {}
