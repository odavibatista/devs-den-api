import { Job } from './job.entity';

describe('JobEntity', () => {
  it('should be defined', () => {
    expect(new Job()).toBeDefined();
  });
});
