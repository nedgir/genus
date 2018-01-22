import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { EventProvider } from '../../providers/event/event';
import { Chart } from 'chart.js';
import moment from 'moment';

@Component({
  selector: 'chart',
  templateUrl: 'chart.html'
})

export class ChartComponent implements OnInit {
  private chart: Chart;
  private chartType: string;
  private leftLegendText: string = '';
  private rightLegendText: string = '';

  @ViewChild('chartCanvas') chartCanvas: ElementRef;
  constructor(public eventProvider: EventProvider) {}

  ngOnInit() {
    this.setUpEvents();
  }

  async setUpEvents() {
    let start = moment().startOf('date').subtract(1, 'M');
    let end = moment().endOf('date');
    this.leftLegendText = start.format('MMMM');
    this.rightLegendText = end.format('MMMM');
    let events = await this.eventProvider.getEventsByTimeInterval(start.toJSON(), end.toJSON());
    this.createChart('monthly', events, start, end);
  }

  createChart(chartType, events, start, end) {
    this.chartType = chartType;
    this.chart = new Chart(this.chartCanvas.nativeElement, {
      type: 'bar',
      options: {
        maintainAspectRatio: false,
        layout: {
          padding: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
          }
        },
        scales: {
          xAxes: [
            {
              ticks: {
                autoSkip: false,
                maxRotation: 0,
                minRotation: 0,
                callback: (value, index, values) => {
                  if (this.chartType == 'monthly' || this.chartType == 'yearly') {
                    return index % 2 == 0 ? value : null;
                  } else {
                    return value;
                  }
                }
              },
              stacked: true,
              gridLines: {
                display: false
              }
            }
          ],
          yAxes: [
            {
              display: true,
              stacked: true,
              ticks: {
                beginAtZero: true,
                callback: function(value) { if (value % 1 === 0) { return value; } }
              },
              scaleLabel: {
                display: true,
                labelString: 'Visits'
              }
            }
          ]
        },
        legend: {
          display: false
        }
      }
    });
    return this.generateChart(chartType, events, start, end);
  }

  async switchChartType() {
    let start;
    let end;
    switch(this.chartType){
      case 'weekly':
        start = moment().startOf('day').subtract(1, 'w');
        end = moment().endOf('day');
        this.leftLegendText = start.format('M/D/YY');
        this.rightLegendText = end.format('M/D/YY');
        break;
      case 'monthly':
        start = moment().startOf('date').subtract(1, 'M');
        end = moment().endOf('date');
        this.leftLegendText = start.format('MMMM');
        this.rightLegendText = end.format('MMMM');
        break;
      case 'yearly':
        start = moment().startOf('month').subtract(1, 'y');
        end = moment().endOf('month');
        this.leftLegendText = start.format('YYYY');
        this.rightLegendText = end.format('YYYY');
        break;
      default: ;
    }
    let events = await this.eventProvider.getEventsByTimeInterval(start.toJSON(), end.toJSON());
    this.generateChart(this.chartType, events, start, end);
  }

  generateChart(type, events, start, end) {
    this.chartType = type;
    let results = this.countEventsInPeriod(type, events, start, end);
    let labels = results['labels'];
    let data = results['data'];
    this.chart.config.data = {
      labels: labels,
      datasets: [{
        label: 'In Person',
        data: this.extractDataOfType('visits', data),
        backgroundColor: '#169F84',
        borderColor: '#169F84',
        borderWidth: 1,
        fill: false
      }, {
          label: 'Phone',
          data: this.extractDataOfType('calls', data),
          backgroundColor: 'black',
          borderColor: 'black',
          borderWidth: 1,
          fill: false
        }, {
          label: 'Not Connected Calls',
          data: this.extractDataOfType('notConnected', data),
          backgroundColor: 'rgb(255, 221, 0)',
          borderColor: 'rgb(255, 221, 0)',
          borderWidth: 1,
          fill: false
        }, {
          label: 'Emergency',
          data: this.extractDataOfType('emergencies', data),
          backgroundColor: 'red',
          borderColor: 'red',
          borderWidth: 1,
          fill: false
        }],
    };
    this.chart.update();
  }

  countEventsInPeriod(type, events, start, end) {
    let bucket_unit;
    switch(type) {
      case 'weekly':
      case 'monthly':
        bucket_unit = 'day';
        break;
      case 'yearly':
        bucket_unit = 'month';
        break;
    }
    let currentDate = moment(start);
    let eventIndex = 0;
    let x_Array_Bucket_Labels = [];
    let y_Array_Buckets = [];
    while(currentDate.isSameOrBefore(end)) {
      let y_Bucket = { visits: 0, calls: 0, notConnected: 0, emergencies: 0 };
      while(eventIndex < events.length && moment(currentDate).isSame(events[eventIndex].startDate, bucket_unit)) {
        if (events[eventIndex].type == 'visit') y_Bucket.visits++;
        else if (events[eventIndex].type == 'call' && this.eventProvider.eventFlagCallConnected(events[eventIndex])) y_Bucket.calls++;
        else if (events[eventIndex].type == 'call' && !this.eventProvider.eventFlagCallConnected(events[eventIndex])) y_Bucket.notConnected++;
        else if (events[eventIndex].type == 'emergency') y_Bucket.emergencies++;
        eventIndex++;
      }
      y_Array_Buckets.push(y_Bucket);
      switch(type) {
        case 'weekly':
          x_Array_Bucket_Labels.push(currentDate.format("ddd")[0]);
          currentDate.add(1, 'd');
          break;
        case 'monthly':
          x_Array_Bucket_Labels.push(currentDate.format("D"));
          currentDate.add(1, 'd');
          break;
        case 'yearly':
          x_Array_Bucket_Labels.push(currentDate.format("MMM"));
          currentDate.add(1, 'M');
          break;
      }
    }
    return { labels: x_Array_Bucket_Labels, data: y_Array_Buckets };
  }

  extractDataOfType(type, buckets) {
    let results = [];
    for (let bucket of buckets) {
      results.push(bucket[type]);
    }
    return results;
  }
}
