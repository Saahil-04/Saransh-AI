import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { UploadfileModule } from './uploadfile/uploadfile.module';
import { PrismaModule } from './prisma/prisma.module';
import { ChatController } from './chat/chat.controller';
import { UploadfileController } from './uploadfile/uploadfile.controller';
import { ChatService } from './chat/chat.service';
import { UploadfileService } from './uploadfile/uploadfile.service';
 

@Module({
  imports: [HttpModule,AuthModule,PrismaModule],
  controllers: [ChatController, UploadfileController],
  providers: [ChatService, UploadfileService],
  //changed
})
export class AppModule {}
