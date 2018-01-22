import { Injectable } from '@angular/core';
import { Community } from '../../models/community';
import { User } from '../../models/user';

@Injectable()
export class SessionProvider {
  private selectedCommunity: Community;
  private currentCommunityID: string;
  private currentCommunityName: string;
  private currentCommunityIcon: string;
  private currentDeviceArn: string;
  private user: User;

  getCurrentDeviceArn():string {
    return this.currentDeviceArn;
  }

  getCurrentCommunityId():string {
    return this.currentCommunityID;
  }

  getCurrentCommunityName():string {
    return this.currentCommunityName;
  }

  getCurrentCommunityIcon():string {
    return this.currentCommunityIcon;
  }

  getUser(): User {
    return this.user;
  }

  setCurrentDeviceArn(arn: string) {
    this.currentDeviceArn = arn;
  }

  setCurrentCommunityId(communityId: string) {
    this.currentCommunityID = communityId;
  }

  setCurrentCommunityName(communityName: string) {
    this.currentCommunityName = communityName;
  }

  setCurrentCommunityIcon(icon: string) {
    this.currentCommunityIcon = icon;
  }

  setUser(user: User) {
    this.user = user;
  }

  clearSession(): void {
    this.currentDeviceArn = null;
    this.selectedCommunity = null;
    this.currentCommunityName = null;
    this.currentCommunityID = null;
    this.user = null;
  }
}
