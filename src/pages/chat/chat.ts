import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, Content, Events } from 'ionic-angular';
import { EventProvider } from '../../providers/event/event';
import { SessionProvider } from '../../providers/session/session';
import { CognitoUtil } from "../../providers/auth/cognito.service";
import { SyncServiceProvider } from '../../providers/sync-service/sync-service';
import { Message } from '../../models/message';
import { UUID } from 'angular2-uuid';
import moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  @ViewChild(Content) content: Content;
  public msg = "";
  public usr = "";
  public msgs = [];
  private zone: NgZone;

  constructor(
    public syncServiceProvider: SyncServiceProvider,
    public eventProvider: EventProvider,
    public cognitoUtil: CognitoUtil,
    public sessionProvider: SessionProvider,
    public events: Events) {}

  ngOnInit() {
    this.zone = new NgZone({ enableLongStackTrace: false });
    this.events.subscribe('received:chat', (chats) => {
      this.zone.run(() => {
        for(let chat of chats) {
          if(chat.from != this.sessionProvider.getUser().cognitoId && chat.communityId === this.sessionProvider.getCurrentCommunityId()) {
            this.msgs.push(chat);
          }
        }
        setTimeout(() => {  this.content.scrollToBottom(300)  });
      });
    });
    this.setUpMessages();
  }

  async setUpMessages() {
    this.usr = this.sessionProvider.getUser().name;
    let key = 'Chat_' + this.sessionProvider.getUser().cognitoId + '_' + this.sessionProvider.getCurrentCommunityId();
    this.msgs = await this.eventProvider.getMessages();
    setTimeout(() => { this.content.scrollToBottom(300)  });
    let new_messages = await this.syncServiceProvider.syncLocal(key);
    new_messages.length && this.events.publish('received:chat', new_messages);
  }

  ionViewWillUnload() {
    this.events.unsubscribe('received:chat');
  }

  send() {
    if (this.isInvalidEntry(this.msg) || this.isInvalidEntry(this.usr)) return;

    let newMessage = new Message();
    newMessage.communityId = this.sessionProvider.getCurrentCommunityId();
    newMessage.guid = UUID.UUID().toUpperCase();
    newMessage.from = this.cognitoUtil.getCognitoIdentity();
    newMessage.fromName = this.sessionProvider.getUser().name;
    newMessage.message = this.msg;
    newMessage.sentDate = moment().format();
    newMessage.flags = 0;

    this.msgs.push(newMessage)
    setTimeout(() => {  this.content.scrollToBottom(300)  });
    this.eventProvider.postMessage(newMessage);
    this.msg = "";
  }

  getDays(date) {
    return Math.floor((new Date(date).getTime() / (1000 * 60 * 60 * 24)));
  }

  isInvalidEntry(str: string): boolean {
    if (!str) return true;
    str = str.replace(/^\s+/, '').replace(/\s+$/, '');
    return str === '';
  }

  shouldShowDate(i, msg1, msg2) {
    return i == 0 || (this.getDays(msg1.sentDate) != this.getDays(msg2.sentDate));
  }

  shouldShowName(i, msg1, msg2) {
    return i == 0 || (this.getDays(msg1.sentDate) != this.getDays(msg2.sentDate)) || (msg1.fromName != msg2.fromName);
  }

  getMsgClass(msg) {
    if (msg.fromName == this.usr) return 'current-user';
    else if (msg.fromName != this.usr) return 'other-user';
    else return 'error-class';
  }
}
