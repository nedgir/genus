import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CalendarPage } from './calendar';
import { ComponentsModule } from '../../components/components.module';
import { CalendarModule } from 'angular-calendar';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    CalendarPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicPageModule.forChild(CalendarPage),
    ComponentsModule,
    CalendarModule.forRoot()
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  exports: [
    CalendarPage
  ]
})
export class CalendarPageModule {}
