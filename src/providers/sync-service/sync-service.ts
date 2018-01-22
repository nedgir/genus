import { Injectable } from '@angular/core';
import { SessionProvider } from '../session/session';
import { DataServiceProvider } from '../data-service/data-service';
import { ImageProvider } from '../image/image';
import { CognitoUtil } from "../auth/cognito.service";
import { Member } from '../../models/member';
import { User } from '../../models/user';
import { Event } from '../../models/event';
import { Community } from '../../models/community';
import moment from 'moment';
declare var apigClientFactory: any;

@Injectable()
export class SyncServiceProvider {

  lastUpdateTimesMap: Map<string, string> = new Map<string, string>();
  observationMap: Map<number, string> = new Map<number, string>();

  public FIVE_MINUTES_MILLI = 300000;

  constructor(public sessionProvider: SessionProvider,
    public imageProvider: ImageProvider,
    public dataServiceProvider: DataServiceProvider,
    public cognitoUtil: CognitoUtil) {

      this.observationMap.set(0, "assets/phy_Sad_3.svg");
      this.observationMap.set(1, "assets/phy_Sad_2.svg");
      this.observationMap.set(2, "assets/phy_Sad_1.svg");
      this.observationMap.set(3, "assets/phy_Meh.svg");
      this.observationMap.set(4, "assets/phy_Happy_1.svg");
      this.observationMap.set(5, "assets/phy_Happy_2.svg");
      this.observationMap.set(6, "assets/phy_Happy_3.svg");
    }

  needsToSync(key) {
    let lastUpdatedTime = this.lastUpdateTimesMap[key] ? this.lastUpdateTimesMap[key] : 0;
    return new Date() > new Date(lastUpdatedTime + this.FIVE_MINUTES_MILLI);
  }

  async syncLocal(key) {
    let lastUpdatedTime = this.lastUpdateTimesMap[key] ? this.lastUpdateTimesMap[key] : 0;
    this.lastUpdateTimesMap[key] = new Date().getTime();
    let apigClient = apigClientFactory.newClient();
    var params = {
      communityId: key.split("_")[2],
      lastUpdateTimestamp: lastUpdatedTime / 1000 /* Unix timestamp unit: seconds*/
    };
    if (key.startsWith("Event_")) {
      let remoteRecords = await apigClient.communityEventGet(params);
      await this.saveEventsLocally(remoteRecords.data.items);
    } else if (key.startsWith("Community_")) {

      let result = await apigClient.communityCommunityIdGet({  id: key.split("_")[2] });
      if(result && result.data)
        return await this.saveCommunity(result.data);


    } else if (key.startsWith("Chat_")) {
      let result = await apigClient.communityChatGet(params);
      return await this.saveChats(result.data.items);
    } else if (key.startsWith("Members_")) {
      return await this.saveMembers();
    } else if (key.startsWith("Moment_")) {
      params.communityId = key.split("_")[1];
      let result = await apigClient.momentsMomentGet(params);
      await this.saveMoments(result.data.items);
    } else if (key.startsWith("MomentsFrame_")) {
      params.communityId = key.split("_")[1];
      let result = await apigClient.momentsFrameGet(params);
      await this.saveMomentFrames(result.data.items);
    } else if (key.startsWith("Observation_")) {
      let result = await apigClient.communityObservationGet(params);
      await this.saveObservations(result.data.items);
    } else if (key.startsWith("ObservationCategory_")) {
      let result = await apigClient.communityObservationCategoryGet(params);
      await this.saveObservationCategories(result.data.items);
    } else if (key.startsWith("User_")) {
      let cognitoId = await this.cognitoUtil.getCognitoIdentity();
      let data = await apigClient.communityUserGet({
        cognitoId: cognitoId,
        lastUpdateTimestamp: lastUpdatedTime / 1000 /* Unix timestamp unit: seconds*/
      });
      await this.saveUser(data.data.items);
    }
  }

  private async saveMembers() {
    let communityId = this.sessionProvider.getCurrentCommunityId();
    let cognitoId = this.sessionProvider.getUser().cognitoId;
    let community = await this.dataServiceProvider.getDocument(`Community_${cognitoId}_${communityId}`);
    let members = [];
    let eventsCreateMap = await this.calculateEventsCreated(cognitoId, communityId);
    for (let member of community.members) {
      let memberViewModel = new Member();
      this.getMemberPicture(member.id).then(picture => {
        memberViewModel['icon'] = picture;
        this.dataServiceProvider.putDocument(memberViewModel);
       });
      memberViewModel['_id'] = `Members_${community.guid}_${member.id}`;
      memberViewModel['name'] = member.name;
      memberViewModel['permission'] = member.permission;
      memberViewModel['memberSince'] = member.joinedDate;
      memberViewModel['invitedByName'] = member.invitedByName;
      memberViewModel['eventsCreated'] = eventsCreateMap[member.id] ? eventsCreateMap[member.id] : 0;
      members.push(memberViewModel);
    }
    return members;
  }

async calculateEventsCreated(cognitoId, communityId) {
    let events = await this.dataServiceProvider.getDocumentsByKey(`Event_${cognitoId}_${communityId}`);
    let eventsCreateMap = {};
    events.forEach(event => {
      let memberId = event.reportedBy;
      if (!eventsCreateMap[memberId]) {
        eventsCreateMap[memberId] = 0; //initialize to zero, map <cogintoId, number of events created>
      }
      eventsCreateMap[memberId]++;
    });
    return eventsCreateMap;
  }

