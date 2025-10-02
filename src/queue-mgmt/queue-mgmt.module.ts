import { Module } from '@nestjs/common';
import { QueueMgmtService } from './queue-mgmt.service';
import { QueueMgmtController } from './queue-mgmt.controller';
import { BullModule } from '@nestjs/bullmq';
import { EmailProcessor } from './processor/email-queue.processor';
import { EmailEventsListener } from './queue-event/email.event';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'email-queue',
      configKey: 'learning-bull-by-practice',
    }),
  ],
  controllers: [QueueMgmtController],
  providers: [QueueMgmtService, EmailProcessor, EmailEventsListener],
})
export class QueueMgmtModule {}
