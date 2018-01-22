import { Injectable } from '@angular/core';
import { LoadingController, Loading  } from 'ionic-angular';
import { SessionProvider } from '../session/session';
import { CognitoUtil } from "../../providers/auth/cognito.service";
import { S3Service } from "../../providers/auth/s3.service";
import { DataServiceProvider } from "../../providers/data-service/data-service";
import { SyncServiceProvider } from "../../providers/sync-service/sync-service";
import { UUID } from 'angular2-uuid';

declare var apigClientFactory: any;
import moment from 'moment';

@Injectable()
export class EventProvider {

  constructor(
    public sessionProvider: SessionProvider,
    private s3Service: S3Service,
    private syncServiceProvider: SyncServiceProvider,
    private dataServiceProvider: DataServiceProvider,
    private loadingCtrl: LoadingController,
    public cognitoUtil: CognitoUtil) {
  }

  async getUser() {
    let key = await this.buildKey('User');
    return await this.dataServiceProvider.getDocument(key);
  }

  async getCommunity() {
    let key = await this.buildKey('Community', true);
    return await this.dataServiceProvider.getDocument(key);
  }

  async getOtherCommunity(communityId) {
    let key = await this.buildKey('Community');
    key += '_' + communityId;
    return await this.dataServiceProvider.getDocument(key);
  }

  async getCommunities() {
    let key = await this.buildKey('Community');
    return await this.dataServiceProvider.getDocumentsByKey(key);
  }

  async getObservations() {
    let key = await this.buildKey('Observation', true);
    return await this.dataServiceProvider.getDocumentsByKey(key);
  }

  async getObservationsCategory() {
    let key = await this.buildKey('ObservationCategory', true);
    return await this.dataServiceProvider.getDocumentsByKey(key);
  }

  async getEvents(descending?: boolean) {
    let key = await this.buildKey('Event', true);
    let result = await this.dataServiceProvider.getDocumentsByKey(key);
    descending && result.reverse();
    return result;
  }

  async getMessages() {
    let key = await this.buildKey('Chat', true);
    return await this.dataServiceProvider.getDocumentsByKey(key);
  }

  private async buildKey(type: string, community?: boolean, identifier?: string) {
    let cognitoId = await this.cognitoUtil.getCognitoIdentity();
    let key = type + '_' + cognitoId;

    if(community) {
      let communityId = this.sessionProvider.getCurrentCommunityId();
      key += '_' + communityId;
    }
    if(identifier) {
      key += '_' + identifier;
    }
    return key;
  }

  async getEventsByTimeInterval(startDate, endDate, descend :boolean = false) {
    let cognitoId = this.cognitoUtil.getCognitoIdentity();
    let communityId = this.sessionProvider.getCurrentCommunityId();
    if(descend) [startDate, endDate] = [endDate, startDate];
    let startKey = 'Event_' + cognitoId + '_' + communityId + '_' + startDate;
    let endKey = 'Event_' + cognitoId + '_' + communityId + '_' + endDate;
    return await this.dataServiceProvider.getDocumentsByKey(startKey, endKey, descend);
  }

  async postEvent(item) {
    var body = JSON.stringify(item);
    let apigClient = apigClientFactory.newClient();
    await apigClient.communityEventPost({}, body, {});
    let eventExtract = await this.syncServiceProvider.extractEvent(item);
    await this.dataServiceProvider.postDocument(eventExtract);
  }

  async putEvents(event, changedField) {
    var body = JSON.stringify(changedField);
    let apigClient = apigClientFactory.newClient();
    var params = {
      id: encodeURIComponent(this.sessionProvider.getCurrentCommunityId()) + '|' + encodeURIComponent(event.guid)
    };
    await apigClient.communityEventIdPut(params, body);
    for(let key in changedField) {
      event[key] = changedField[key];
    }
    let eventExtract = await this.syncServiceProvider.extractEvent(event);
    await this.dataServiceProvider.putDocument(eventExtract);
  }

