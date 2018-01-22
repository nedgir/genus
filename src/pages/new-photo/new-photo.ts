import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MomentsProvider } from '../../providers/moments/moments';

@IonicPage()
@Component({
  selector: 'page-new-photo',
  templateUrl: 'new-photo.html',
})
export class NewPhotoPage implements OnInit {
  private caption: string = "";
  private croppedPhotoImageData: string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private momentsProvider: MomentsProvider) {
  }

  ngOnInit() {
    this.croppedPhotoImageData = this.navParams.get('croppedPhotoImageData');
  }

  async save() {
    await this.momentsProvider.postMoments(this.caption, this.croppedPhotoImageData);
    console.log("New photo done with postMoments()");
    this.navCtrl.setRoot("MomentsPage",  {}, { animate: true, direction: "forward" });
  }
}
