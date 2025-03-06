import { Module } from "@nestjs/common"
import { HttpModule } from "@nestjs/axios"
import { PrismaModule } from "src/prisma/prisma.module"
import { UploadImageController } from "./uploadimage.controller"
import { UploadImageService } from "./uploadimage.service"

@Module({
  imports: [HttpModule, PrismaModule],
  controllers: [UploadImageController],
  providers: [UploadImageService],
})
export class UploadImageModule {}

