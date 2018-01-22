import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PersonalProfilePage } from './personal-profile';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    PersonalProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(PersonalProfilePage),
    ComponentsModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  exports: [
    PersonalProfilePage
  ]
})
export class PersonalProfilePageModule {}