  async getMemberPicture(userId) {
    let picture = 'assets/icon/logoCircle.png';
    let apigClient = apigClientFactory.newClient();
    let user = (await apigClient.communityUserGet({
      cognitoId: userId,
      lastUpdateTimestamp: 0
    })).data.items;
    if (user.length && user[0].imageKeyPath) {
      picture = await this.imageProvider.storeImage(user[0].imageKeyPath, 'member');
    }
    return picture;
  }

  private async saveMoments(items) {
    items = items.filter((moment) => {  return moment.flags == 0; });
    for(let item of items) {
      item._id = 'Moment_' + this.sessionProvider.getCurrentCommunityId() + '_' + moment(item.createdDate).toJSON() + '_' + item.guid;
    }
    await this.dataServiceProvider.bulkDocuments(items);
  }

  private async saveMomentFrames(items) {
    for(let item of items) {
      item._id = 'MomentsFrame_' + this.sessionProvider.getCurrentCommunityId() + '_' + moment(item.createdDate).toJSON() + '_' + item.guid;
    }
    await this.dataServiceProvider.bulkDocuments(items);
  }

  private async saveEventsLocally(items) {
    let extractedEvents = [];
    for (let item of items) {
      var extractedEvent: any = await this.extractEvent(item);
      if(extractedEvent)
        extractedEvents.push(extractedEvent);
    }
    await this.dataServiceProvider.bulkDocuments(extractedEvents);
    return true;
  }

  public async saveCommunity(community) {
    let cognitoId = await this.cognitoUtil.getCognitoIdentity();
    let id = 'Community_' + cognitoId + '_' + community.guid;
    let data = await this.extractCommunity(community);
    let test;
    try {
      test = await this.dataServiceProvider.getDocument(id);
    } catch(error) {
      console.log(error);
    }
    if(test) {
      await this.dataServiceProvider.putDocument(data);
    } else {
      await this.dataServiceProvider.postDocument(data);
    }
  }

  private async saveChats(items) {
    let docs = [];
    for (let item of items) {
      let cognitoId = await this.cognitoUtil.getCognitoIdentity();
      let id = 'Chat_' + cognitoId + '_' + item.communityId + '_' + item.sentDate + '_' + item.guid;
      item._id = id;
      docs.push(item);
    }
    await this.dataServiceProvider.bulkDocuments(docs);
    return items;
  }

  private async saveObservations(items) {
    let docs = [];
    for (let item of items) {
      let cognitoId = await this.cognitoUtil.getCognitoIdentity();
      let communityId = this.sessionProvider.getCurrentCommunityId();
      let id = 'Observation_' + cognitoId + '_' + communityId + '_' + item.guid;
      item._id = id;
      docs.push(item);
    }
    await this.dataServiceProvider.bulkDocuments(docs);
    return true;
  }

  private async saveObservationCategories(items) {
    let categories = [];
    for (let item of items) {
      let cognitoId = await this.cognitoUtil.getCognitoIdentity();
      let communityId = this.sessionProvider.getCurrentCommunityId();
      let id = 'ObservationCategory_' + cognitoId + '_' + communityId + '_' + item.name;
      item._id = id;
      categories.push(item);
    }
    await this.dataServiceProvider.bulkDocuments(categories);
    return true;
  }

  async saveUserLastVisitCommunity() {
    let user = this.sessionProvider.getUser();
    let lastVisitCommunity =  {
      _id: "UserLastVisitCommunity_" + user.cognitoId,
      lastVisitCommunityId: this.sessionProvider.getCurrentCommunityId()
    };

    try {
      let getLastVisit = await this.dataServiceProvider.getDocument(lastVisitCommunity._id);
      getLastVisit ? await this.dataServiceProvider.putDocument(lastVisitCommunity) : await this.dataServiceProvider.postDocument(lastVisitCommunity);
    } catch(error) {
      console.log("ERROR OCCURED:", error);
    }
  }

  private async saveUser(item) {
    if (item.length) {
      let user = new User();
      user = item[0];
      user._id = "User_" + item[0].cognitoId;
      user.firstName = item[0].firstName;
      user.lastName = item[0].lastName;
      user.name = item[0].name;
      user.email = item[0].email;
      user.devicePushArns = item[0].devicePushArns;
      user.imageKeyPath = item[0].imageKeyPath;
      user.icon = "assets/icon/logoCircle.png";

      if(user.imageKeyPath) {
        user['icon'] = await this.imageProvider.storeImage(user.imageKeyPath, 'member');
      }
      try {
        let existingUser = await this.dataServiceProvider.getDocument(user._id);
        if(existingUser) {
          await this.dataServiceProvider.removeDocument(existingUser);
        }
      } catch(error) {

      }
      user.communities = item[0].communities;
      await this.dataServiceProvider.postDocument(user);
    }
  }

