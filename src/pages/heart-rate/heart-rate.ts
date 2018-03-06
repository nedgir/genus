import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as HighCharts from 'highcharts';
/**
 * Generated class for the HeartRatePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-heart-rate',
  templateUrl: 'heart-rate.html',
})
export class HeartRatePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    var myChart = HighCharts.chart('container', {
      chart: {
      type: 'line'
      },
      title: {
      text: 'Chart'
      },
      xAxis: {
      categories: ['6am', '7am', '8am','9am','10am','11am','12pm']
      },
      yAxis: {
        categories: ['65', '66', '67',],
      title: {
      text: 'HR'
      }
      },
      series: [{
      name: 'Time',
      data: [65, 66, 67]
      }
      // ,
      //  {
      // name: 'John',
      // data: [5, 7, 3]
      // }
    ]
      });
  }

}
