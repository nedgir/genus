import { ViewChild, ViewChildren, Component, OnInit, Input } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Event } from '../../models/event';
import { EventGroup } from '../../models/event-group';
import { CognitoUtil } from "../../providers/auth/cognito.service";
import { SessionProvider } from '../../providers/session/session';
import { EventProvider } from '../../providers/event/event';
import moment from 'moment';

@Component({
  selector: 'event-list',
  templateUrl: 'event-list.html'
})
export class EventListComponent implements OnInit {
  allEvents = Array<Event>();
  chartData: any;
  eventGroups: Array<EventGroup>;
  userId: string;
  clickedLike: boolean;
  print: any = 1;
  @Input('ascend') ascend: boolean;
  @Input('calendarDate') viewDate: Date; //Only if listype="month", this is valid
  @Input('listType') listType: string;   //Options: 'all', 'month', 'rsvp', 'assistance', 'emergency'
  @ViewChild('scroll') myScroll;
  @ViewChildren('dt') dateTitles;

  constructor(
    public navCtrl: NavController,
    public cognitoUtil: CognitoUtil,
    public navParams: NavParams,
    public sessionProvider: SessionProvider,
    public eventProvider: EventProvider) { }

  ngOnInit() {
    moment.updateLocale('en', {
      calendar : {
        lastDay : '[Yesterday]',
        sameDay : '[Today]',
        nextDay : '[Tomorrow]',
        lastWeek : 'MMMM D, YYYY',
        nextWeek : 'MMMM D, YYYY',
        sameElse: 'MMMM D, YYYY'
      }
    });
    this.refreshAllEvents();
  }

  refreshAllEvents = async() => {
    let cognitoId = this.cognitoUtil.getCognitoIdentity();
    this.userId = cognitoId;
    let start, end;

    if(this.listType == 'month') {
      start = moment().startOf('month').toJSON();
      end = moment().endOf('month').toJSON();
      this.allEvents = await this.eventProvider.getEventsByTimeInterval(start, end);
      this.putEventsInGroups(this.allEvents, this.checkMonth);
    } else {
      start = moment('1970-01-01').startOf('day').toJSON();
      end = moment().add(1, 'y').endOf('year').toJSON();
      this.allEvents = await this.eventProvider.getEventsByTimeInterval(start, end, true);
      switch (this.listType) {
        case 'all':
          this.putEventsInGroups(this.allEvents, this.checkAll);
          break;
        case 'rsvp':
          this.putEventsInGroups(this.allEvents, this.checkRSVP);
          break;
        case 'assistance':
          this.putEventsInGroups(this.allEvents, this.checkAssistance);
          break;
        case 'emergency':
          this.putEventsInGroups(this.allEvents, this.checkEmergency);
          break;
        default:
          ;
      }
    }
  }

  openPage(event: any) {
    /**
     * Contains the destination page.
     */
    let destinationPage: any;
    /**
     * Contains the parameters to pass to the destination page.
     */
    let parameters: any;

    switch (event.type) {
      case "emergency":
        destinationPage = "UrgentSituationPage";
        break;
      case 'call':
      case 'visit':
      case 'all':
      case 'month':
      case 'rsvp':
      case 'assistance':
        destinationPage = "EventDetailPage";
        parameters = {
          eventId: event._id,
          event: event,
          refreshEventsCallback: this.navCtrl.getActive().instance.setUpEvents
        };
        break;
      default:
        break;
    }
    this.navCtrl.push(destinationPage, parameters, { animate: true, direction: 'forward' });
  }

  scrollToDate(date) {
    date = this.findEventNearest(date);
    let date_id = this.getDateID(date);
    this.dateTitles._results.forEach((ele) => {
      let native_ele = ele.nativeElement;
      if (native_ele.id == date_id) {
        this.scrollAnimate(native_ele.offsetTop, 100);
        return;
      }
    });
  }

  scrollAnimate(to, duration) {
    if (duration <= 0) return;
    var difference = to - this.myScroll._scrollContent.nativeElement.scrollTop;
    var perTick = difference / duration * 10;

    setTimeout(() => {
      this.myScroll._scrollContent.nativeElement.scrollTop = this.myScroll._scrollContent.nativeElement.scrollTop + perTick;
      if (this.myScroll._scrollContent.nativeElement.scrollTop === to) return;
      this.scrollAnimate(to, duration - 10);
    }, 10);
  }

  findEventNearest(date) {
    if(this.eventGroups) {
      let num_events = this.eventGroups.length;
      if (!num_events) return null;

      let d1 = new Date(date);

      for (let eventGroup of this.eventGroups) {
        let d2 = new Date(eventGroup.date);
        if (d1.getDate() <= d2.getDate()) return new Date(eventGroup.date);
      }

      return new Date(this.eventGroups[num_events - 1].date);
    }
  }

  getTitle(event) {
    let title = event.title;
    let notes = event.notes;
    let type = event.type;

    if (title === undefined && notes === undefined) {
      switch (type) {
        case 'visit':
          return 'Event';
        case 'call':
          return 'Call';
        case 'emergency':
          return 'Emergency';
        default:
          return 'Type Unknown';
      }
    } else if (notes === undefined) {
      return title;
    } else if (title === undefined) {
      return notes;
    } else {
      return title + ' - ' + notes;
    }
  }

