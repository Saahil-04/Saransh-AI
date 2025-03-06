import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { UploadfileModule } from './uploadfile/uploadfile.module';
import { PrismaModule } from './prisma/prisma.module';
import { SessionModule } from './session/session.module';
import { UploadImageModule } from './uploadimage/uploadimage.module';
import { ContextModule } from './context/context.module';

@Module({
  imports: [
    HttpModule,
    AuthModule,
    PrismaModule,
    SessionModule,
    ChatModule,
    UploadfileModule,
    UploadImageModule,
    ContextModule
  ],
})
export class AppModule {}