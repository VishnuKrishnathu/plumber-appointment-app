import { Test, TestingModule } from '@nestjs/testing';
import { PlumberService } from './plumber.service';

describe('PlumberService', () => {
  let service: PlumberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlumberService],
    }).compile();

    service = module.get<PlumberService>(PlumberService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
