import { UUID } from 'angular2-uuid';
import moment from 'moment';

export class Frame {
  photos: any[];
  version: number;
  lastUpdateTimestamp: number;
  flags: number;
  createdDate: string;
  guid: string;
  creatorName: string;
  communityId: string;
  email: string;
  name: string;
  creatorId: string;
  type: string;

  _id: string;
  _rev: string;

  constructor(user: any, communityId: string) {
    this.photos = [];
    this.version =  1;
    this.flags = 0;
    this.createdDate = moment().format();
    this.guid = UUID.UUID().toUpperCase();
    this.creatorName = user.name;
    this.communityId = communityId;
    this.email = '';
    this.name = '';
    this.creatorId = user.cognitoId;
    this.type = 'email';
  }
}
