import { Injectable } from '@angular/core';
import { SessionProvider } from '../../providers/session/session';
import { DataServiceProvider } from "../../providers/data-service/data-service";
import { SyncServiceProvider } from "../../providers/sync-service/sync-service";
import { CognitoUtil } from "../../providers/auth/cognito.service";

@Injectable()
export class CommunityProvider {

  constructor(
    public sessionProvider: SessionProvider,
    private syncServiceProvider: SyncServiceProvider,
    private dataServiceProvider: DataServiceProvider,
    private cognitoUtil: CognitoUtil
  ) {}

  async switchToNewCommunity(targetCommunityId?: string) {
    let user = this.sessionProvider.getUser();
    if(user && targetCommunityId) { /* Switching to other community */
      await this.setCommunitySession(user, targetCommunityId);
    }
    else if(!user && !targetCommunityId) { /* New Login Session, Entering app again after exit */
      await this.setUserCommunitySession();
    }
  }

  async getLastVisitCommunityId(cognitoId) {
    let key = "UserLastVisitCommunity_" + cognitoId;
    let result = await this.dataServiceProvider.getDocument(key);
    return result ? result.lastVisitCommunityId : null;
  }

  async setUserCommunitySession() {
    let cognitoId = await this.cognitoUtil.getCognitoIdentity();
    let key = 'User_' + cognitoId;
    this.syncServiceProvider.needsToSync(key) && await this.syncServiceProvider.syncLocal(key);

    let user = await this.dataServiceProvider.getDocument(key);
    this.sessionProvider.setUser(user);

    let targetCommunityId =  (  await this.getLastVisitCommunityId(cognitoId) ) || user.community;
    return await this.setCommunitySession(user, targetCommunityId);
  }

  async setCommunitySession(user, communityId) {
    let communityKey = 'Community_' + user.cognitoId + '_' + communityId;
    this.syncServiceProvider.needsToSync(communityKey) && await this.syncServiceProvider.syncLocal(communityKey);

    let community = await this.dataServiceProvider.getDocument(communityKey);

    this.sessionProvider.setCurrentCommunityId(community.guid);
    this.sessionProvider.setCurrentCommunityName(user.communities[community.guid]);
    this.sessionProvider.setCurrentCommunityIcon(community.icon);
    this.syncServiceProvider.saveUserLastVisitCommunity();
  }

  checkForUpdates(forceSync?: boolean) {
    this.updateCommunityModule(forceSync);
    this.updateMomentsModule(forceSync);
  }

  updateCommunityModule(forceSync?: boolean) {
    let cognitoId = this.sessionProvider.getUser().cognitoId;
    let communityId = this.sessionProvider.getCurrentCommunityId();
    let prefixArray = ['Observation', 'ObservationCategory', 'Event', 'Chat'];
    let eventPromise;
    let observationPromise = [];

    for(let prefix of prefixArray) {
      let key = prefix + '_' + cognitoId + '_' + communityId;

      if (forceSync || this.syncServiceProvider.needsToSync(key)) {
        let temp = this.syncServiceProvider.syncLocal(key);
        switch(prefix) {
          case 'Observation':
          case 'ObservationCategory':
            observationPromise.push(temp);
            break;
          case 'Event':
            observationPromise.push(temp);
            eventPromise = temp;
            break;
          default:
            ;
        }
      }
    }

    Promise.all(observationPromise).then(() => {
      this.syncServiceProvider.updateEventObservations();      /* Update all observation faces */
    });
    return eventPromise;
  }


  updateMomentsModule(forceSync?: boolean) {
    let prefixArray = ['Moment', 'MomentsFrame'];
    let communityId = this.sessionProvider.getCurrentCommunityId();
    let momentPromise;

    for(let prefix of prefixArray) {
      let key = prefix + '_' + communityId;

      if (forceSync || this.syncServiceProvider.needsToSync(key)) {
        let temp = this.syncServiceProvider.syncLocal(key);
        if(prefix === 'Moment') momentPromise = temp;
      }
    }

    return momentPromise;
  }

  updateAllUserComunties() {
    let user = this.sessionProvider.getUser();

    for(let communityId in user.communities) {
      let communityKey = 'Community_' + user.cognitoId + '_' + communityId;
      this.syncServiceProvider.needsToSync(communityKey) && this.syncServiceProvider.syncLocal(communityKey); /* Load all user communities in global header */
    }
  }
}
