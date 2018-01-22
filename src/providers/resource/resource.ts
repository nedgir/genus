import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { EventProvider } from '../../providers/event/event';

declare var apigClientFactory: any;

@Injectable()
export class ResourceProvider {

  constructor(
    private alertCtrl: AlertController,
    private eventProvider: EventProvider) {}


  async getResourcesById(id) {
    let result = (await apigClientFactory.newClient().resourcesIdGet({  id: id  }) );
    return result.data.name.includes('Missing/Invalid') ? null : result.data
  }

  async addCustomModule(id) {
    let result = await this.getResourcesById(id);

    if(!result) {
      let alert = this.alertCtrl.create({
        title: 'An Error Occurred',
        subTitle: 'The request module does not exist. Please check the code and try again.',
        buttons: ['Ok']
      });
      alert.present();
    } else {
      let community = await this.eventProvider.getCommunity();
      let { resources: array } = JSON.parse(community.resourcesJSON);
      array.push({ identifier: id });
      this.eventProvider.putCommunity(  community, {  resourcesJSON : JSON.stringify({ resources: array })  } ); /* edit resourcesJSON field in community*/
      return result;
    }
  }
}
