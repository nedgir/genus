export class User {
  _id: string;
  community: string;
  cognitoId: string;
  communities: Array<any>;
  email: string;
  firstName: string;
  imageUrl: string;
  lastName: string;
  name: string;
  devicePushArns: Array<String>;
  imageKeyPath: string;
  icon: string = "assets/icon/logoCircle.png";
}
