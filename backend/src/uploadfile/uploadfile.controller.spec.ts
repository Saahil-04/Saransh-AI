import { Test, TestingModule } from '@nestjs/testing';
import { UploadfileController } from './uploadfile.controller';

describe('UploadfileController', () => {
  let controller: UploadfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadfileController],
    }).compile();

    controller = module.get<UploadfileController>(UploadfileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
