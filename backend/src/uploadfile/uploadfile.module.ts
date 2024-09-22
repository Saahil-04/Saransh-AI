import { Module } from '@nestjs/common';
import { UploadfileController } from './uploadfile.controller';
import { UploadfileService } from './uploadfile.service';

@Module({
  controllers: [UploadfileController],
  providers: [UploadfileService]
})
export class UploadfileModule {}
