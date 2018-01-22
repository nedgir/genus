import {Injectable} from "@angular/core";
import {Callback, CognitoUtil} from "./cognito.service";
import * as AWS from "aws-sdk/global";

@Injectable()
export class AwsUtil {
    public static firstLogin: boolean = false;
    public static runningInit: boolean = false;

    constructor(public cognitoUtil: CognitoUtil) {
        AWS.config.region = CognitoUtil.REGION;
    }

    initAwsService(callback: Callback, isLoggedIn: boolean, idToken: string) {
        if (AwsUtil.runningInit) {
            if (callback != null) {
                callback.callback();
                callback.callbackWithParam(null);
            }
            return;
        }
        AwsUtil.runningInit = true;
        let mythis = this;
        if (isLoggedIn)
            mythis.setupAWS(isLoggedIn, callback, idToken);
    }

    setupAWS(isLoggedIn: boolean, callback: Callback, idToken: string): void {
        if (isLoggedIn) {
            this.addCognitoCredentials(idToken);
        }

        if (callback != null) {
            callback.callback();
            callback.callbackWithParam(null);
        }

        AwsUtil.runningInit = false;
    }

    addCognitoCredentials(idTokenJwt: string): void {
        let creds = this.cognitoUtil.buildCognitoCreds(idTokenJwt);
        AWS.config.credentials = creds;
        creds.get(function (err) {
            if (!err) {
                if (AwsUtil.firstLogin) {
                    this.ddb.writeLogEntry("login");
                    AwsUtil.firstLogin = false;
                }
            }
        });
    }

    static getCognitoParametersForIdConsolidation(idTokenJwt: string): {} {
        let url = 'cognito-idp.' + CognitoUtil.REGION.toLowerCase() + '.amazonaws.com/' + CognitoUtil.USER_POOL_ID;
        let logins: Array<string> = [];
        logins[url] = idTokenJwt;
        let params = {
            IdentityPoolId: CognitoUtil.IDENTITY_POOL_ID, /* required */
            Logins: logins
        };

        return params;
    }
}
