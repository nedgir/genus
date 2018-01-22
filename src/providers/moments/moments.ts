import { Injectable } from '@angular/core';
import { DataServiceProvider } from "../../providers/data-service/data-service";
import { SessionProvider } from '../session/session';
import { ImageProvider } from '../image/image';
import { UUID } from 'angular2-uuid';
import moment from 'moment';
declare var apigClientFactory: any;

@Injectable()
export class MomentsProvider {

  constructor(
    private dataServiceProvider: DataServiceProvider,
    public sessionProvider: SessionProvider,
    private imageProvider: ImageProvider) {}

  async loadImage(moment) {
    if(moment.picture) return moment.picture;
    moment.picture = await this.imageProvider.storeImage(`${moment.bucket}|${moment.keyPath}`, 'moments');
    this.dataServiceProvider.putDocument(moment);
    return moment.picture;
  }

  async getMoments() {
    let key = 'Moment_' + this.sessionProvider.getCurrentCommunityId();
    let result = await this.dataServiceProvider.getDocumentsByKey(key);
    return result.reverse();
  }

  async getFrames() {
    let key = 'MomentsFrame_' + this.sessionProvider.getCurrentCommunityId();
    return await this.dataServiceProvider.getDocumentsByKey(key);
  }

  async postFrames(frame) {
    var body = JSON.stringify(frame);
    let apigClient = apigClientFactory.newClient();
    let data = (await apigClient.momentsFramePost({}, body, {})).data;
    data._id = 'MomentsFrame_' + frame.communityId + '_' + moment(frame.createdDate).toJSON() + '_' + frame.guid;
    return await this.dataServiceProvider.postDocument(data);
  }

  async putFrames(frame) {
    var body = JSON.stringify({ name: frame.name, email: frame.email, photos: frame.photos });
    let apigClient = apigClientFactory.newClient();
    var params = {
      id: encodeURIComponent(frame.communityId) + '|' + encodeURIComponent(frame.guid)
    };
    await apigClient.momentsFrameIdPut(params, body);
    return await this.dataServiceProvider.putDocument(frame);
  }

  async postMoments(caption, imageData) {
    let newImageGuid = UUID.UUID().toUpperCase();
    let newMoment = {
      title: caption,
      version: 1,
      flags: 0,
      bucket: 'intouch-mobile',
      type: 'photo',
      createdDate: moment().format(),
      creatorName: this.sessionProvider.getUser().name,
      creatorId: this.sessionProvider.getUser().cognitoId,
      communityId: this.sessionProvider.getCurrentCommunityId(),
      guid: newImageGuid
    };
    newMoment['keyPath'] =  `moments/${newMoment.communityId}/${newMoment.guid}.jpg`;
    newMoment['imageSize'] = (await this.imageProvider.uploadMomentImageS3(imageData, newMoment['keyPath'])).totalBytes;

    var body = JSON.stringify(newMoment);
    let apigClient = apigClientFactory.newClient();
    let apig_response_data = (await apigClient.momentsMomentPost({}, body, {})).data;

    newMoment['_id'] = 'Moment_' + newMoment.communityId + '_' + moment().toJSON() + '_' + newMoment.guid;
    newMoment['picture'] = 'data:image/jpeg;base64,' + imageData;
    newMoment['lastUpdateTimestamp'] = apig_response_data.lastUpdateTimestamp;

    try {
      await this.dataServiceProvider.postDocument(newMoment);
    } catch(error) {
      console.log(error);
    }
  }

  async deleteMoments(momentPicture) {
    var body = JSON.stringify({ flags: 1 });
    let apigClient = apigClientFactory.newClient();
    var params = {
      id: encodeURIComponent(this.sessionProvider.getCurrentCommunityId()) + '|' + encodeURIComponent(momentPicture.guid)
    };
    await apigClient.momentsMomentIdPut(params, body);
    await this.dataServiceProvider.removeDocument(momentPicture);
  }
}
