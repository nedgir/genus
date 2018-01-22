import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContactHistoryPage } from './contact-history';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    ContactHistoryPage,
  ],
  imports: [
    IonicPageModule.forChild(ContactHistoryPage),
    ComponentsModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  exports: [
    ContactHistoryPage
  ]
})
export class ContactHistoryPageModule {}
