import { Body, Controller, Delete, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { SessionService } from './session.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
 
 

@Controller('session')
export class SessionController {
    constructor(private readonly sessionService:SessionService){}

    @UseGuards(JwtAuthGuard)
    @Post()
    async createSession(@Request() req,@Body('name') sessionName:string){
        return this.sessionService.createSession(req.user.userId,sessionName);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getSessions(@Request() req) {
        console.log("This is the userId decoded from the request obj" , req.user);
        const userId = req.user.userId;
        return this.sessionService.getSessionsByUser(userId);
    }    

    @UseGuards(JwtAuthGuard)
    @Delete(':sessionId')
    async deleteSession(@Param('sessionId') sessionId: number) {
        await this.sessionService.deleteSession(sessionId);
        return { message: `Session ${sessionId} deleted successfully` };
    }

}
