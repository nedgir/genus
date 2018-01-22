import { OnInit, Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading } from 'ionic-angular';
import { EventProvider } from '../../providers/event/event';
import { Event } from '../../models/event';
import { Person } from '../../models/person';
import { UUID } from 'angular2-uuid';
import { SessionProvider } from '../../providers/session/session';
import moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-event-detail',
  templateUrl: 'event-detail.html',
})

export class EventDetailPage implements OnInit {
  //Text showing on the form
  public event_action: string;
  public segment_left: string;
  public segment_right: string;
  public communityName: string;
  //ngModel
  public optionsSelected: boolean = false;
  public callConnected: boolean = false;
  public requestAssistance: boolean = false;
  public person_flag: number = -1; // -1 Flag of this user in this event
  // Logic showing certain fields in format
  public enable_edit: boolean; //You are the owner of this event
  public inEvent: boolean;
  public show_req_assistance: boolean;
  public show_include_observations: boolean;
  public show_call_connected: boolean;
  public include_observe: boolean;
  public invited_date: string;
  //Event Object
  private eventEdited;
  private originalEvent;
  private eventId;
  private observation = {};
  private active_phys_categories;
  private active_emo_categories;
  //NavParams
  eventType: string;
  isNew: boolean;

  constructor(public navParams: NavParams,
    public eventProvider: EventProvider,
    public navCtrl: NavController,
    public sessionProvider: SessionProvider,
    private loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.communityName = this.sessionProvider.getCurrentCommunityName();
    this.isNew = this.navParams.get('eventId') ? false : true;
    this.eventType = this.navParams.get('eventType');
    this.setupActiveObservationCategories(); //load observation category table, need it when adding events/calls
    if (this.isNew) { // ADDING
      this.eventEdited = new Event();
      let selectedDay = this.navParams.get('selectedDay');
      let tempDate = moment();
      if(selectedDay) {
        tempDate = tempDate.set('year', selectedDay.date.getFullYear());
        tempDate = tempDate.set('month', selectedDay.date.getMonth());
        tempDate = tempDate.set('date', selectedDay.date.getDate());
      }
      if (this.eventType === "EVENT") {
        this.eventEdited.type = 'visit';
        this.eventEdited.startDate = moment(tempDate).subtract(1, 'hours').startOf('hour').format();
        this.eventEdited.endDate = moment(tempDate).startOf('hour').format();
      } else if (this.eventType === "CALL") {
        this.eventEdited.type = 'call';
        this.eventEdited.startDate = moment(tempDate).subtract(15, 'minutes').format();
        this.eventEdited.endDate = moment(tempDate).format();
        this.callConnected = true;
      }
      this.setupPeople();
      this.inEvent = true;
      this.event_action = 'ADD';
      this.enable_edit = true;
    } else {
      this.originalEvent = this.navParams.get('event');
      this.eventEdited = JSON.parse(JSON.stringify(this.navParams.get('event')));
      this.eventId = this.navParams.get('eventId');

      if (this.eventEdited.reportedBy === this.sessionProvider.getUser().cognitoId) {
        this.event_action = 'EDIT';
        this.enable_edit = true;
      } else {
        this.event_action = 'VIEW';
        this.enable_edit = false;
      }
      this.optionsSelected = this.eventProvider.eventFlagInbound(this.eventEdited);
      this.callConnected = this.eventProvider.eventFlagCallConnected(this.eventEdited);
      this.requestAssistance = this.eventProvider.eventFlagAssistance(this.eventEdited);
      this.eventEdited.people.forEach((person) => {
        if (person.identifier === this.sessionProvider.getUser().cognitoId) {
          this.inEvent = true;
          this.person_flag = person.flags;
          this.invited_date = moment(person.addedDate).format();
        }
        person.status = true;
      });
      if (this.enable_edit) this.setupPeopleEdit();
      else this.sortPeople(this.eventEdited.people);
    }
    this.toggleOptionSelect(this.eventEdited.type);
    this.updateUI();
  }

  async setupActiveObservationCategories() {
    this.active_phys_categories = [];
    this.active_emo_categories = [];
    await this.eventProvider.getObservationsCategory().then(categories => {
      categories.forEach(category => {
        if (category.active) {
          this.observation[category.name] = 50;
          if (category.type === 'Emotional') this.active_emo_categories.push(category);
          else if (category.type === 'Physical') this.active_phys_categories.push(category);
        }
      })
    });
  }

