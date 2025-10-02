import { Body, Controller, Post } from '@nestjs/common';
import { QueueMgmtService } from './queue-mgmt.service';
import { ISendEmail } from './interface/email.interface';

@Controller('queue-mgmt')
export class QueueMgmtController {
  constructor(private readonly queueMgmtService: QueueMgmtService) {}
  // send email job
  @Post('send-email')
  async sendEmail(@Body('payload') data: ISendEmail[]) {
    return this.queueMgmtService.addSendEmailJob(data);
  }
}
