import { Input, Component } from '@angular/core';

@Component({
  selector: 'dashboard-stats-cell',
  templateUrl: 'dashboard-stats-cell.html'
})
export class DashboardStatsCellComponent {

  @Input('data') data;
  constructor() {}
}
