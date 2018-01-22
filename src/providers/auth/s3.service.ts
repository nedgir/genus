import { Injectable } from "@angular/core";
import { CognitoUtil } from "./cognito.service";
import * as AWS from "aws-sdk/global";
import * as S3 from "aws-sdk/clients/s3";

@Injectable()
export class S3Service {

  public static BUCKET_REGION = 'us-east-1';
  public static API_VERSION = '2006-03-01';
  public static BUCKET = 'genusconnect';
  BUCKET;
  // public static CLIENT_ID = '4qaoj3upkqmo91ajajkm08en7p';
  // public static REGION = 'us-east-1';

  constructor(public cognitoUtil: CognitoUtil) {}

  private getS3(): any {
    AWS.config.update({region: S3Service.BUCKET_REGION});
    let clientParams:any = {
      region: S3Service.BUCKET_REGION,
      apiVersion: S3Service.API_VERSION,
      params: {Bucket: S3Service.BUCKET}
    };
    return new S3(clientParams);
  }

  public getPicture(path, type) {
    path = path.split("|");
    this.BUCKET = path[0];
    path = path.slice(1).join("").split("/");
    let albumPhotosKey = '';
    for(let component of path) {
      if(type === 'community')  component = encodeURIComponent(component); // type = [community, user]
      albumPhotosKey = albumPhotosKey + component + '/';
    }
    albumPhotosKey = albumPhotosKey.slice(0, -1);
    var params = {
      Bucket: this.BUCKET,
      Key: albumPhotosKey
    };
    var url = this.getS3().getSignedUrl('getObject', params);
    return url;
  }

  public async uploadMomentsPhoto(albumPhotosKey, buf) {
    var params = {
      Bucket: 'intouch-mobile',
      Key: albumPhotosKey,
      Body: buf,
      ContentEncoding: 'base64',
      ContentType: 'image/jpeg'
    };
    return this.getS3().upload(params, function(err, url) {
      return err ? false : true;
    });
  }

  public async uploadPhoto(albumPhotosKey, buf) {
    var params = {
      Bucket: S3Service.BUCKET,
      Key: albumPhotosKey,
      Body: buf,
      ContentEncoding: 'base64',
      ContentType: 'image/jpeg'
    };
    return this.getS3().upload(params, function(err, url) {
      return err ? false : true;
    });
  }

  public deletePhoto(albumName, photoKey) {
    this.getS3().deleteObject({Key: photoKey}, function (err, data) {
      if (err) {
        console.log('There was an error deleting your photo: ', err.message);
        return;
      }
      console.log('Successfully deleted photo.');
    });
  }

  // public viewAlbum(albumName) {
  //   var albumPhotosKey = encodeURIComponent(environment.albumName) + '//';
  //   this.getS3().listObjects({Prefix: albumPhotosKey}, function (err, data) {
  //     if (err) {
  //       console.log('There was an error viewing your album: ' + err);
  //     }
  //   });
  // }
  // public getUserProfilePicture(cognitoId) {
  //   return new Promise((resolve) => {
  //     this.eventProvider.getUser(cognitoId).then((data) => {
  //       console.log("THIS THING",cognitoId, data);
  //       if(data.data.items[0].imageKeyPath){
  //         let array = data.data.items[0].imageKeyPath.split("/");
  //         let guid = array[array.length - 1];
  //         var albumPhotosKey = encodeURIComponent("users") + '/' +
  //         encodeURIComponent(cognitoId) + '/' +
  //         encodeURIComponent(guid);
  //         console.log("GUID", guid);
  //         var params = {
  //           Bucket: S3Service.BUCKET,
  //           Key: albumPhotosKey
  //         };
  //         var url = this.getS3().getSignedUrl('getObject', params);
  //         resolve(url);
  //       }else{
  //         resolve('assets/icon/logoCircle.png');
  //       }
  //     });
  //   });
  // }
}