  setupPeople() {
    this.eventEdited.people = new Array<Person>();
    let me = new Person();
    me.identifier = this.sessionProvider.getUser().cognitoId;
    me.flags = 1;
    me.status = true;
    me.name = this.sessionProvider.getUser().name;
    this.eventEdited.people.push(me);

    this.eventProvider.getCommunity().then((community) => {
      this.sortPeople(community.members);
      community.members.forEach((data) => {
        if (data.id != this.sessionProvider.getUser().cognitoId) {
          let person = new Person();
          person.identifier = data.id;
          person.name = data.name;
          person.flags = 0;
          person.status = false;
          this.eventEdited.people.push(person);
        }
      });
    });
  }

  setupPeopleEdit() {
    this.eventProvider.getCommunity().then((community) => {
      community.members.forEach((data) => {
        if (!this.memberInArray(data.id)) {
          let person = new Person();
          person.identifier = data.id;
          person.name = data.name;
          person.flags = 0;
          person.status = false;
          this.eventEdited.people.push(person);
        }
      });
    });
    this.sortPeople(this.eventEdited.people);
  }

  memberInArray(id) {
    let flag = false;
    for (let person of this.eventEdited.people) {
      if (id === person.identifier) { flag = true; break; }
    }
    return flag;
  }

  sortPeople(peopleArray) {
    let attending = peopleArray
      .filter((person) => { return person.flags == 1; })
      .sort((a, b) => { return (a.flags == 1) ? -1 : 1; });

    let notAttending = peopleArray
      .filter((person) => { return person.flags != 1; })
      .sort((a, b) => { return (a.flags == 1) ? -1 : 1; });

    peopleArray = attending.concat(notAttending);
  }

  deletePerson(person) {
    person.status = false;
  }

  toggleOptionSelect(type) {
    if (type === 'call') {
      this.eventType = 'CALL';
      this.segment_left = 'Made Call';
      this.segment_right = 'Received Call';
    }
    else if (type === 'visit') {
      this.eventType = 'EVENT';
      this.segment_left = 'Away';
      this.segment_right = 'Home Visit';
    }
  }

  startDateChange() {
    if (this.eventEdited.type == 'visit') {
      this.eventEdited.endDate = moment(this.eventEdited.startDate).add(1, 'hours').format();
    } else if (this.eventEdited.type == 'call') {
      this.eventEdited.endDate = moment(this.eventEdited.startDate).add(15, 'minutes').format();
    }
    this.updateUI();
  }

  endDateChange() {
    if (moment(this.eventEdited.endDate).isBefore(this.eventEdited.startDate)) {
      this.eventEdited.endDate = moment(this.eventEdited.startDate).format();
    }
    this.updateUI();
  }

  updateUI() {
    this.show_req_assistance = moment().isBefore(this.eventEdited.startDate) && moment().isBefore(this.eventEdited.endDate);
    this.show_call_connected = moment().isAfter(this.eventEdited.startDate);
    this.show_include_observations = moment().isAfter(this.eventEdited.startDate) && moment().isAfter(this.eventEdited.endDate);
  }

  async save() {
    if (this.eventEdited.guid) {
      let loading: Loading = this.loadingCtrl.create({ content: 'Updating Event ...' });
      loading.present();
      let data = {};
      let properties: Array<string> = ['title', 'notes', 'flags', 'location', 'startDate', 'endDate'];
      //people, observation
      properties.forEach(property => {
        if (property === 'flags')
          data[property] = this.eventProvider.eventProduceFlag(false, this.requestAssistance, this.callConnected, this.optionsSelected);
        else
          data[property] = this.eventEdited[property];
      });

      let people_array = [];
      for (let person of this.eventEdited.people) {
        if (person.status) {
          let obj = {};
          obj['flags'] = person['flags'];
          obj['identifier'] = person['identifier'];
          obj['name'] = person['name'];
          if (person['addedDate']) obj['addedDate'] = person['addedDate'];
          else obj['addedDate'] = moment().format();

          if (person['acceptedDate']) obj['acceptedDate'] = person['acceptedDate'];
          if (person['declineReason']) obj['declineReason'] = person['declineReason'];
          people_array.push(obj);
        }
      }
      data['people'] = people_array;

      if (!this.eventEdited.observationSummaryGUID && this.include_observe) {
        let observationData = this.createObservationObject();
        await this.eventProvider.postObservation(observationData);
        data['observationSummaryGUID'] = observationData.guid;
      }
      await this.postOrPutEvents('PUT', data, loading);
    } else {
      let loading: Loading = this.loadingCtrl.create({  content: 'Saving...'  });
      loading.present();
      let data = {};
      data['reportedBy'] = this.sessionProvider.getUser().cognitoId;
      data['flags'] = this.eventProvider.eventProduceFlag(false, this.requestAssistance, this.callConnected, this.optionsSelected);
      data['endDate'] =  moment().format(this.eventEdited.endDate);
      data['comments'] = [];
      data['communityId'] = this.sessionProvider.getCurrentCommunityId();
      data['reportedByName'] = this.sessionProvider.getUser().name;
      data['ownerId'] = this.sessionProvider.getUser().cognitoId;
      data['ownerName'] = this.sessionProvider.getUser().name;
      data['guid'] = UUID.UUID().toUpperCase();
      data['longitude'] = 0;
      //people
      data['startDate'] =  moment().format(this.eventEdited.startDate);
      data['latitude'] = 0;
      data['type'] = this.eventEdited.type;

      let people_array = [];
      for (let person of this.eventEdited.people) {
        if (person.status) {
          let obj = {};
          if (person.identifier === data['reportedBy']) {
            obj['flags'] = 1;
            obj['acceptedDate'] = moment().format();
          } else {
            obj['flags'] = 0;
          }

          obj['identifier'] = person['identifier'];
          obj['name'] = person['name'];
          obj['addedDate'] = moment().format();
          people_array.push(obj);
        }
      }

      data['people'] = people_array;
      //Fields that exist if specified
      if(this.eventEdited.title) data['title'] = this.eventEdited.title;
      if(this.eventEdited.notes) data['notes'] = this.eventEdited.notes;
      if(this.eventEdited.location) data['location'] = this.eventEdited.location;

      if (this.include_observe) {
        let observationData = this.createObservationObject();
        await this.eventProvider.postObservation(observationData);
        data['observationSummaryGUID'] = observationData.guid;
      }
      await this.postOrPutEvents('POST', data, loading);
    }
  }

