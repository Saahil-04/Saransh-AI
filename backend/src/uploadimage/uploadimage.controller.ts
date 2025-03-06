import { Controller, Post, UseInterceptors, Req, HttpException, HttpStatus, UploadedFile, Body, ParseIntPipe, UseGuards } from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import { UploadImageService } from "./uploadimage.service"
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@Controller("upload")
export class UploadImageController {
  constructor(private readonly uploadImageService: UploadImageService) { }

  @Post("image")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor("file"))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
    @Body('sessionId') sessionId: number,
  ) {
    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }
    const userId = req.user?.userId || null;

    console.log("sessionId for the file input", sessionId);
    
    return this.uploadImageService.uploadAndProcessImage(file, sessionId, userId)
  }
}

