import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DeviceContactsPage } from './device-contacts';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    DeviceContactsPage,
  ],
  imports: [
    IonicPageModule.forChild(DeviceContactsPage),
    ComponentsModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  exports: [
    DeviceContactsPage
  ]
})
export class DeviceContactsPageModule {}
