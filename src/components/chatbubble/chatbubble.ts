import { Component } from '@angular/core';

@Component({
  selector: 'chat-bubble',
  inputs: ['msg: message', 'usr: user', 'showName: showName'],
  templateUrl: 'chatbubble.html',
})
export class ChatBubbleComponent {
  msg;
  usr;
  showName;
  constructor() { }
}