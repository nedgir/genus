import { Component, OnInit } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { MomentsProvider } from '../../providers/moments/moments';
import { Frame } from '../../models/frame';
import { SessionProvider } from '../../providers/session/session';

@IonicPage()
@Component({
  selector: 'page-add-edit-photo-frame',
  templateUrl: 'add-edit-photo-frame.html',
})
export class AddEditPhotoFramePage implements OnInit{
  private frame;
  private photosInFrame;
  private validEmail: boolean = false;
  private validName: boolean = false;
  private mode: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private momentsProvider: MomentsProvider,
    private sessionProvider: SessionProvider,
    public events: Events) {}

  ngOnInit() {
    this.photosInFrame = [];
    if(this.navParams.get('frame')) {
      this.frame = JSON.parse(JSON.stringify(this.navParams.get('frame')));
      this.mode = 'EDIT';
      this.momentsProvider.getMoments().then(allMoments => {
        for(let photo of this.frame.photos) {
          let foundMoment = allMoments.find(moment => moment.flags === 0 && photo.guid === moment.guid);
          if(foundMoment) {
            photo.picture = foundMoment.picture;
            this.photosInFrame.push(photo);
          }
        }
      });
    } else {
      this.frame = new Frame(this.sessionProvider.getUser(), this.sessionProvider.getCurrentCommunityId()); /* Deep Copy of frame*/
      this.mode = 'ADD';
    }
    this.validateEmail();
    this.validateName();
  }

  async save() {
    switch(this.mode) {
      case 'ADD':
        await this.momentsProvider.postFrames(this.frame);
        break;
      case 'EDIT':
        await this.momentsProvider.putFrames(this.frame);
        break;
      default:
        ;
    }
    await this.navCtrl.pop();
    this.events.publish('frame:addOrEdit');
  }

  validateEmail() {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.validEmail = re.test(this.frame.email);
  }

  validateName() {
    this.validName = this.frame.name.length >= 3;
  }
}
