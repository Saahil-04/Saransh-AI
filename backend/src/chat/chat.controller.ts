import { Body, Controller, Get, Post, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('chat')

export class ChatController {
    constructor(private chatService: ChatService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    async saveMessage(@Request() req, @Body() body: { text: string }) {
        const userId = req.user?.userId || null;
        return this.chatService.saveMessage(userId, body.text, 'user');
    }

    @Get('history')
    @UseGuards(JwtAuthGuard)
    async getChatHistory(@Request() req) {
    
        return this.chatService.getChatHistory(req.user.userId);
    }

}
