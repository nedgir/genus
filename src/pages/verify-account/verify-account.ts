import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { CognitoUtil } from '../../providers/auth/cognito.service';

@IonicPage()
@Component({
  selector: 'page-verify-account',
  templateUrl: 'verify-account.html',
})
export class VerifyAccountPage {
  private resource: string;
  private attributeName: string;
  private attributeValue: string;
  private verificationCode: string;
  private confirmButtonDisabled: boolean;

  constructor(

    private alertCtrl: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private cognitoUtil: CognitoUtil,

  ) {

    this.attributeName = navParams.get("attributeName");
    this.attributeValue = navParams.get("attributeValue");
    this.verificationCode = "";
    switch (this.attributeName) {
      case "email": this.resource = "confirmation"; break;
      case "phone_number": this.resource = "SMS"; break;
      default: break;
    }
    this.confirmButtonDisabled = true;

  }

  ngOnInit() {

    //Send the verification code if the attribute has not been verified.
    this.cognitoUtil.getCurrentUser().getUserAttributes((err: Error, attributes: any) => {
      if (err) {
        console.log("Error: " + err);
        return;
      }
      var verified = this.getAttribute(attributes, this.attributeName + "_verified");
      if (!verified) {
        this.sendVerificationCode();
      }
    });

  }

  /**
   * Retrieves the attribute specified.
   * @param attributes Attributes array.
   * @param attributeName Attribute required.
   */
  private getAttribute(attributes: any, attributeName: string): any {

    let auxiliar: any;

    /**
     * IF ATTRIBUTE EXISTS => ASSIGN THE VALUE, ELSE => ASSIGN NULL
     */
    if (attributes.find(attribute => attribute.getName() === attributeName)) {
      auxiliar = attributes.find(attribute => attribute.getName() === attributeName).getValue();
    } else {
      auxiliar = null;
    }

    /**
     * IF ATTRIBUTE MEANS A VERIFIED FIELD => CAST THE VALUE TO BOOLEAN, ELSE => ASSIGN IT AS STRING
     */
    if (attributeName.includes("verified")) {
      if (!auxiliar) {
        auxiliar = false;
      } else {
        auxiliar = (auxiliar == "true");
      }
    } else {
      if (!auxiliar) {
        auxiliar = "";
      }
    }

    return auxiliar;

  }

  confirm(): void {

    if (this.verificationCode) {
      var message = this.cognitoUtil.verifyAttribute(this.attributeName, this.verificationCode);
      if (!message) {
        this.navCtrl.setRoot("PersonalProfilePage", {}, { animate: true, direction: 'back' });
      } else {
        alert(message);
      }
    } else {
      alert("Provide your verification code.");
    }

  }

  private sendVerificationCode(): void {

    this.cognitoUtil.updateAttribute(this.attributeName, this.attributeValue);

    this.cognitoUtil.getCurrentUser().getUserAttributes((err: Error, attributes: any) => {
      if (err) {
        console.log("Error: " + err);
        return;
      }
    });

    this.cognitoUtil.getAttributeVerificationCode(
      this.getResource(this.attributeName),
      this.attributeName,
      this.partiallyHideData(this.attributeName, this.attributeValue),
      this.showAlert);

  }

  private getResource(attributeName: string): string {

    switch (attributeName) {
      case "email": return "confirmation";
      case "phone_number": return "SMS";
      default: return;
    }

  }

  private partiallyHideData(attributeName: string, attributeValue: String): string {

    let attributeValuePartiallyHidden: string;
    switch (attributeName) {
      case "email":
        attributeValuePartiallyHidden =
          attributeValue.substr(0, 1) + "****@" +
          attributeValue.substring(attributeValue.indexOf("@") + 1, 1) + "****" +
          attributeValue.substring(attributeValue.indexOf("."));
        break;
      case "phone_number":
        attributeValuePartiallyHidden =
          attributeValue.substr(0, 1) + "*******" +
          attributeValue.substring(attributeValue.length - 4);
        break;
      default:
        break;
    }
    return attributeValuePartiallyHidden;

  }

  private showAlert(resource: string, attributeValue: string) {

    let alert = this.alertCtrl.create({
      title: "Confirmation Sent",
      subTitle: "Your " + resource + " code was sent to " + attributeValue,
      buttons: ["OK"]
    });
    alert.present();

  }

  Back(): void {
    this.navCtrl.setRoot(
      "PersonalProfilePage",
      {},
      {
        animate: true,
        direction: 'back',
      },
    );
  }

  showConfirmButton(): void {

    this.confirmButtonDisabled = this.verificationCode.length != 6;

  }

}