  deleteExtraProperties(event) {
    delete event._id;
    delete event._rev;
    delete event.clickedLike;
    delete event.likesNum;
    delete event.commentsNum;
    delete event.peopleNum;
    delete event.Emotional;
    delete event.Physical;
  }

  async postMessage(message) {
    var body = JSON.stringify(message);
    let apigClient = apigClientFactory.newClient();
    var params = {};
    await apigClient.communityChatPost(params, body);
    message._id = 'Chat_' + message.from + '_' + message.communityId + '_' + message.sentDate + '_' + message.guid;
    await this.dataServiceProvider.postDocument(message);
  }

  async postNickname(nickname) {
    let user = this.sessionProvider.getUser();
    let id = this.sessionProvider.getCurrentCommunityId();
    user.communities[id] = nickname;
    await this.putUser({  communities: user.communities })
    this.sessionProvider.setCurrentCommunityName(nickname);
  }

  async putUser(changedField) {
    let user = this.sessionProvider.getUser();
    let body = JSON.stringify(changedField);
    let apigClient = apigClientFactory.newClient();
    let params = { id: user.cognitoId };
    await apigClient.communityUserIdPut(params, body);
    for(let key in changedField) {
      user[key] = changedField[key];
    }
    await this.dataServiceProvider.putDocument(user);
  }

  async putCommunity(community, changedField) {
    var body = JSON.stringify(changedField);
    let apigClient = apigClientFactory.newClient();
    var params = {
      id: community.guid
    };
    await apigClient.communityCommunityIdPut(params, body);
    for(let key in changedField) {
      community[key] = changedField[key];
    }
    await this.dataServiceProvider.putDocument(community);
  }

  async postCommunity(data) {
    var body = JSON.stringify(data);
    let apigClient = apigClientFactory.newClient();
    var params = {};
    await apigClient.communityCommunityPost(params, body);
    await this.syncServiceProvider.saveCommunity(data);
  }

  async postInvitation(data) {
    var body = JSON.stringify(data);
    let apigClient = apigClientFactory.newClient();
    var params = {};
    return await apigClient.communityInvitePost(params, body);
  }

  async postObservation(data) {
    var body = JSON.stringify(data);
    let apigClient = apigClientFactory.newClient();
    var params = {};
    var result = await apigClient.communityObservationPost(params, body);
    data._id = 'Observation_' + data.reportedBy + '_' + data.communityId + '_' + data.guid;
    await this.dataServiceProvider.postDocument(data);
    return result;
  }

  async postFeedback(data) {
    var body = JSON.stringify(data);
    let apigClient = apigClientFactory.newClient();
    var params = {};
    var result = await apigClient.feedbackFeedbackPost(params, body);
    return result;
  }

  async getInvite(code) {
    let apigClient = apigClientFactory.newClient();
    var params = {
      inviteCode: code
    };
    let result = await apigClient.communityInviteGet(params);
    return result.data.items;
  }

  async deleteInvite(communityId, guid) {
    let apigClient = apigClientFactory.newClient();
    var params = {
      id: encodeURIComponent(communityId) + '|' + encodeURIComponent(guid)
    };
    return await apigClient.communityInviteIdDelete(params);
  }

  private async putUserImageLocalStorage(base64Image) {
    let user = this.sessionProvider.getUser();
    user.icon = base64Image;
    await this.dataServiceProvider.putDocument(user);
  }

  private async putCommunityImageLocalStorage(base64Image) {
    let community = await this.getCommunity();
    community.icon = base64Image;
    await this.dataServiceProvider.putDocument(community);
  }

