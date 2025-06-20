import { Module} from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { HttpModule } from '@nestjs/axios';
import { SessionModule } from 'src/session/session.module';
import { ContextService } from 'src/context/context.service';


@Module({
  imports:[HttpModule,SessionModule],
  controllers: [ChatController],
  providers: [ChatService,PrismaService,ContextService]
})
export class ChatModule {}
