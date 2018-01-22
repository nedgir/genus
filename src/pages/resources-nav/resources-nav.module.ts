import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ResourcesNavPage } from './resources-nav';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    ResourcesNavPage,
  ],
  imports: [
    IonicPageModule.forChild(ResourcesNavPage),
    ComponentsModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  exports: [
    ResourcesNavPage
  ]
})
export class ResourcesNavPageModule {}
