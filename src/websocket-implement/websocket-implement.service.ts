import { Injectable } from '@nestjs/common';
import { MessageDto } from './dto/message.dto';

@Injectable()
export class WebsocketImplementService {
  messagesAll: MessageDto[] = [];
  handleMessageConversation(message: MessageDto) {
    // create list to store messages

    // add new message to list
    this.messagesAll.push(message);
    // log the message
    console.log('Received message:', this.messagesAll);
    return this.messagesAll;
  }
}