  getEventReporter(event) {
    if (event.reportedBy === this.userId) {
      return 'Me';
    } else {
      return event.reportedByName.split(" ")[0];
    }
  }

  getEventCallIcon(event) {
    let type = event.type;
    let flag = this.eventProvider.eventFlagInbound(event);
    let file: string;

    switch (type) {
      case 'visit':
        file = flag ? 'assets/AtHome.svg' : 'assets/AwayFromHome.svg';
        break;
      case 'call':
        if (flag) file = 'assets/phoneCallIn.svg';
        else {
          if (this.eventProvider.eventFlagCallConnected(event)) {
            file = 'assets/phoneCallOut.svg';
          } else {
            file = 'assets/MissedOutgoingPhoneCall.svg';
          }
        }
        break;
      case 'emergency':
        file = this.eventProvider.eventFlagAssistance(event) ? 'assets/AlertRed.svg' : 'assets/Alert.svg';
      default:
        ;
    }
    return file;
  }

  getEventDuration(event) {
    let interval = ((new Date(event.endDate)).getTime() - (new Date(event.startDate)).getTime()); // Time difference in Milliseconds
    let MS_PER_MIN = 1000 * 60;
    let MS_PER_HR = MS_PER_MIN * 60;
    let MS_PER_DAY = MS_PER_HR * 24;
    let day = Math.floor(interval / MS_PER_DAY);
    let hr = Math.floor(interval % MS_PER_DAY / MS_PER_HR);
    let min = Math.floor(interval % MS_PER_DAY % MS_PER_HR / MS_PER_MIN);
    let duration = "";
    if (day) {
      duration = duration + " " + day + "d";
    }
    if (hr) {
      duration = duration + " " + hr + "h";
    }
    if (min) {
      duration = duration + " " + min + "m";
    }
    duration = (duration.length == 0 || interval <= 0) ? '< 1m' : duration.trim().split(' ').join(', ');
    return duration;
  }

  getPeopleCount(event) {
    let rsvpLine: string;
    let attendingCount = this.countAttendance(event);

    if (this.checkRSVP(event)) {
      rsvpLine = 'RSVP';
    }
    else if (this.iAmAttending(event)) {
      if (event.reportedBy === this.userId) {
        if (attendingCount > 0) {
          rsvpLine = `+ ${attendingCount}`;
        }
      }
      else {
        if (attendingCount > 0) {
          rsvpLine = `Me + ${attendingCount}`;
        }
        else {
          rsvpLine = 'Me';
        }
      }
    }
    else {
      rsvpLine = '2';
    }
    return rsvpLine;
  }

  displayWidth(condition) {
    return condition ? 'width-33' : 'width-50';
  }

  showObservation(event) {
    return event.observationSummaryGUID && event.Emotional && event.Physical;
  }

  getAssistClass(event) {
    return this.checkAssistance(event) ? 'list-button background-request-assistance' : 'list-button';
  }

  getLikesSvg(flag) {
    return flag ? 'assets/LikesGreen.svg' : 'assets/Likes.svg';
  }

  toggleLike(event) {
    this.eventProvider.toggleLike(event);
  }

  openCommentsPage(event) {
    this.navCtrl.push("CommentsPage", { event: event }, { animate: true, direction: 'forward' });
  }

  async refreshEventList(date) {
    this.viewDate = new Date(date);
    let start = moment(this.viewDate).startOf('month').toJSON();
    let end = moment(this.viewDate).endOf('month').toJSON();
    this.allEvents = await this.eventProvider.getEventsByTimeInterval(start, end);
    this.putEventsInGroups(this.allEvents, this.checkMonth);
  }

  getDateID(d1) {
    let d2 = new Date(d1);
    let s1 = `${d2.getFullYear()}-${d2.getMonth() + 1}-${d2.getDate()}`;
    return s1;
  }

  checkAll = (event) => {
    return true;
  }

  checkRSVP = (event) => {
    let rsvp = false;
    event.people.forEach(person => {
      if (person.identifier == this.userId && person.flags == 0) rsvp = true;
    });
    return rsvp;
  }

  checkAssistance = (event) => {
    return (parseInt(event.flags) >> 1) & 1;
  }

  checkMonth = (event) => {
    return event.type != 'emergency';
  }

  checkEmergency = (event) => {
    return event.type == 'emergency';
  }

  iAmAttending = (event) => {
    let attending = false;
    event.people.forEach(person => {
      if (person.identifier == this.userId && person.flags == 1) attending = true;
    });
    return attending;
  }

  countAttendance = (event) => {
    let count = 0;
    event.people.forEach(person => {
      if (person.flags == 1) count++;
    });
    return count;
  }

  putEventsInGroups(events, funct) {
    events = events.filter(funct);
    this.eventGroups = [];
    let eventsArray = [];
    for(let index = 0; index < events.length; index++) {
      eventsArray.push(events[index]);
      if(index == (events.length-1) || !moment(events[index].startDate).isSame(events[index+1].startDate, 'day')) {
        this.eventGroups.push({ id: this.getDateID(events[index].startDate), date: events[index].startDate, displayDate: moment(events[index].startDate).calendar(), events: eventsArray });
        eventsArray = [];
      }
    }
  }
}
