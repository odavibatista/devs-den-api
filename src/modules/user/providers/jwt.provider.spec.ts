import { Test, TestingModule } from '@nestjs/testing';
import { JWTProvider } from './JWT.provider';

describe('JwtProvider', () => {
  let provider: JWTProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JWTProvider],
    }).compile();

    provider = module.get<JWTProvider>(JWTProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
