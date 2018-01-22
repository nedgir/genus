import { Component, OnInit, Input, ViewChild, ViewChildren } from '@angular/core';
import { Content, NavController, NavParams, InfiniteScroll } from 'ionic-angular';
import { EventGroup } from '../../models/event-group';
import { CognitoUtil } from "../../providers/auth/cognito.service";
import { SessionProvider } from '../../providers/session/session';
import { EventProvider } from '../../providers/event/event';
import { DataServiceProvider } from '../../providers/data-service/data-service';
import moment from 'moment';

@Component({
  selector: 'event-list-infinite',
  templateUrl: 'event-list-infinite.html'
})

export class EventListInfiniteComponent implements OnInit {
  eventGroups: Array<EventGroup> = [];
  userId: string;
  private cognitoId: string = this.sessionProvider.getUser().cognitoId;
  private communityId: string = this.sessionProvider.getCurrentCommunityId();
  private scrollDate: string = '';
  @Input('startKey') startKey: string;
  @Input('endKey') endKey: string;
  @Input('descend') descend: boolean;
  @Input('calendarDate') viewDate: Date;
  @Input('parentContent') parentContent: Content;
  @ViewChild(InfiniteScroll) infiniteScroll: InfiniteScroll;
  @ViewChildren('dt') dateTitles;
  private pageSize = 15;

  constructor(
    public navCtrl: NavController,
    public cognitoUtil: CognitoUtil,
    public navParams: NavParams,
    public sessionProvider: SessionProvider,
    public eventProvider: EventProvider,
    public dataServiceProvider: DataServiceProvider) { }

  ngOnInit() {
    moment.updateLocale('en', {
      calendar: {
        lastDay: '[Yesterday]',
        sameDay: '[Today]',
        nextDay: '[Tomorrow]',
        lastWeek: 'MMMM D, YYYY',
        nextWeek: 'MMMM D, YYYY',
        sameElse: 'MMMM D, YYYY'
      }
    });
    this.userId = this.sessionProvider.getUser().cognitoId;
    this.setUpEvents();
  }

  showItemDivider(index, eventGroups) {
    if (index == 0) return true;
    if (moment(eventGroups[index - 1].date).isSame(eventGroups[index].date, 'day')) return false;
    return true;
  }

  async doInfinite(infiniteScroll) {
    await this.fetchNextEvents();
    infiniteScroll.complete();
  }

  setUpEvents = async () => {
    this.eventGroups = [];
    this.startKey = 'Event_' + this.cognitoId + '_' + this.communityId + '_' + moment().subtract(1, 'day').endOf('day').toJSON();
    this.endKey = 'Event_' + this.cognitoId + '_' + this.communityId + '_' + moment('1970-01-01').startOf('day').toJSON();
    this.scrollDate = await this.fetchFutureEvents();
    await this.fetchNextEvents();
    setTimeout(() => {
      if (this.scrollDate) this.parentContent.scrollTo(0, this.scrollToOffset(this.scrollDate), 500);
    }, 0);
  }

  scrollToOffset(scrollDate) {
    for(let element of this.dateTitles._results) {
      if (element.nativeElement.id == scrollDate) {
        return element.nativeElement.offsetTop;
      }
    }
    return 0;
  }

  async fetchFutureEvents() {
    let futureEvents = await this.eventProvider.getEventsByTimeInterval(moment().startOf('day').toJSON(), moment().add(1, 'y').endOf('year').toJSON(), true);
    if (futureEvents.length) {
      this.eventGroups = this.eventGroups.concat(this.putEventsInGroups(futureEvents));
      return this.getDateID(futureEvents[futureEvents.length - 1].startDate);
    }
    return null;
  }

  async fetchNextEvents() {
    let nextEvents = await this.dataServiceProvider.getDocumentsByPageSize(this.startKey, this.endKey, this.pageSize, this.descend);
    if (nextEvents.length == this.pageSize + 1) {
      let lastEvent = nextEvents.pop();
      this.startKey = lastEvent._id;
    } else {
      this.infiniteScroll.enable(false);
    }
    this.eventGroups = this.eventGroups.concat(this.putEventsInGroups(nextEvents));
  }

  refreshEvents = async () => {
    this.setUpEvents();
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
        destinationPage = 'UrgentSituationPage';
        break;
      case 'call':
      case 'visit':
      case 'all':
      case 'month':
      case 'rsvp':
      case 'assistance':
        destinationPage = 'EventDetailPage';
        parameters = {
          eventId: event._id,
          event: event,
          refreshEventsCallback: this.navCtrl.getActive().instance.refreshEvents
        };
        break;
      default:
        break;
    }
    this.navCtrl.push(destinationPage, parameters, { animate: true, direction: 'forward' });
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
    this.navCtrl.push('CommentsPage', { event: event }, { animate: true, direction: 'forward' });
  }

  getDateID(date) {
    return moment(date).format('YYYY-MM-D');;
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

  putEventsInGroups(events) {
    let eventGroups = [];
    let eventsArray = [];
    for (let index = 0; index < events.length; index++) {
      eventsArray.push(events[index]);
      if (index == (events.length - 1) || !moment(events[index].startDate).isSame(events[index + 1].startDate, 'day')) {
        eventGroups.push({ id: this.getDateID(events[index].startDate), date: events[index].startDate, displayDate: moment(events[index].startDate).calendar(), events: eventsArray });
        eventsArray = [];
      }
    }
    return eventGroups;
  }
}
