import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MakeSuggestionPage } from './make-suggestion';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    MakeSuggestionPage,
  ],
  imports: [
    IonicPageModule.forChild(MakeSuggestionPage),
    ComponentsModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  exports: [
    MakeSuggestionPage
  ]
})
export class MakeSuggestionPageModule {}
