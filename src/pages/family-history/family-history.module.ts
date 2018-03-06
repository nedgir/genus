import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FamilyHistoryPage } from './family-history';
import { ComponentsModule } from '../../components/components.module';
@NgModule({
  declarations: [
    FamilyHistoryPage,
  ],
  imports: [
    IonicPageModule.forChild(FamilyHistoryPage),
    ComponentsModule
  ],
  exports: [
    FamilyHistoryPage,
    
  ]
})
export class FamilyHistoryPageModule {}
