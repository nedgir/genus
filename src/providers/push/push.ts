import { Injectable } from '@angular/core';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { Platform, Events } from 'ionic-angular';
import { EventProvider } from '../../providers/event/event';
import { SyncServiceProvider } from '../../providers/sync-service/sync-service';
import { SessionProvider } from '../../providers/session/session';
import { CognitoUtil } from "../../providers/auth/cognito.service";

import * as AWS from "aws-sdk/global";
import * as SNS from "aws-sdk/clients/sns";
declare var apigClientFactory: any;

@Injectable()
export class PushProvider {
  private event_syncing: boolean = false;
  public static ARN_GCM = "arn:aws:sns:us-east-1:415634793678:app/GCM/genusConnect_ionic";

  constructor(
    public platform: Platform,
    public eventProvider: EventProvider,
    public syncServiceProvider: SyncServiceProvider,
    public sessionProvider: SessionProvider,
    public cognitoUtil: CognitoUtil,
    public events: Events,
    public push: Push) {}

  initPushNotification(creds) {
    if (!this.platform.is('cordova')) {
      console.warn('Push notifications not initialized. Cordova is not available - Run in physical device');
      return;
    }
    const options: PushOptions = {
      android: {
        senderID: 'genusconnect-fafe9'
      },
      ios: {
        alert: 'true',
        badge: false,
        sound: 'true'
      },
      windows: {}
    };
    const pushObject: PushObject = this.push.init(options);
    AWS.config.credentials = creds;

    pushObject.on('registration').subscribe((data: any) => {
      this.createArn(data.registrationId).then((result: any) => {
        this.postEndpointArn(this.cognitoUtil.getCognitoIdentity(), result);
      });
    });

    pushObject.on('notification').subscribe((data: any) => {
      let communityId = data.additionalData.vendor.c;
      let table = data.additionalData.vendor.tbl;
      let key = '';
      let cognitoId = this.cognitoUtil.getCognitoIdentity();
      switch(table) {
        case 'Event':
          key = 'Event_' + cognitoId + '_' + communityId;
          if(!this.event_syncing) this.syncServiceProvider.syncLocal(key).then(() => {
            this.event_syncing = false;
          });
          this.event_syncing = true;
          break;
        case 'Chat':
          key = 'Chat_' + cognitoId + '_' + communityId;
          this.syncServiceProvider.syncLocal(key).then((items) => { this.events.publish('received:chat', items) });
          break;
        case 'Moments':
          break;
        default:
          ;
      }
    });

    pushObject.on('error').subscribe(error => console.error('Error with Push plugin' + error));
  }

  createArn(token: string): Promise<string> {
    return new Promise((resolve, reject) => {
      let sns = new SNS({apiVersion: '2010-03-31'});
      let params = {
        PlatformApplicationArn: PushProvider.ARN_GCM,
        Token: token
      };
      sns.createPlatformEndpoint(params, (err, data) => {
         if(err !== null) return reject(err);
         resolve(data.EndpointArn);
      });
    });
  }

  async postEndpointArn(cognitoId, endPoint) {
    this.sessionProvider.setCurrentDeviceArn(endPoint);
    let apigClient = apigClientFactory.newClient();
    let { data: { items: [user] }} = await apigClient.communityUserGet({
      cognitoId: cognitoId,
      lastUpdateTimestamp: 0
    });
    let index = user.devicePushArns.findIndex(arn_string => arn_string.indexOf("GCM") !== -1);
    if(index == -1) {
      user.devicePushArns.push(endPoint);    /*GCM does not exist, push to array*/
    } else {
      user.devicePushArns[index] = endPoint; /*replace arn of existing GCM*/
    }

    let body = JSON.stringify({ devicePushArns: user.devicePushArns });
    await apigClient.communityUserIdPut({ id: cognitoId }, body);
  }

  async removeDeviceArn() {
    let cognitoId = this.cognitoUtil.getCognitoIdentity();
    let apigClient = apigClientFactory.newClient();
    let { data: { items: [user] }} = await apigClient.communityUserGet({
      cognitoId: cognitoId,
      lastUpdateTimestamp: 0
    });
    let index = user.devicePushArns.findIndex(arn_string => arn_string.indexOf(this.sessionProvider.getCurrentDeviceArn()) !== -1);
    index != -1 && user.devicePushArns.splice(index, 1);
    let body = JSON.stringify({ devicePushArns: user.devicePushArns });
    await apigClient.communityUserIdPut({ id: cognitoId }, body);
  }
}
