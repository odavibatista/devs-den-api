import { CompanyDTO } from './company.dto';

describe('CompanyDto', () => {
  it('should be defined', () => {
    expect(new CompanyDTO()).toBeDefined();
  });
});
