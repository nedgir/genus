import { Component, OnInit } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { MomentsProvider } from '../../providers/moments/moments';

@IonicPage()
@Component({
  selector: 'page-photo-frames',
  templateUrl: 'photo-frames.html',
})
export class PhotoFramesPage implements OnInit{
  private frames;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private momentsProvider: MomentsProvider,
    public events: Events) {
      this.events.subscribe('frame:addOrEdit', () => {
        this.refreshFrames();
      });
    }

  ngOnInit() {
    this.refreshFrames();
  }

  refreshFrames() {
    this.momentsProvider.getFrames().then(frames => {
      this.frames = frames;
    });
  }

  addFrame() {
    this.navCtrl.push( "AddEditPhotoFramePage", {}, { animate: true, direction: 'forward'});
  }

  editFrame(frame) {
    this.navCtrl.push( "AddEditPhotoFramePage", { frame: frame  }, { animate: true, direction: 'forward'});
  }

  ionViewWillUnload() {
    this.events.unsubscribe('frame:addOrEdit');
  }
}
