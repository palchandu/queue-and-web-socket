import { Module } from '@nestjs/common';
import { QueueMgmtModule } from './queue-mgmt/queue-mgmt.module';
import { BullModule } from '@nestjs/bullmq';
import { WebsocketImplementModule } from './websocket-implement/websocket-implement.module';

@Module({
  imports: [
    BullModule.forRoot('learning-bull-by-practice', {
      connection: {
        host: 'localhost',
        port: 6379,
        db: 0,
        keyPrefix: 'bull-learn:',
      },
    }),
    QueueMgmtModule,
    WebsocketImplementModule,
  ],
  controllers: [],
  providers: [],
})
export class RootModule {}
