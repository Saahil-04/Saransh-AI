import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import * as FormData from 'form-data';

@Injectable()
export class UploadfileService {
    constructor(
        private prisma: PrismaService,
        private httpService: HttpService,
    ) {}

    async uploadAndProcessPdf(file: Express.Multer.File, userId?: number): Promise<{ userMessage:any,botResponse: string }> {
        if (file.mimetype !== 'application/pdf') {
            throw new HttpException('Invalid file type. Only PDF files are allowed.', HttpStatus.BAD_REQUEST);
        }
        const userInput = `📄${file.originalname}`;
        try {
          
            const pdfSummary = await this.sendPdfToFastapi(file);
            console.log('Saving user message to the database for userId:', userId);
              const userMessage = await this.prisma.message.create({
                  data: {
                      content: userInput,
                      sender: 'user',
                      userId,
                  },
              });

            console.log('Userid',userId);
            if (userId) {
              
                // Save the PDF summary as a message for authenticated users
                await this.prisma.message.create({
                    data: {
                        content: pdfSummary,
                        sender: 'bot',
                        userId,
                    },
                });
            }

            return { userMessage,botResponse: pdfSummary };
        } catch (error) {
            console.error('Error processing PDF file:', error.message);
            throw new HttpException('Failed to process PDF file.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private async sendPdfToFastapi(file: Express.Multer.File): Promise<string> {
        const fastApiUrl = 'http://127.0.0.1:8000/upload_pdf';
        const formData = new FormData();
        formData.append('file', file.buffer, {
            filename: file.originalname,
            contentType: file.mimetype,
        });
        console.log("this is the formData",formData);

        try {
            const response = await firstValueFrom(
                this.httpService.post(fastApiUrl, formData, {
                    headers: formData.getHeaders(),
                })
            );
            return response.data.response;
        } catch (error) {
            console.error('Error communicating with FastAPI:', error.message);
            throw new Error('Failed to process PDF with FastAPI');
        }
    }
}
