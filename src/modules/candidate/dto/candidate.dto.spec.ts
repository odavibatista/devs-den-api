import { CreateCandidateDTO } from './candidate.dto';

describe('CandidateDto', () => {
  it('should be defined', () => {
    expect(new CreateCandidateDTO()).toBeDefined();
  });
});