  public async uploadUserImageS3(imageData) {
    let userId = this.sessionProvider.getUser().cognitoId;
    let userImageGuid = UUID.UUID().toUpperCase();
    let albumPhotosKey = 'users/' + userId + '/' + userImageGuid + '.jpg';
    let buf = new Buffer(imageData,'base64');
    try {
      await this.s3Service.uploadPhoto(albumPhotosKey, buf);
      let changedField = {
        imageKeyPath: `genusconnect|users/${userId}/${userImageGuid}.jpg`
      };
      await this.putUser(changedField); //Update imageKeyPath in local and remote storage
      let userPicture = 'data:image/jpeg;base64,' + imageData;
      await this.putUserImageLocalStorage(userPicture); //Update icon in local storage

      if(this.sessionProvider.getCurrentCommunityId() === this.sessionProvider.getUser().community) {
        await this.uploadCommunityImageS3(imageData, userImageGuid);
      }
      console.log("Done uploading user image to s3");
    } catch (error) {
      console.log("Error uploading Photo to S3", error);
    }
  }

  public async uploadCommunityImageS3(imageData, userImageGuid) {
    let currentCommunity = await this.getCommunity();
    let communityId = currentCommunity.guid;
    let communityImageGuid = userImageGuid ? userImageGuid : UUID.UUID().toUpperCase();
    let albumPhotosKey = 'community/' + currentCommunity.guid + '/' + communityImageGuid + '.jpg';
    let buf = new Buffer(imageData,'base64');
    try {
      await this.s3Service.uploadPhoto(albumPhotosKey, buf);
      let changedField = {
        imageKeyPath: `genusconnect|community/${communityId}/${communityImageGuid}.jpg`
      };
      let communityImage = 'data:image/jpeg;base64,' + imageData;
      await this.putCommunity(currentCommunity, changedField);
      await this.putCommunityImageLocalStorage(communityImage);
      this.sessionProvider.setCurrentCommunityIcon(communityImage);
    } catch (error) {
      console.log("Error uploading Photo to AWS", error);
    }
  }

  toggleLike(event) {
    let loading: Loading = this.loadingCtrl.create({ content: 'Saving...' });
    loading.present();
    if (event.clickedLike) {
      event.clickedLike = false;
      event.likesNum--;
      let i = event.comments.findIndex(this.locateLike, this);
      event.comments.splice(i, 1);
    } else {
      event.clickedLike = true;
      event.likesNum++;
      let data = {
        fromName: this.sessionProvider.getUser().name,
        date: moment().format(),
        flags: 1,
        from: this.sessionProvider.getUser().cognitoId,
        id: UUID.UUID().toUpperCase()
      };
      event.comments.push(data);
    }
    this.putEvents(event, { comments: event.comments }).then(res => {
      loading.dismiss();
    }).catch(err => { });
  }

  locateLike(comment) {
    return comment.from === this.sessionProvider.getUser().cognitoId && comment.flags == 1;
  }

  eventInPast(date): boolean {
    return (new Date(date)).getTime() < (new Date(Date.now())).getTime();;
  }

  // Check if this event needs assistance
  eventFlagAssistance(event) {
    return Boolean(parseInt(event.flags) >> 1 & 1);
  }

  // Check if call is connected
  eventFlagCallConnected(event) {
    return Boolean(parseInt(event.flags) >> 2 & 1);
  }

  // Check if its a home/away visit or inbound or outgoing call
  eventFlagInbound(event) {
    return Boolean(parseInt(event.flags) >> 3 & 1);
  }

  // Check if POC is present in event
  eventFlagPOCPresent(event) {
    return Boolean(parseInt(event.flags) >> 4 & 1);
  }

  eventProduceFlag(deleted: boolean, reqAssist: boolean, callConnected: boolean, inbound: boolean) {
    let flag = 0;
    let poc_present = true; //default to true
    flag = deleted ? flag | (1 << 0) : flag & ~(1 << 0);
    flag = reqAssist ? flag | (1 << 1) : flag & ~(1 << 1);
    flag = callConnected ? flag | (1 << 2) : flag & ~(1 << 2);
    flag = inbound ? flag | (1 << 3) : flag & ~(1 << 3);
    flag = poc_present ? flag | (1 << 4) : flag & ~(1 << 4);

    return flag;
  }
}
