import { Component, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CalendarMonthViewDay } from 'angular-calendar';
import { EventListComponent } from '../../components/event-list/event-list';
import { Event } from '../../models/event';
import { Subject } from 'rxjs/Subject';
import { CognitoUtil } from "../../providers/auth/cognito.service";
import { EventProvider } from '../../providers/event/event';
import moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-calendar',
  templateUrl: 'calendar.html',
})
export class CalendarPage implements OnInit {

  date: Date = new Date(Date.now());
  userId: string;
  days_label: Array<string> = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  view: string = 'month';
  selectedDayStored: CalendarMonthViewDay;
  weekendDays = [0]; //Only Sundays count as weekend
  allEvents = Array<Event>();
  eventsThisMonth = Array<Event>();
  finishGettingEvents: boolean = false;
  refresh: Subject<any> = new Subject();
  private today: Date;

  @ViewChild(EventListComponent) eventList: EventListComponent;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public cognitoUtil: CognitoUtil,
    public eventProvider: EventProvider) {
    this.today = new Date();
    }

  ngOnInit() {
    this.setUpEvents();
  }

  setUpEvents = async () => {
      let cognitoId = this.cognitoUtil.getCognitoIdentity();
      this.userId = cognitoId;
      this.eventList.refreshAllEvents();
      await this.getEventsInMonth();
      this.finishGettingEvents = true; //Set flag to prevent Race Condition
      this.refreshView();
  }

  async getEventsInMonth(date?: any) {
    if(!date) date = moment().format();
    this.eventsThisMonth = await this.eventProvider.getEventsByTimeInterval(moment(date).startOf('month').toJSON(), moment(date).endOf('month').toJSON(), false)
    this.finishGettingEvents = true; //Set flag to prevent Race Condition
    this.refreshView();
  }

  addEventCalendarPage() {
    this.navCtrl.push("EventDetailPage", { eventType: "EVENT", refreshEventsCallback: this.setUpEvents, selectedDay: this.selectedDayStored }, { animate: true, direction: 'forward' });
  }

  refreshView(): void {
    this.refresh.next();
  }

  dayClicked(dayClicked: CalendarMonthViewDay): void {
    if (this.selectedDayStored) {
      delete this.selectedDayStored.cssClass;
    }

    dayClicked.cssClass = 'user-selected-day';
    this.selectedDayStored = dayClicked;
    this.date = dayClicked.date;

    if (!dayClicked.inMonth) {
      this.getEventsInMonth(dayClicked.date);
      this.eventList.refreshEventList(this.date);
    } else {
      this.eventList.scrollToDate(dayClicked.date);
    }
  }

  beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
    let currIndex = 0;
    let lastIndex = this.eventsThisMonth.length - 1;
    let temp_flag = true;

    let inEvent = false;
    let requestAssistance;

    body.forEach(day => {
      if (this.selectedDayStored && moment(day.date).isSame(this.selectedDayStored.date, 'day')) {
        day.cssClass = 'user-selected-day';
        this.selectedDayStored = day;
      }

      if (this.finishGettingEvents && day.inMonth && this.eventsThisMonth.length) {
        while (temp_flag && moment(day.date).isSame(this.eventsThisMonth[currIndex].startDate, 'day') ) {
          let classString = '';
          let event = this.eventsThisMonth[currIndex];
          let flag_num = event.flags;
          let deleted = flag_num & 1;
          requestAssistance = (flag_num >> 1) & 1;

          inEvent = this.userInEvent(event);

          if (deleted) {
            classString = '';
          } else if (requestAssistance && inEvent) {
            classString = 'red-gray-combined';
          } else if (requestAssistance) {
            classString = 'red-heart-outline';
          } else if (inEvent) {
            classString = 'gray-heart-filled';
          } else {
            classString = 'gray-heart-outline';
          }

          if (day.cssClass) {
            day.cssClass = day.cssClass + ' ' + classString;
          } else {
            day.cssClass = classString;
          }
          currIndex++;
          if (currIndex > lastIndex) temp_flag = false;
        }
      }
    });
  }

  viewDateChange(ev) {
    this.getEventsInMonth(ev);
    this.eventList.refreshEventList(this.date);
  }

  userInEvent(event) {
    //Condition: 0 = invited, 1 = attending, 2 = not attending
    let flag = false;
    event.people.forEach(person => {
      if (person.identifier == this.userId && (person.flags == 0 || person.flags == 1)) flag = true;
    });
    return flag;
  }

  getThisMonth() {
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months[this.date.getMonth()];
  }

  protected ionViewDidLoad(): void {
    this.eventList.scrollToDate(this.today);
  }

}
