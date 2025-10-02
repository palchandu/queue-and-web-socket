import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import { ISendEmail } from '../interface/email.interface';

@Processor('email-queue')
export class EmailProcessor extends WorkerHost {
  private readonly emailQueue = new Queue('email-queue', {
    connection: {
      host: 'localhost', // adjust if needed
      port: 6379,
    },
  });
  process(job: Job<any, any, string>): Promise<any> {
    try {
      switch (job.name) {
        case 'send-email-job': {
          try {
            // Simulate sending email
            const payload = job.data as ISendEmail;
            console.log(
              `Sending email to ${payload.to} with subject: ${payload.subject} and body: ${payload.body} and job id: ${job.id}`,
            );
            this.handleSendEmailJob(payload);
            break;
          } catch (error) {
            console.error('Error processing email job:', error);
            throw error;
          }
        }
        case 'send-notification-job': {
          // Handle another job type
          console.log('Handling another job type');
          this.handleSendNotificationJob(job.data);
          break;
        }
        default: {
          console.log(`No handler for job name: ${job.name}`);
        }
      }
      return Promise.resolve();
    } catch (error) {
      console.error('Error processing job:', error);
      return Promise.reject(
        error instanceof Error ? error : new Error(String(error)),
      );
    }
  }
  @OnWorkerEvent('error')
  async onError(jobEvent: { jobId: string; prev?: string } | undefined) {
    try {
      console.error('Worker encountered an error:');
      if (!jobEvent) {
        console.error('Job event is undefined');
        return;
      }
      const job = await this.emailQueue.getJobState(jobEvent.jobId);
      console.error(`Error occurred for job ${JSON.stringify(job)}:`);
      if (job) {
        console.log(`Active job data: ${JSON.stringify(job)}`);
      }
    } catch (error) {
      console.error('Error in onError handler:', error);
    }
  }
  private handleSendEmailJob(payload: ISendEmail): void {
    // Simulate sending email
    console.log(`Email sent  to ${payload.to}`);
  }

  private handleSendNotificationJob(payload: any): void {
    // Handle notification job
    console.log('Handling notification job with payload:', payload);
  }
}
