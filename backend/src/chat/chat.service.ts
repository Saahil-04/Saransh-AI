import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatService {
    constructor(private prisma: PrismaService, private httpService: HttpService) { }

    async saveMessage(userId: number, content: string, sender: string): Promise<{ userMessage: any; botResponse: string }> {
        let userMessage = null;
        let botResponse = null;

        // Send message to FastAPI regardless of authentication status
        botResponse = await this.sendMessageToFastapi(content);

        if (userId) {
            // For authenticated users, save both user message and bot response
            userMessage = await this.prisma.message.create({
                data: {
                    content,
                    sender,
                    userId,
                },
            });

            await this.prisma.message.create({
                data: {
                    content: botResponse,
                    sender: 'bot',
                    userId,
                },
            });

            console.log('Messages saved for authenticated user:', userMessage);
        } else {
            // For unauthenticated users, don't save any messages
            console.log('Chat processed for unauthenticated user (not saved)');
        }

        return { userMessage, botResponse };
    }

    async getChatHistory(userId: number): Promise<any[]> {
        return this.prisma.message.findMany({
            where: { userId },
            orderBy: { createdAt: 'asc' },
        });
    }

    private async sendMessageToFastapi(text: string): Promise<string> {
        const fastApiUrl = 'http://127.0.0.1:8000';
        try {
            const response = await firstValueFrom(
                this.httpService.post(`${fastApiUrl}/chat`, { text:text })
            );
            return response.data.response;
        } catch (error) {
            console.error('Error communicating with FastAPI:', error.message);
            throw new Error('Failed to get response from AI');
        }
    }
}
