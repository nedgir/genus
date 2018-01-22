import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';

@Injectable()
export class CameraProvider {

  constructor(private camera: Camera) {}

  async getPicture(targetWidth, targetHeight, sourceType) {
    let imageData;
    switch(sourceType) {
      case 'Camera':
        sourceType = this.camera.PictureSourceType.CAMERA;
        break;
      case 'Photolibrary':
        sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;
        break;
      default:
        ;
    }

    const options: CameraOptions = {
      quality: 100,
      targetWidth: targetWidth,
      targetHeight: targetHeight,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: sourceType,
      allowEdit: true,
      correctOrientation: true
    }
    try {
      imageData = await this.camera.getPicture(options);
    } catch (error) {
      console.log(error);
    }
    return imageData;
  }
}
