import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HealthMenuPage } from './health-menu';
import { ComponentsModule } from '../../components/components.module';
@NgModule({
  declarations: [
    HealthMenuPage,
  ],
  imports: [
    IonicPageModule.forChild(HealthMenuPage),
    ComponentsModule
    
  ],
  exports: [
    HealthMenuPage
  ]
})
export class HealthMenuPageModule {}
