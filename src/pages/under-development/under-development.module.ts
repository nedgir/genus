import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UnderDevelopmentPage } from './under-development';

@NgModule({
  declarations: [
    UnderDevelopmentPage,
  ],
  imports: [
    IonicPageModule.forChild(UnderDevelopmentPage),
  ],
  exports: [
    UnderDevelopmentPage
  ]
})
export class UnderDevelopmentPageModule {}
