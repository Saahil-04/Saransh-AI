import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatService {
    constructor(private prisma: PrismaService, private httpService: HttpService) { }

    async saveMessage(userId: number, sessionId: number, content: string, sender: string): Promise<{ userMessage: any; botResponse: string }> {
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
                    sessionId
                },
            });

            await this.prisma.message.create({
                data: {
                    content: botResponse,
                    sender: 'bot',
                    userId,
                    sessionId

                },
            });

            const session = await this.prisma.session.findUnique({
                where: { id: sessionId },
            });
            if (session && session.name === "New Chat") {
                const newSessionName = await this.generateSessionName(content);
                await this.prisma.session.update({
                    where: { id: sessionId },
                    data: { name: newSessionName },
                });
            }


            console.log('Messages saved for authenticated user:', userMessage);
        } else {
            // For unauthenticated users, don't save any messages
            console.log('Chat processed for unauthenticated user (not saved)');
        }

        return { userMessage, botResponse };
    }

    async generateSessionName(content: string): Promise<string> {
        console.log("Sending content ",content);
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
                this.httpService.post(`${fastApiUrl}/generate_title`,payload ,{
                    headers: { 'Content-Type': 'application/json' },  // Ensure headers are set
                })
            );
            return response.data.title;
        } catch (error) {
            console.error('Error generating session title:', error.message);
            return 'Untitled Session';  // Fallback title
        }
    }

    async getChatHistory(userId: number, sessionId: number): Promise<any[]> {

        return this.prisma.message.findMany({
            where: {
                userId: userId,
                sessionId: sessionId,
            },
            orderBy: { createdAt: 'asc' },
        });
    }

    private async sendMessageToFastapi(text: string): Promise<string> {
        const fastApiUrl = 'http://127.0.0.1:8000';
        try {
            const response = await firstValueFrom(
                this.httpService.post(`${fastApiUrl}/chat`, { text: text })
            );
            return response.data.response;
        } catch (error) {
            console.error('Error communicating with FastAPI:', error.message);
            throw new Error('Failed to get response from AI');
        }
    }
}

