import { ViewChild, Component, OnInit } from '@angular/core';
import { Nav, IonicPage, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-resources',
  templateUrl: 'resources.html',
})
export class ResourcesPage implements OnInit {
  @ViewChild(Nav) nav: Nav;
  public module_name: string;
  public module_color: string;

  constructor(public navParams: NavParams) {}

  ngOnInit() {
    this.module_name = this.navParams.get('module_name');
    this.module_color = this.navParams.get('module_color');
    this.nav.setRoot("ResourcesNavPage", { data:  this.navParams.get('data'), module_color:  this.navParams.get('module_color') }, { animate: true, direction: 'forward' });
  }
}
