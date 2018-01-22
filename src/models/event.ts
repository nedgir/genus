export class Event {
  //Self defined properties
  _id: string;
  _rev: string;
  table: string;
  comments: any;
  commentsNum: number;
  likesNum: number;
  peopleNum: string;
  clickedLike: boolean;
  Emotional: string;
  Physical: string;
  //Properties of backend events
  communityId: string;
  endDate: string;
  flags: number;
  guid: string;
  lastUpdatedTimestamp: string;
  latitude: string;
  location: string;
  longitude: string;
  observationSummaryGUID: string;
  ownerId: string;
  ownerName: string;
  people: any;
  reportedBy: string;
  reportedByName: string;
  startDate: string;
  title: string;
  type: string;
  notes: string;
}
