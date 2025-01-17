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
import { SessionModule } from './session/session.module';
import { SessionController } from './session/session.controller';
import { SessionService } from './session/session.service';
 

@Module({
  imports: [HttpModule,AuthModule,PrismaModule, SessionModule],
  controllers: [ChatController, UploadfileController,SessionController],
  providers: [ChatService, UploadfileService,SessionService],
  //changed
})
export class AppModule {}
