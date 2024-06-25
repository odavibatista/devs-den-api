import { Test, TestingModule } from '@nestjs/testing';
import {
  ConjunctCompanyController,
  IndividualCompanyController,
} from './company.controller';

describe('CompanyController', () => {
  let conjunctController: ConjunctCompanyController;
  let individualController: IndividualCompanyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConjunctCompanyController, IndividualCompanyController],
    }).compile();

    conjunctController = module.get<ConjunctCompanyController>(
      ConjunctCompanyController,
    );
    individualController = module.get<IndividualCompanyController>(
      IndividualCompanyController,
    );
  });

  it('conjunct controller should be defined', () => {
    expect(conjunctController).toBeDefined();
  });

  it('individual controller should be defined', () => {
    expect(individualController).toBeDefined();
  });
});
