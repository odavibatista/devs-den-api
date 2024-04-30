import { Candidate } from './candidate.entity';

describe('CandidateEntity', () => {
  it('should be defined', () => {
    expect(new Candidate()).toBeDefined();
  });
});
