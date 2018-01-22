import { Injectable } from "@angular/core";
import { CognitoUserPool, CognitoUser, CognitoUserAttribute } from "amazon-cognito-identity-js";
import * as AWS from "aws-sdk/global";
import * as awsservice from "aws-sdk/lib/service";
import * as CognitoIdentity from "aws-sdk/clients/cognitoidentity";

export interface CognitoCallback {
  cognitoCallback(message: string, result: any): void;
}

export interface LoggedInCallback {
  isLoggedIn(message: string, loggedIn: boolean): void;
}

export interface Callback {
  callback(): void;
  callbackWithParam(result: any): void;
}

@Injectable()
export class CognitoUtil {
  public static IDENTITY_POOL_ID = 'us-east-1:195135c4-f28a-4930-8fbd-4e78992b3e52';
  public static USER_POOL_ID = 'us-east-1_3SWWdE0KR';
  public static CLIENT_ID = '4qaoj3upkqmo91ajajkm08en7p';
  public static REGION = 'us-east-1';

  public static POOL_DATA:any = {
    UserPoolId: CognitoUtil.USER_POOL_ID,
    ClientId: CognitoUtil.CLIENT_ID
  };

  public cognitoCreds: AWS.CognitoIdentityCredentials;

  getUserPool() {
    return new CognitoUserPool(CognitoUtil.POOL_DATA);
  }

  getCurrentUser() {
    let cognitoUser: CognitoUser = this.getUserPool().getCurrentUser();
    if (cognitoUser != null) {
      cognitoUser.getSession(function (err, session) {
        if (err) {
          console.log(err);
          return;
        }
      });
    }
    return cognitoUser;
  }

  setCognitoCreds(creds: AWS.CognitoIdentityCredentials) {
    this.cognitoCreds = creds;
  }

  getCognitoCreds() {
    return this.cognitoCreds;
  }

  buildCognitoCreds(idTokenJwt: string) {
      let url = 'cognito-idp.' + CognitoUtil.REGION.toLowerCase() + '.amazonaws.com/' + CognitoUtil.USER_POOL_ID;
      let logins: CognitoIdentity.LoginsMap = {};
      logins[url] = idTokenJwt;
      let params = {
          IdentityPoolId: CognitoUtil.IDENTITY_POOL_ID,
          Logins: logins
      };
      let serviceConfigs : awsservice.ServiceConfigurationOptions = {};
      let creds = new AWS.CognitoIdentityCredentials(params, serviceConfigs);
      this.setCognitoCreds(creds);
      return creds;
  }

  getCognitoIdentity(): string {
    return this.cognitoCreds.identityId;
  }

  getAccessToken(callback: Callback): void {
    if (callback == null) {
      throw("CognitoUtil: callback in getAccessToken is null...returning");
    }
    if (this.getCurrentUser() != null) {
      this.getCurrentUser().getSession(function (err, session) {
        if (err) {
          callback.callbackWithParam(null);
        } else {
          if (session.isValid()) {
            callback.callbackWithParam(session.getAccessToken().getJwtToken());
          }
        }
      });
    } else {
      callback.callbackWithParam(null);
    }
  }

  getIdToken(callback: Callback): void {
    if (callback == null) {
      throw("CognitoUtil: callback in getIdToken is null...returning");
    }
    if (this.getCurrentUser() != null) {
      this.getCurrentUser().getSession(function (err, session) {
        if (err) {
          callback.callbackWithParam(null);
        } else {
          if (session.isValid()) {
            callback.callbackWithParam(session.getIdToken().getJwtToken());
          }
        }
      });
    } else {
      callback.callbackWithParam(null);
    }
  }

  getRefreshToken(callback: Callback): void {
    if (callback == null) {
      throw("CognitoUtil: callback in getRefreshToken is null...returning");
    }
    if (this.getCurrentUser() != null) {
      this.getCurrentUser().getSession(function (err, session) {
        if (err) {
          callback.callbackWithParam(null);
        } else {
          if (session.isValid()) {
            callback.callbackWithParam(session.getRefreshToken());
          }
        }
      });
    } else {
      callback.callbackWithParam(null);
    }
  }

  refresh(): void {
    this.getCurrentUser().getSession(function (err, session) {
      if (err) {
        console.log("CognitoUtil: Can't set the credentials:" + err);
      } else {
        if (session.isValid()) {
          console.log("CognitoUtil: refreshed successfully");
        } else {
          console.log("CognitoUtil: refreshed but session is still not valid");
        }
      }
    });
  }

