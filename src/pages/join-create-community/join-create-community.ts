import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, Loading, AlertController } from 'ionic-angular';
import { EventProvider } from '../../providers/event/event';
import { SessionProvider } from '../../providers/session/session';
import { SyncServiceProvider } from '../../providers/sync-service/sync-service';
import { UUID } from 'angular2-uuid';
import moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-join-create-community',
  templateUrl: 'join-create-community.html',
})
export class JoinCreateCommunityPage {
  firstName: string = '';
  lastName: string = '';
  code: string = '';
  codeLength: number;

  constructor(
    public navCtrl: NavController,
    public eventProvider: EventProvider,
    public sessionProvider: SessionProvider,
    private loadingCtrl: LoadingController,
    public syncServiceProvider: SyncServiceProvider,
    private alertCtrl: AlertController) {}

  validate() {
    if ((this.firstName.length >= 2) && (this.lastName.length >= 2)) {
      document.getElementById('createBtn').removeAttribute("disabled");
    } else document.getElementById('createBtn').setAttribute("disabled", "disabled");
  }

  formatCode() {
    //If last character is '-'
    if( this.code.slice(-1) === '-') {
      this.code = this.code.slice(0, -1);
    }

    this.codeLength = this.code.length;
    if (this.codeLength == 4) {
      this.code = this.insertIntoString(this.code, '-', this.codeLength - 1)
    }

    if (this.codeLength == 7) {
      document.getElementById('codeBtn').removeAttribute("disabled");
    } else document.getElementById('codeBtn').setAttribute("disabled", "disabled");
  }

  insertIntoString(str, substr, idx) {
    let result = str.slice(0, idx) + substr + str.slice(idx);
    return result;
  }

  cancel() {
    this.navCtrl.pop();
  }

  ionViewDidLoad() {}

  showLoading(loadingText) {
    let loading: Loading = this.loadingCtrl.create({
      content: loadingText,
      dismissOnPageChange: true
    });
    loading.present();
    return loading;
  }

  async createCommunity() {
    let createLoading = this.showLoading('Creating Community ...');
    let newCommunityId = UUID.UUID().toUpperCase();
    let data = {
      emergencyNumber: "911",
      imageUrl: "https://s3.amazonaws.com/genusconnect/DefaultUserImage.jpg",
      guid: newCommunityId,
      lastName: this.lastName,
      members: [
          {
              name: this.sessionProvider.getUser().name,
              permission: "owner",
              id: this.sessionProvider.getUser().cognitoId,
              relationship: "Not Set",
              imageUrl: "https://s3.amazonaws.com/genusconnect/DefaultUserImage.jpg",
              joinedDate: moment().format()
          }
      ],
      imageSize: 0,
      resourcesJSON: "{\"resources\":[{\"identifier\":\"main\"}]}\n",
      firstName: this.firstName
    };
    let communities = this.sessionProvider.getUser().communities;
    communities[newCommunityId] = this.firstName + ' ' + this.lastName[0];
    await this.eventProvider.postCommunity(data)
    await this.eventProvider.putUser({  communities: communities  });
    createLoading.dismiss();
    this.navCtrl.setRoot("DashboardPage", { targetCommunityId: newCommunityId });
  }

  async joinCommunity() {
    let invitation;
    try {
      invitation = await this.eventProvider.getInvite(this.code);
      if(invitation.length) {
        let loading_join = this.showLoading('Joining Community ...');
        let other_communityId = invitation[0].communityId;
        let key = 'Community_' + this.sessionProvider.getUser().cognitoId + '_' + other_communityId;
        if(this.syncServiceProvider.needsToSync(key)) {
          await this.syncServiceProvider.syncLocal(key);
        }
        let other_community = await this.eventProvider.getOtherCommunity(other_communityId);
        let members_array = other_community.members;
        other_community.members.push({
          invitedById: invitation[0].fromId, //in invitation code
          imageUrl: 'https://s3.amazonaws.com/genusconnect/DefaultUserImage.jpg',
          name: this.sessionProvider.getUser().name,
          permission: 'member',
          id: this.sessionProvider.getUser().cognitoId,
          relationship: 'Not Set',
          joinedDate: moment().format(),
          invitedByName: invitation[0].fromName
        });
        await this.eventProvider.putCommunity(other_community, { members: members_array });
        //Change User Section
        let communities = this.sessionProvider.getUser().communities;
        communities[invitation[0].communityId] = invitation[0].communityName;
        await this.eventProvider.putUser({communities: communities});
        try {
          await this.eventProvider.deleteInvite(invitation[0].communityId, invitation[0].guid);
        } catch (error) {
          console.log("Error when deleting invitation code", error);
        }
        loading_join.dismiss();
        this.navCtrl.setRoot("DashboardPage", { targetCommunityId: invitation[0].communityId });
      } else {
        this.presentInviteCodeError();
      }
    } catch(error) {
      console.log("Error On Getting Invitation:", error);
    }
  }

  presentInviteCodeError() {
    let alert = this.alertCtrl.create({
      title: 'Invite Code Error',
      message: 'That invite code either does not exist or has already been used.',
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
          handler: () => {}
        }
      ]
    });
    alert.present();
  }

}
