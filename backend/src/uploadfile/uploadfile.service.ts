import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable, ParseIntPipe } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import * as FormData from 'form-data';

@Injectable()
export class UploadfileService {
    constructor(
        private prisma: PrismaService,
        private httpService: HttpService,
    ) { }

    async uploadAndProcessPdf(file: Express.Multer.File, sessionId: number, userId?: number): Promise<{ userMessage: any, botResponse: string }> {
        if (file.mimetype !== 'application/pdf') {
            throw new HttpException('Invalid file type. Only PDF files are allowed.', HttpStatus.BAD_REQUEST);
        }
        const userInput = `📄${file.originalname}`;
        const numericSessionId = Number(sessionId);
        try {

            const pdfSummary = await this.sendPdfToFastapi(file);
            const userMessage = await this.prisma.message.create({
                data: {
                    content: userInput,
                    sender: 'user',
                    userId,
                    sessionId: numericSessionId

                },
            });

            console.log('Userid', userId);
            if (userId) {

                console.log('Saving user message to the database for userId:', userId);
                // Save the PDF summary as a message for authenticated users
                await this.prisma.message.create({
                    data: {
                        content: pdfSummary,
                        sender: 'bot',
                        userId,
                        sessionId: numericSessionId,
                    },
                });

                const session = await this.prisma.session.findUnique({
                    where: { id: numericSessionId },
                });
                if (session && session.name === "New Chat") {
                    const newSessionName = await this.generateSessionName(pdfSummary);
                    await this.prisma.session.update({
                        where: { id: numericSessionId },
                        data: { name: newSessionName },
                    });
                }
            }

            return { userMessage, botResponse: pdfSummary };
        } catch (error) {
            console.error('Error processing PDF file:', error.message);
            throw new HttpException('Failed to process PDF file.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async generateSessionName(content: string): Promise<string> {
        console.log("Sending content ", content);
        const fastApiUrl = 'http://127.0.0.1:8000';
        // Clean the string content: replace newlines and extra quotes
        const cleanedContent = content.replace(/\n/g, ' ').replace(/['"]+/g, '');  // Remove single/double quotes

        const payload = {
            content: cleanedContent
        };

        console.log('Sending Payload:', JSON.stringify(payload));  // Debug the payload
        try {

            console.log("INSIDE TRY STATEMENT");
            const response = await firstValueFrom(
                this.httpService.post(`${fastApiUrl}/generate_title`, payload, {
                    headers: { 'Content-Type': 'application/json' },  // Ensure headers are set
                })
            );
            return response.data.title;
        } catch (error) {
            console.error('Error generating session title:', error.message);
            return 'Untitled Session';  // Fallback title
        }
    }
    private async sendPdfToFastapi(file: Express.Multer.File): Promise<string> {
        const fastApiUrl = 'http://127.0.0.1:8000/upload_pdf';
        const formData = new FormData();
        formData.append('file', file.buffer, {
            filename: file.originalname,
            contentType: file.mimetype,
        });
        console.log("this is the formData", formData);

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
