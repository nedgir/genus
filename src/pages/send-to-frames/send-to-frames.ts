import { OnInit, Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { MomentsProvider } from '../../providers/moments/moments';
import { SessionProvider } from '../../providers/session/session';
import moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-send-to-frames',
  templateUrl: 'send-to-frames.html',
})
export class SendToFramesPage implements OnInit {
  private frames;
  private sendToFrames: any[] = [];
  private presentInFrames: any[] = [];
  private photo;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private momentsProvider: MomentsProvider,
    private sessionProvider: SessionProvider,
    public events: Events) {
    this.events.subscribe('frame:addOrEdit', () => {
      this.refreshFrames();
    });
  }

  ngOnInit() {
    this.refreshFrames();
  }

  async refreshFrames() {
    this.frames = await this.momentsProvider.getFrames();
    this.photo = this.navParams.get('photo');
    let allFrames = this.getPresentedFrames(this.photo.guid);
    this.sendToFrames = allFrames.sendToFrames;
    this.sendToFrames.forEach(frame => { frame.selected = false; });
    this.presentInFrames = allFrames.presentInFrames;
  }

  getPresentedFrames(photoGuid) {
    let returnFrames = {
      sendToFrames: [],
      presentInFrames: []
    };
    this.frames.forEach(frame => {
      let inFrame = false
      frame.photos.forEach(photo => {  if(photoGuid === photo.guid) inFrame = true;  });
      inFrame ? returnFrames.presentInFrames.push(frame) : returnFrames.sendToFrames.push(frame);
    });
    return returnFrames;
  }

  goToAddEditFrames() {
    this.navCtrl.push( "PhotoFramesPage", {}, { animate: true, direction: 'forward' });
  }

  confirm() {
    let framesToSend = [];
    this.sendToFrames.forEach(frame => {
      if(frame.selected) {
        framesToSend.push(frame);
      }
      delete frame.selected;
    });
    if(framesToSend.length) {
      this.alertSendToFrames(framesToSend);
    } else{
      this.navCtrl.pop();
    }
  }

  alertSendToFrames(framesToSend) {
    let alert = this.alertCtrl.create({
      title: 'Send to Frames',
      subTitle: `${this.photo.title} will be sent to the selected frames`,
      buttons: [
        {
          text: 'Cancel',
          handler: () => {}
        },
        {
          text: 'Confirm',
          handler: () => {
            let PromisesArray = [];
            for(let frame of framesToSend) {
              frame.photos.push({
                addedBy: this.sessionProvider.getUser().name,
                addedById: this.sessionProvider.getUser().cognitoId,
                addedDate: moment().format(),
                guid: this.photo.guid,
                title: this.photo.title
              });
              PromisesArray.push(this.momentsProvider.putFrames(frame));
            }
            Promise.all(PromisesArray).then(() => {
              this.navCtrl.pop().then(() => {
                this.events.publish("frame:sendToEmails");
              });
            });
          }
        }
      ]
    });
    alert.present();
  }

  ionViewWillUnload() {
    this.events.unsubscribe('frame:addOrEdit');
  }
}
