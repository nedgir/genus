import { Injectable } from '@angular/core';
import { S3Service } from "../../providers/auth/s3.service";

@Injectable()
export class ImageProvider {

  constructor(private s3Service: S3Service) {}

  public async storeImage(path, type) {
    if(path) {
      let targetUrl = await this.s3Service.getPicture(path, type);
      var result = await this.toDataURL(targetUrl);
      let test = result + "";
      return test.replace(/^data:binary\/octet-stream/, 'data:image/jpeg');
    }
    return null;
  }

  private toDataURL(url) {
    return new Promise(function(resolve,reject){
      var xhr = new XMLHttpRequest();
      xhr.onload = function() {
       var reader = new FileReader();
       reader.onloadend = function() {
         resolve(reader.result);
       }
       reader.readAsDataURL(xhr.response);
      };
      xhr.open('GET', url);
      xhr.responseType = 'blob';
      xhr.send();
    });
  }

  public async uploadMomentImageS3(imageData, albumPhotosKey) {
    let response;
    try {
      response = await this.s3Service.uploadMomentsPhoto(albumPhotosKey, new Buffer(imageData, 'base64'));
      console.log("Done uploading image to s3", response);
    } catch (error) {
      console.log("Error uploading Photo to S3", error);
    }
    return response;
  }
}
