import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from '../prisma/prisma.module';
import { UploadfileController } from './uploadfile.controller';
import { UploadfileService } from './uploadfile.service';

@Module({
  imports: [HttpModule, PrismaModule],
  controllers: [UploadfileController],
  providers: [UploadfileService]
})
export class UploadfileModule {}
