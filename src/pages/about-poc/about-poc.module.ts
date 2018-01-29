import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AboutPocPage } from './about-poc';
import { ComponentsModule } from '../../components/components.module';
@NgModule({
  declarations: [
    AboutPocPage,
  ],
  imports: [
    IonicPageModule.forChild(AboutPocPage),
    ComponentsModule
  ],
  exports: [
    AboutPocPage
  ]
})
export class AboutPocPageModule {}
