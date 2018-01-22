import { OnInit, ViewChild, Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar, Platform } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@IonicPage()
@Component({
  selector: 'page-resources-nav',
  templateUrl: 'resources-nav.html',
})
export class ResourcesNavPage implements OnInit {
  @ViewChild(Navbar) navBar: Navbar;
  private title: string = '';
  private list_feeds: boolean = false;
  private displayList: any;
  private bbTextHolder: string;
  private isUsingWeb: boolean;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private plt: Platform,
    public http: Http,
    private iab: InAppBrowser
  ) {}

  ngOnInit() {
    this.isUsingWeb = this.plt.is('mobileweb') || this.plt.is('core');
    this.bbTextHolder = this.navParams.get('backButtonText');
    this.navBar.setBackButtonText(this.bbTextHolder);
    this.setUpPage();
  }

  setUpPage() {
    let data = this.navParams.get('data');
    if (!data.children.length) {
      this.title = 'Articles';
      this.list_feeds = true;
      this.fetchArticles(data.feed).then(articles => { this.displayList = articles; });
    } else if (!this.bbTextHolder) {
      this.title = 'Categories';
      this.displayList = data.children;
    } else {
      this.title = data.name;
      this.displayList = data.children;
    }
  }

  displayItemName(item) {
    return this.list_feeds ? item.title : item.name;
  }

  fetchArticles(url) {
    var feed = require("feed-read-parser");
    return new Promise((resolve) => {
      if(this.isUsingWeb) {
        url = 'https://cors-anywhere.herokuapp.com/' + url;
        this.http.get(url).subscribe(data => {
          feed.rss(data['_body'], (err, articles) => {
            if (err) throw err;
            resolve(articles);
          });
        });
      } else {
        feed(url, (err, articles) => {
          if (err) throw err;
          resolve(articles);
        });
      }
    });
  }

  navToPage(item) {
    if (this.title === 'Articles') {
      if(this.isUsingWeb) {
        window.open(item.link, '_blank');
      } else {
        this.iab.create( item.link, '_blank', "location=yes");
      }
    } else {
      this.navCtrl.push("ResourcesNavPage", { backButtonText: this.title, data: item, module_color: this.navParams.get('module_color') });
    }
  }
}
