import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SurgeriesPage } from './surgeries';
import { ComponentsModule } from '../../components/components.module';
@NgModule({
  declarations: [
    SurgeriesPage,
  ],
  imports: [
    IonicPageModule.forChild(SurgeriesPage),
    ComponentsModule
  ],
  exports: [
    SurgeriesPage
  ]
})
export class SurgeriesPageModule {}
