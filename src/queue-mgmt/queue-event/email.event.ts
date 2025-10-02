import {
  OnQueueEvent,
  QueueEventsHost,
  QueueEventsListener,
} from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@QueueEventsListener('email-queue')
export class EmailEventsListener extends QueueEventsHost {
  private readonly emailQueue = new Queue('email-queue', {
    connection: {
      host: 'localhost', // adjust if needed
      port: 6379,
    },
  });
  @OnQueueEvent('completed')
  async onCompleted(event: { jobId: string; prev?: string }) {
    console.log(`Job with ID ${event.jobId} has been completed.`);
    try {
      const job = await this.emailQueue.getJob(event.jobId);
      if (job) {
        await job.moveToCompleted(null, job.token ?? '');
        console.log(`Removed completed job ${event.jobId}`);
      }
    } catch (error) {
      console.error(`Error removing completed job ${event.jobId}:`, error);
    }
  }

  @OnQueueEvent('failed')
  async onFailed(event: {
    jobId: string;
    prev?: string;
    failedReason: string;
  }) {
    console.error(
      `Job with ID ${event.jobId} has failed with reason: ${event.failedReason}`,
    );
    try {
      const job = await this.emailQueue.getJob(event.jobId);
      if (job) {
        //await job.remove();
        console.log(`Removed failed job ${event.jobId}`);
      }
    } catch (error) {
      console.error(`Error removing failed job ${event.jobId}:`, error);
    }
  }

  @OnQueueEvent('error')
  async onError(
    jobEvent: { jobId: string; prev?: string } | undefined,
    err: Error,
  ) {
    try {
      if (!jobEvent) {
        console.error(
          'A queue error occurred but jobEvent is undefined:',
          err.message,
        );
        return;
      }
      console.error(
        `A queue error occurred for job ${jobEvent.jobId}:`,
        err.message,
      );
      const job = await this.emailQueue.getJob(jobEvent.jobId);
      if (job) {
        console.log(`Active job data: ${JSON.stringify(job.data)}`);
      }
    } catch (error) {
      console.error(`Error processing active job:`, error);
    }
  }

  @OnQueueEvent('active')
  async onActive(event: { jobId: string; prev?: string }) {
    console.log(
      `Job with ID ${event.jobId} is now active and being processed.`,
    );
    try {
      const job = await this.emailQueue.getJob(event.jobId);
      if (job) {
        console.log(`Active job data: ${JSON.stringify(job.data)}`);
      }
    } catch (error) {
      console.error(`Error processing active job ${event.jobId}:`, error);
    }
  }

  // processing job handler
  @OnQueueEvent('progress')
  async onProcessing(event: { jobId: string; prev?: string }) {
    try {
      const job = await this.emailQueue.getJob(event.jobId);
      if (job) {
        console.log(`progessing job data: ${JSON.stringify(job.data)}`);
      }
    } catch (error) {
      console.error(`Error progessing  job ${event.jobId}:`, error);
    }
  }

  // on finished handler
  @OnQueueEvent('retries-exhausted')
  async onRetriesExhausted(event: { jobId: string; prev?: string }) {
    console.log(`Job with ID ${event.jobId} has exhausted all retries.`);
    try {
      const job = await this.emailQueue.getJob(event.jobId);
      console.log('job to be removed after exhausted all retries', job?.data);
      if (job) {
        await job.remove();
        console.log(`Removed exhausted job ${event.jobId}`);
      }
    } catch (error) {
      console.error(`Error removing exhausted job ${event.jobId}:`, error);
    }
  }

  // finished job handler
  @OnQueueEvent('drained')
  async onDrained(event: { jobId: string; prev?: string }) {
    console.log(`Job with ID ${event.jobId} has been drained from the queue.`);
    try {
      const job = await this.emailQueue.getJob(event.jobId);
      if (job) {
        await job.remove();
        console.log(`Removed drained job ${event.jobId}`);
      }
    } catch (error) {
      console.error(`Error removing drained job ${event.jobId}:`, error);
    }
  }
}
