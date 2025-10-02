import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { WebsocketImplementService } from './websocket-implement.service';
import { Server, Socket } from 'socket.io';
import { MessageDto } from './dto/message.dto';
@WebSocketGateway({
  transports: ['websocket', 'polling'],
  cors: '*',
})
export class WebsocketImplementGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly websocketImplementService: WebsocketImplementService,
  ) {}
  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    console.log('WebSocket server initialized', server);
  }
  handleConnection(client: Socket, ...args: any[]) {
    console.log(
      `Client connected: ${client.id} with args: ${JSON.stringify(args)}`,
    );
  }
  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('msgToServer')
  handleMessage(@MessageBody() message: MessageDto) {
    console.log('Message received from client:', message);
    const allMessages =
      this.websocketImplementService.handleMessageConversation(message);
    this.server.emit('msgToClient', allMessages);
  }
}
