import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import { Content } from 'ionic-angular';
import { Message } from '../../models/message';
import { SessionProvider } from '../../providers/session/session';
import { ImageProvider } from '../../providers/image/image';
import { UUID } from 'angular2-uuid';
import { EventProvider } from '../../providers/event/event';
import moment from 'moment';

declare var apigClientFactory: any;

@IonicPage()
@Component({
  selector: 'page-comments',
  templateUrl: 'comments.html',
})
export class CommentsPage {
  @ViewChild(Content) content: Content;
  private usr;
  private myComment;
  private msgs;
  private showSend = false;
  private currentEvent;
  private profilePictureMap: Map<string, string> = new Map<string, string>(); //<id, profile_picture_url>

  constructor(
    public imageProvider: ImageProvider,
    public sessionProvider: SessionProvider,
    public navParams: NavParams,
    public eventProvider: EventProvider) {

    this.msgs = [];
    this.usr = this.sessionProvider.getUser().name;
    this.currentEvent = this.navParams.get('event');
    this.currentEvent.comments.forEach(item => {
      let msg = new Message();
      msg.flags = item.flags;
      if(msg.flags == 0) { //Comment
        msg.message = item.comment;
      }
      msg.from = item.from;
      msg.fromName = item.fromName;
      msg.sentDate = item.date;
      this.msgs.push(msg);
    });
    this.msgs.sort((a, b)=>{ return new Date(a.sentDate).getTime() - new Date(b.sentDate).getTime(); })
    this.eventProvider.getCommunity().then(community => {
      community.members.forEach(member => {
        this.profilePictureMap.set(member.id, 'assets/icon/logoCircle.png');
        this.getMembersPicture(member.id).then(picture => {
          this.profilePictureMap.set(member.id, picture);
        });
      });
    });
  }

  getMemberIcon(id) {
    return this.profilePictureMap.get(id);
  }

  async getMembersPicture(userId) {
    let picture = 'assets/icon/logoCircle.png';
    let apigClient = apigClientFactory.newClient();
    let data = await apigClient.communityUserGet({
      cognitoId: userId,
      lastUpdateTimestamp: 0
    });
    let user = data.data.items;
    if(user.length) {
      if(user[0].imageKeyPath) {
        picture = await this.imageProvider.storeImage(user[0].imageKeyPath, 'member');
      }
    }
    return picture;
  }

  send() {
    if (this.isInvalidEntry(this.myComment)) return;
    this.pushMessage(this.myComment);
    this.myComment = "";
    setTimeout(() => {
      this.content.scrollToBottom(300);//300ms animation speed
    });
  }

  pushMessage(message) {
    let data = {
      fromName: this.sessionProvider.getUser().name,
      date: moment().format(),
      flags: 0,
      comment: this.myComment,
      from: this.sessionProvider.getUser().cognitoId,
      id: UUID.UUID().toUpperCase()
    };

    let msg = new Message();
    msg.message = data.comment;
    msg.from = data.from;
    msg.fromName = data.fromName;
    msg.sentDate = data.date;
    msg.flags = 0;
    this.msgs.push(msg);

    this.currentEvent.comments.push(data);
    this.currentEvent.commentsNum++ ;
    this.eventProvider.putEvents(this.currentEvent, {  comments: this.currentEvent.comments  }).then(res => {
      console.log("SUCCESS POSTING COMMENTS", res);
    }).catch(err => {
      console.log("ERROR IN POSTING COMMENTS", err);
    });
  }

  eventHandler(keyCode) {
    if (keyCode == 13) {
      this.send();
    }
    if (!this.isInvalidEntry(this.myComment)) {
      this.showSend = true;
    } else this.showSend = false;
  }

  isInvalidEntry(str: string): boolean {
    if (!str) return true;
    str = str.replace(/^\s+/, '').replace(/\s+$/, '');
    return str === '';
  }

  ionViewDidLoad() {}

}
