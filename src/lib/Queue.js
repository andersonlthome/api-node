import Bee from 'bee-queue';
import CancellationMail from '../app/jobs/CancellationMail';
import VerificationAccountMail from '../app/jobs/VerificationAccountMail';
import redisConfig from '../config/redis';

const jobs = [CancellationMail, VerificationAccountMail];

class Queue {
  constructor() {
    this.queues = {};
    this.init();
  }

  init() {
    jobs.forEach(({ key, handle }) => {
      console.log(0, key, handle);
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  add(queue, job) {
    console.log(1, queue, job);
    try {
      const q = this.queues[queue].bee.createJob(job).save();
      console.log('q', q);
    } catch (error) {
      console.log('error queue: ', error);
    }
    return this.queues[queue].bee.createJob(job).save();
  }

  processQueue() {
    jobs.forEach(job => {
      console.log(2, job);
      const { bee, handle } = this.queues[job.key];
      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  handleFailure(job, err) {
    console.log(`Queue ${job.queue.name}: FAILED`, err);
  }
}

export default new Queue();