  createObservationObject() {
      let observe_guid = UUID.UUID().toUpperCase();
      for (let key in this.observation) {
        this.observation[key] = this.observation[key] / 100;
      }
      let observation_json = {
        reportedBy: this.sessionProvider.getUser().cognitoId,
        lastUpdateTimestamp: null,
        date: moment().format(),
        active: 1,
        guid: observe_guid,
        communityId: this.sessionProvider.getCurrentCommunityId(),
        reportedByName: this.sessionProvider.getUser().name,
        observations: this.observation
      };
      return observation_json;
  }

  postEvent(item, loading) {
    this.eventProvider.postEvent(item).then((result) => {
      let refreshEventsCallback = this.navParams.get('refreshEventsCallback');
      refreshEventsCallback().then(() => {
        loading.dismiss();
        this.navCtrl.pop();
      });
    });
  }

  async postOrPutEvents(type, data, loading) {
    // For POST 'data' is the entire object, For PUT 'data' is just the fields that needs to be changed
    let refreshEventsCallback = this.navParams.get('refreshEventsCallback');
    if (type === 'POST') {
      await this.eventProvider.postEvent(data);
    } else if (type === 'PUT') {
      await this.eventProvider.putEvents(this.eventEdited, data);
    }
    await refreshEventsCallback();
    loading.dismiss();
    this.navCtrl.pop();
  }

  getIcon(flag) {
    switch (flag) {
      case 0: return 'alert';
      case 1: return 'checkmark-circle';
      case 2: return 'close-circle';
      default: ;
    }
  }

  getIconColor(flag) {
    switch (flag) {
      case 0: return 'primary';
      case 1: return 'secondary';
      case 2: return 'danger';
      default: ;
    }
  }

  updatePersonFlag(flag) {
    this.person_flag = flag;
    this.eventEdited.people.forEach((person) => {
      if (person.identifier == this.sessionProvider.getUser().cognitoId) {
        person.flags = flag;
        return;
      }
    });
  }
  getLikesText() {
    if (!this.originalEvent.likesNum) return 'Like';
    else if (this.originalEvent.clickedLike) return `Remove Like (${this.originalEvent.likesNum} likes)`;
    else return `Like (${this.originalEvent.likesNum} likes)`;
  }

  getParticipantsText() {
    if (this.eventProvider.eventInPast(this.eventEdited.startDate)) {
      if (this.eventType === 'CALL') { return 'WHO WAS ON THE CALL?'; }
      else if (this.eventType === 'EVENT') { return 'WHO WAS WITH YOU?'; }
    }
    else { return 'INVITEES'; }
  }

  pressLike() {
    //Pass in original event
    this.eventProvider.toggleLike(this.originalEvent);
  }

  comments() {
    this.navCtrl.push("CommentsPage", { event: this.originalEvent }, { animate: true, direction: 'forward' });
  }

  addInvite() {
    this.navCtrl.push("AddInviteesPage", { people: this.eventEdited.people }, {});
    this.sortPeople(this.eventEdited.people);
  }
}
