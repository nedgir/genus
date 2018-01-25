import { NgModule } from '@angular/core';
import { IonicModule }  from 'ionic-angular';

import { ChangeImagePopover } from './change-image-popover/change-image-popover';
import { ChartComponent } from './chart/chart';
import { ChatBubbleComponent } from './chatbubble/chatbubble';
import { EventListComponent } from './event-list/event-list';
import { EventListInfiniteComponent } from './event-list-infinite/event-list-infinite';
import { GlobalHeaderComponent } from './global-header/global-header';
import { GlobalTabComponent } from './global-tab/global-tab';
import { DashboardStatsCellComponent } from './dashboard-stats-cell/dashboard-stats-cell';
import { ScrollableTabsComponent } from './scrollable-tabs/scrollable-tabs';

const COMPONENTS = [
  ChangeImagePopover,
  ChartComponent,
  ChatBubbleComponent,
  EventListComponent,
  EventListInfiniteComponent,
  GlobalHeaderComponent,
  GlobalTabComponent,
  DashboardStatsCellComponent,
  ScrollableTabsComponent
];

@NgModule({
  declarations: COMPONENTS,
  imports: [ IonicModule ],
  exports: COMPONENTS,
  schemas: [ ]
})
export class ComponentsModule { }
