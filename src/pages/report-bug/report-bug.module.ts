import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReportBugPage } from './report-bug';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    ReportBugPage,
  ],
  imports: [
    IonicPageModule.forChild(ReportBugPage),
    ComponentsModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  exports: [
    ReportBugPage
  ]
})
export class ReportBugPageModule {}
