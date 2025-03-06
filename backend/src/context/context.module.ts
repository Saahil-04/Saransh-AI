import { Module } from '@nestjs/common';
import { ContextService } from './context.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports:[PrismaModule],
  providers: [ContextService],
  exports:[ContextService]
})
export class ContextModule {}
