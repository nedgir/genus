import { Injectable } from '@angular/core';
import { CognitoCallback, CognitoUtil, LoggedInCallback } from "./cognito.service";
import { AuthenticationDetails, CognitoUser, CognitoUserAttribute, CognitoUserPool } from "amazon-cognito-identity-js";
import { RegistrationUser } from '../../models/registration-user';
import { Events } from 'ionic-angular';
import { SessionProvider } from '../../providers/session/session';
import { PushProvider } from '../../providers/push/push';

import * as AWS from "aws-sdk/global";
import * as STS from "aws-sdk/clients/sts";

declare var apigClientFactory: any;

@Injectable()
export class AuthProvider {

  constructor(public events:Events,
    public cognitoUtil: CognitoUtil,
    public sessionProvider: SessionProvider,
    public pushProvider: PushProvider) { }

  authenticate(username: string, password: string, callback: CognitoCallback) {
    let authenticationData = {
      Username: username,
      Password: password,
    };
    let authenticationDetails = new AuthenticationDetails(authenticationData);

    let userData = {
      Username: username,
      Pool: this.cognitoUtil.getUserPool()
    };

    let cognitoUser = new CognitoUser(userData);
    var self = this;

    cognitoUser.authenticateUser(authenticationDetails, {
      newPasswordRequired: function(userAttributes, requiredAttributes) {
        callback.cognitoCallback('User needs to set password.', null);
      },
      onSuccess: result => {
        let creds = self.cognitoUtil.buildCognitoCreds(result.getIdToken().getJwtToken());
        AWS.config.credentials = creds;
        let clientParams: any = {};
        let sts = new STS(clientParams);
        sts.getCallerIdentity((err, data) => {
          let apigClient = apigClientFactory.newClient();
          apigClient.communityLoadorcreateuserPost([], { username: username, cognitoId: this.cognitoUtil.getCognitoIdentity() }).then(res => {
            callback.cognitoCallback(null, creds); //Has to happen after here to prevent race condition
          });
        });
      },
      onFailure: function(err) {
        callback.cognitoCallback(err.message, null);
      },
    });
  }

  async logout() {
    await this.pushProvider.removeDeviceArn();
    this.sessionProvider.clearSession();
    this.cognitoUtil.getCurrentUser().signOut();
    localStorage.clear();
  }

  register(user: RegistrationUser, callback: CognitoCallback): void {
    console.log("UserRegistrationService: user is " + user);

    var cognitoParams = {
      UserPoolId: 'us-east-1_3SWWdE0KR',
      ClientId: '4qaoj3upkqmo91ajajkm08en7p',
      IdentityPoolId: 'us-east-1:195135c4-f28a-4930-8fbd-4e78992b3e52',
    }

    //getUserPool
    var userPool = new CognitoUserPool({
      UserPoolId: cognitoParams.UserPoolId,
      ClientId: cognitoParams.ClientId // Your client id here
    });

    var attributes = [];
    attributes.push(new CognitoUserAttribute({
      Name: 'email',
      Value: user.email.toLowerCase()
    }));

    attributes.push(new CognitoUserAttribute({
      Name: 'given_name',
      Value: user.firstName
    }));

    attributes.push(new CognitoUserAttribute({
      Name: 'family_name',
      Value: user.lastName
    }));

    userPool.signUp(user.email, user.password, attributes, null, (err, data) => {
      if (err) {
        alert(err);
      } else {
        this.events.publish('user:login', user.email, user.password);
      }
    });

  }

  isAuthenticated(callback: LoggedInCallback) {
    if (callback == null) {
      throw ("UserLoginService: Callback in isAuthenticated() cannot be null");
    }

    let cognitoUser = this.cognitoUtil.getCurrentUser();

    if (cognitoUser != null) {
      cognitoUser.getSession(function(err, session) {
        if (err) {
          callback.isLoggedIn(err, false);
        } else {
          callback.isLoggedIn(err, session.isValid());
        }
      });
    } else {
      callback.isLoggedIn("Can't retrieve the CurrentUser", false);
    }
  }
}