  async extractEvent(item){
    if (parseInt(item.flags) & 1) return null; //event with deleted flag
    let event = new Event();
    let cognitoId = await this.cognitoUtil.getCognitoIdentity();
    let communityId = item.communityId;
    event._id = 'Event_' + cognitoId + '_' + communityId + '_' + item.startDate + '_' + item.guid;
    let result = await this.dataServiceProvider.getDocument(event._id);
    if(result) {
      event._rev = result._rev;
    }
    event.comments = item.comments;
    event.commentsNum = 0;
    event.likesNum = 0;
    event.clickedLike = false;
    if (event.comments) {
      for (let comment of event.comments) {
        if (comment.flags == 0) event.commentsNum++;
        else if (comment.flags == 1) {
          event.likesNum++;
          if (comment.from === cognitoId) event.clickedLike = true;
        }
      }
    }else {
      event.comments = [];
    }
    event.communityId = item.communityId;
    event.endDate = item.endDate;
    event.flags = item.flags ? item.flags : "";
    event.guid = item.guid;
    event.lastUpdatedTimestamp = item.lastUpdatedTimestamp;
    event.latitude = item.latitude;
    if (item.location) event.location = item.location;
    event.longitude = item.longitude;
    event.observationSummaryGUID = item.observationSummaryGUID;
    event.ownerId = item.ownerId;
    event.ownerName = item.ownerName;
    event.people = item.people ? item.people : [];
    event.peopleNum = item.people ? item.people.length : 0;
    event.reportedBy = item.reportedBy;
    event.reportedByName = item.reportedByName;
    event.startDate = item.startDate;
    event.title = item.title;
    event.type = item.type;
    if (item.notes) event.notes = item.notes;
    return event;
  }

  async updateEventObservations() {
    let events = await this.dataServiceProvider.getDocumentsByKey('Event_' + this.sessionProvider.getUser().cognitoId + '_' + this.sessionProvider.getCurrentCommunityId());

    for(let event of events) {

      if (event.observationSummaryGUID) {
        let [ emo_sum, emo_count, phys_sum, phys_count ] = [ 0, 0, 0, 0 ];
        let data = await this.getSingleObservation(event.observationSummaryGUID);

          for (let key in data.observations) {
            let category = await this.getSingleObservationCategory(key);

            if(category.type === 'Emotional') {
              emo_count += category.weight;
              emo_sum += data.observations[key] * category.weight;

            } else if (category.type === 'Physical') {
              phys_count += category.weight;
              phys_sum += data.observations[key] * category.weight;
            }

            let [ val_emo, val_phys ] = [ Math.floor(emo_sum / emo_count * 7), Math.floor(phys_sum / phys_count * 7) ];

            if (val_emo == 7) val_emo = val_emo - 1;

            if (val_phys == 7) val_phys = val_phys - 1;

            [ event['Emotional'], event['Physical'] ] = [ this.observationMap.get(val_emo), this.observationMap.get(val_phys) ];
          }
      }
    }
    await this.dataServiceProvider.bulkDocuments(events);
  }

  async getSingleObservation(guid) {
    let key = 'Observation_' + this.sessionProvider.getUser().cognitoId + '_' + this.sessionProvider.getCurrentCommunityId() + '_' + guid;
    return await this.dataServiceProvider.getDocument(key);
  }

  async getSingleObservationCategory(name) {
    let key = 'ObservationCategory_' + this.sessionProvider.getUser().cognitoId + '_' + this.sessionProvider.getCurrentCommunityId() + '_' + name;
    return await this.dataServiceProvider.getDocument(key);
  }

  private async extractCommunity(item) {
    let community = new Community();
    let cognitoId = await this.cognitoUtil.getCognitoIdentity();
    community._id = 'Community_' + cognitoId + '_' + item.guid;
    community.guid = item.guid;
    community.firstName = item.firstName;
    community.lastName = item.lastName;
    community.email = item.email;
    community.phone = item.phone;
    community.emergencyNumber = item.emergencyNumber;
    community.imageKeyPath = item.imageKeyPath;
    community.imageUrl = item.imageUrl;
    community.members = item.members;
    community.resourcesJSON = item.resourcesJSON;

    if(community.imageKeyPath) {
      let icon = await this.imageProvider.storeImage(community.imageKeyPath, 'community');
      this.sessionProvider.getCurrentCommunityId() === community.guid && this.sessionProvider.setCurrentCommunityIcon(icon);
      community['icon'] = icon;
    }
    return community;
  }

}