  /**
   * Updates user attributes for an authenticated user.
   * @param attributeName Attribute name.
   * @param attributeValue Attribute value.
   */
  public updateAttribute(attributeName: string, attributeValue: string): void {
    var attributeList = [];
    var attribute = {
      Name: attributeName,
      Value: attributeValue
    };
    var attributeAux = new CognitoUserAttribute(attribute);
    attributeList.push(attributeAux);

    this.getCurrentUser().updateAttributes(attributeList, (err, result) => {
      if (err) {
        console.log("Error: " + err);
        return;
      }
      // console.log('call result: ' + result);
    });
  }

  /**
   * Deletes user attributes for an authenticated user.
   * @param attributeName Attribute name.
   */
  public deleteAttribute(attributeName: string): void {
    var attributeList = [];
    attributeList.push(attributeName);
    this.getCurrentUser().deleteAttributes(attributeList, (err, result) => {
      if (err) {
        alert(err);
        return;
      }
      // console.log('call result: ' + result);
    });
  }

  /**
   * Verifies user attribute for an authenticated user.
   * @param attributeName Attribute being confirmed.
   * @param confirmationCode Code entered by user.
   */
  public verifyAttribute(attributeName: string, verificationCode: string): Error {
    let error: Error = null;
    this.getCurrentUser().verifyAttribute(attributeName, verificationCode, {
      onSuccess: () => { error = null; },
      onFailure: (err) => { error = err; }
    });
    return error;
  }//VERIFIES "SETS TRUE" AN ATTRIBUTE (phone_number_verified o email_verified).

  /**
   * Retrieves verification code for an attribute of an authenticated user.
   * @param attributeName Attribute to asign the verification code.
   */
  public getAttributeVerificationCode(
    resource: string,
    attributeName: string,
    attributeValue: string,
    showAlert: (resource: string, attributeValue: String) => void) {

    this.getCurrentUser().getAttributeVerificationCode(attributeName, {
      onSuccess: () => { showAlert(resource, attributeValue); },//SHOW ALERT OF CONFIRMATION CODE SUCCESSFULLY SENT.
      onFailure: (err) => { alert(err); },//ERROR HANDLING.
      inputVerificationCode: (data) => { }//HERE YOU CAN DISPLAY A PROMPT/ALERT TO RETRIEVE THE USER'S VERIFICATION CODE INPUT.
    });

  }//GETS VERIFICATION CODE FOR A PARTICULAR ATTRIBUTE (phone_number o email).

  /**
   * Retrieves an attribute for an authenticated user.
   * @param attributeName Attribute name.
   */
  public retrieveAttribute(attributeName: string): string {
    return this.retrieveAttributes().find(r => r.getName() === attributeName).getValue();
  }

  /**
   * Retrieves attributes for an authenticated user.
   * @param attributeName Attribute name.
   */
  public retrieveAttributes() {
    let attributesAux: CognitoUserAttribute[];
    this.getCurrentUser().getUserAttributes(async (err: Error, attributes: CognitoUserAttribute[]) => {
      if (err) {
        console.log("Error: " + err);
        return;
      }
      attributesAux = await attributes;
    });
    return attributesAux;
  }

  /**
   * Resends a confirmation code via SMS that confirms the registration for an unauthenticated user.
   */
  public resendConfirmation(callback: Callback): void {
    this.getCurrentUser().resendConfirmationCode((err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      alert("Confirmation Sent");
    });
  }//RESEND VERIFICATION CODE VIA SMS

  /**
   * Changes the current password of an authenticated user.
   * @param oldPassword The current password.
   * @param newPassword The requested new password.
   * @param callback Called on success or error.
   */
  public changePassword(oldPassword: string, newPassword: string, callback: any): void {
    this.getCurrentUser().changePassword(oldPassword, newPassword, callback);
  }

  /**
   * Starts and completes a forgotten password flow for an unauthenticated user.
   */
  public recoverPassword(userName: string, callback: any) {
    this.getUnauthenticatedUser(userName).forgotPassword(callback);
  }

  /**
   * Gets access for an unauthenticated registered user.
   * @param userName Email account.
   */
  public getUnauthenticatedUser(userName: string): CognitoUser {
    var userPool = this.getUserPool();
    var userData = {
      Username: userName,
      Pool: userPool
    };
    return new CognitoUser(userData);
  }

}
