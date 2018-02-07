import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddMedicaldocumentPage } from './add-medicaldocument';

@NgModule({
  declarations: [
    AddMedicaldocumentPage,
  ],
  imports: [
    IonicPageModule.forChild(AddMedicaldocumentPage),
  ],
  exports: [
    AddMedicaldocumentPage
  ]
})
export class AddMedicaldocumentPageModule {}
