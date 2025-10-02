import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { ISendEmail } from './interface/email.interface';
@Injectable()
export class QueueMgmtService {
  constructor(@InjectQueue('email-queue') private readonly emailQueue: Queue) {}
  async addSendEmailJob(data: ISendEmail[]) {
    console.log('Adding email jobs to the queue:', data);
    const allMailQuueueAdd = Promise.all(
      data?.map(async (mail) => {
        return await this.emailQueue.add('send-email-job', mail, {
          priority: 1,
          attempts: 3,
          removeOnComplete: {
            age: 60, // keep for 1 day
            count: 1, // keep the most recent 1000 jobs
          },
          removeOnFail: {
            age: 60, // keep for 7 days
            count: 1, // keep the most recent 1000 failed jobs
          },
          lifo: false,
          stackTraceLimit: 3,
          sizeLimit: 2000,
        });
      }) ?? [],
    );
    console.log('All email jobs added to the queue', await allMailQuueueAdd);
    return await allMailQuueueAdd;
  }
}
