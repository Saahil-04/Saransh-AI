import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { ContextService } from 'src/context/context.service';

@Injectable()
export class ChatService {
    private readonly fastApiUrl = "http://127.0.0.1:8000"
    constructor(
        private prisma: PrismaService,
        private httpService: HttpService,
        private contextService: ContextService,
    ) { }

    async saveMessage(
        userId: number,
        sessionId: number,
        content: string,
        sender: string,
    ): Promise<{ userMessage: any; botResponse: string }> {
        let userMessage = null
        let botResponse = null

        // Validate sessionId
        const session = await this.prisma.session.findUnique({
            where: { id: sessionId },
        })

        if (!session) {
            throw new Error(`Session with ID ${sessionId} does not exist.`)
        }

        // Retrieve session context
        const sessionContext = await this.contextService.getSessionContext(sessionId, userId)
        console.log("this is the session context",sessionContext)

        // Send message to FastAPI with context
        botResponse = await this.sendMessageToFastapi(content, sessionContext)

        // Save user message
        userMessage = await this.contextService.addMessage(content, sender, sessionId, userId)

        // Save bot response
        await this.contextService.addMessage(botResponse, "bot", sessionId, userId)

        // Update session name if necessary
        if (session.name === "New Chat") {
            const newSessionName = await this.generateSessionName(content)
            await this.prisma.session.update({
                where: { id: sessionId },
                data: { name: newSessionName },
            })
        }

        console.log("Messages saved for user:", userMessage)

        return { userMessage, botResponse }
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

    async getChatHistory(userId: number, sessionId: number): Promise<any[]> {

        return this.prisma.message.findMany({
            where: {
                userId: userId,
                sessionId: sessionId,
            },
            orderBy: { createdAt: 'asc' },
        });
    }

    private async sendMessageToFastapi(text: string, context: string): Promise<string> {
        try {
            const response = await firstValueFrom(
                this.httpService.post(`${this.fastApiUrl}/chat`, {
                    text: text,
                    context: context,
                }),
            )
            return response.data.response
        } catch (error) {
            console.error("Error communicating with FastAPI:", error.message)
            throw new Error("Failed to get response from AI")
        }
    }
}

