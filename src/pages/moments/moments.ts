import { OnInit, Component, ViewChild } from '@angular/core';
import { Events, IonicPage, NavController, NavParams, ActionSheetController, AlertController, Slides, Platform } from 'ionic-angular';
import { SessionProvider } from '../../providers/session/session';
import { MomentsProvider } from '../../providers/moments/moments';
import { CameraProvider } from '../../providers/camera/camera';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

@IonicPage()
@Component({
  selector: 'page-moments',
  templateUrl: 'moments.html',
})
export class MomentsPage implements OnInit {
  @ViewChild(Slides) slides: Slides;

  private albums: any = [];
  private frames: any = [];
  private activeIndex: number = 0;
  private numberFramesPresent: number = 0;
  private momentsExist: boolean;
  private is_mobile: boolean;

  public slidePlayState: boolean = true; /* true if slideshow is playing, false if paused */
  public hidePlayPauseButton: boolean = true;
  private myTimeoutVar: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public sessionProvider: SessionProvider,
    private momentsProvider: MomentsProvider,
    private cameraProvider: CameraProvider,
    public actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    public events: Events,
    public plt: Platform,
    public screenOrientation: ScreenOrientation
  ) {
      this.events.subscribe('frame:sendToEmails', () => { this.setUpMoments() });
    }

  ngOnInit() {
    this.is_mobile = !this.plt.is('core') && this.plt.is('mobile');
    this.setUpMoments();
  }

  async setUpMoments() {
    this.momentsExist = this.navParams.get('haveMoments');
    this.albums = await this.momentsProvider.getMoments();

    if(this.albums.length) {
      this.albums.forEach(photo => {
        photo.loaded = false;
        this.momentsProvider.loadImage(photo).then(() => {  photo.loaded = true });
       });
      this.frames = await this.momentsProvider.getFrames();
      this.slideChanged();
    }
  }

  ionViewDidEnter() {
    this.is_mobile && this.screenOrientation.unlock(); /* Unlock screen orientation for slideshow */
  }

  ionViewDidLeave() {
    this.is_mobile && this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY); /* Lock screen back to portrait */
  }

  slideChanged() {
    this.activeIndex = this.slides.realIndex ? this.slides.realIndex : 0;
    this.numberFramesPresent = this.getFrameNumber(this.albums[this.activeIndex].guid);
  }

  checkOrientation(orientation) {
    if( orientation === this.screenOrientation.ORIENTATIONS.LANDSCAPE_PRIMARY ||
        orientation === this.screenOrientation.ORIENTATIONS.LANDSCAPE_SECONDARY)
    {
      return this.screenOrientation.ORIENTATIONS.LANDSCAPE;
    }
    return this.screenOrientation.ORIENTATIONS.PORTRAIT;
  }

  getFrameNumber(guid) {
    return this.frames.reduce((sum, frame) => {
      frame.photos.forEach(photo => {  if(photo.guid === guid) sum++; });
      return sum;
    }, 0);
  }

  addPhoto() {
    this.momentsActionSheet('addPhotoButton');
  }

  async deletePhoto() {
    if(this.albums.length) {
      await this.momentsProvider.deleteMoments(this.albums[this.activeIndex]);
      this.albums.splice(this.activeIndex, 1);
      if(this.slides.isEnd()) {
        this.slides.slideTo(0);
        this.activeIndex = 0;
      }
    }
  }

  presentDeletePhotoAlert() {
    let caption = this.albums[this.activeIndex].title;
    let alert = this.alertCtrl.create({
      title: 'Delete Photo',
      subTitle: caption + ' will be deleted.',
      buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Delete',
        cssClass: 'momentsPage-delete-photo-alert-delete-button',
        handler: data => {
          this.deletePhoto();
        }
      }],
      enableBackdropDismiss: false
    });
    alert.present();
  }

  addToFrames() {
    if(this.albums.length)
      this.navCtrl.push("SendToFramesPage", { photo: this.albums[this.activeIndex] }, { animate: true, direction: 'forward' })
  }

  private async uploadPhoto(sourceType) {
    let imageData = await this.cameraProvider.getPicture(2048, 1536, sourceType);
    this.navCtrl.push('NewPhotoPage', { croppedPhotoImageData: imageData  }, { animate: true, direction: 'forward' });
  }

  momentsActionSheet(from) {
    let buttons = [];

    if(this.is_mobile) {
      buttons.push({
        text: 'Take a Picture',
        handler: () => {
          //Take Picture Native Functionality
          this.uploadPhoto('Camera');
        }
      });

      buttons.push({
        text: 'Add Photo from Library',
        handler: () => {
          //Access User Albums -> Get Photo -> Crop -> Add caption
          this.uploadPhoto('Photolibrary');
          //this.navCtrl.setRoot("NewPhotoPage");
        }
      });
    }

    if(from === 'globalHeader') {
      buttons.push({
        text: 'Add or Edit Frames',
        handler: () => {
          //Switch to Photo Frames Page
          this.navCtrl.push( "PhotoFramesPage", {}, { animate: true, direction: 'forward' });
        }
      });
    }

    buttons.push({
      text: 'Cancel',
      role: 'cancel',
      handler: () => {}
    });

    let actionSheet = this.actionSheetCtrl.create({
      title: 'Add a Photo',
      buttons: buttons
    });
    actionSheet.present();
  }

  ionViewWillUnload() {
    this.events.unsubscribe('frame:sendToEmails');
  }

  showPlayPause() {
    if(this.slidePlayState) { /* Slideshow is playing */
      clearTimeout(this.myTimeoutVar); /* Restart counting 3 seconds */
      this.hidePlayPauseButton = false;
      this.myTimeoutVar = setTimeout(() => { this.hidePlayPauseButton = true }, 3000);
    }
  }

  playPauseSlideShow() {
    this.slidePlayState = !this.slidePlayState;

    if(this.slidePlayState) { /* When Slideshow is going to play */
      this.slides.startAutoplay()
      this.myTimeoutVar = setTimeout(() => { this.hidePlayPauseButton = true }, 1000);
      this.slides.noSwiping = true; /* Disable swiping */
    }
    else { /* When Slideshow is going to pause */
      clearTimeout(this.myTimeoutVar);
      this.hidePlayPauseButton = false;
      this.slides.stopAutoplay();
      this.slides.noSwiping = false; /* Enable swiping */
    }
  }
}
