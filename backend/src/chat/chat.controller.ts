import { Body, Controller, Get, ParseIntPipe, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('chat')

export class ChatController {
    constructor(private chatService: ChatService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    async saveMessage(@Request() req, @Body() body: { text: string; sessionId:number }) {
        const userId = req.user?.userId || null;
        const {text,sessionId} = body
        return this.chatService.saveMessage(userId,sessionId,text, 'user');
    }

    @Get('history')
    @UseGuards(JwtAuthGuard)
    async getChatHistory(@Request() req,@Query('sessionId', ParseIntPipe) sessionId: number) {
        // const {sessionId} = body;
        const userId = req.user.id;
        return this.chatService.getChatHistory(userId,sessionId);
    }

}
