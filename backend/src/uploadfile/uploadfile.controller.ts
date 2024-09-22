import { Controller, Post, UploadedFile, UseInterceptors, Req, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadfileService } from './uploadfile.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('upload')
export class UploadfileController {
    constructor(private readonly uploadfileService: UploadfileService) {}

    @Post('pdf')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    async uploadPdf(@UploadedFile() file: Express.Multer.File, @Req() req) {
        if (!file) {
            throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
        }

        const userId = req.user?.userId || null; // Assuming you have user info in the request object
        

        return this.uploadfileService.uploadAndProcessPdf(file, userId);
    }
}
