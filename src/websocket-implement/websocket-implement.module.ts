import { Module } from '@nestjs/common';
import { WebsocketImplementService } from './websocket-implement.service';
import { WebsocketImplementGateway } from './websocket-implement.gateway';

@Module({
  providers: [WebsocketImplementGateway, WebsocketImplementService],
})
export class WebsocketImplementModule {}
