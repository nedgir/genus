import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddFamilyhistoryPage } from './add-familyhistory';

@NgModule({
  declarations: [
    AddFamilyhistoryPage,
  ],
  imports: [
    IonicPageModule.forChild(AddFamilyhistoryPage),
  ],
  exports: [
    AddFamilyhistoryPage
  ]
})
export class AddFamilyhistoryPageModule {}
