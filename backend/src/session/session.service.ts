import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SessionService {
    constructor(private prisma:PrismaService){}
    
    async createSession(userId:number,sessionName:string){
        return this.prisma.session.create({
            data:{
                userId,
                name:sessionName,
                createdAt: new Date(),
            },
        });
    }
    
    async getSessionsByUser(userId:number){
        const numericUserId = typeof userId === 'string' ? parseInt(userId) : userId;
        return this.prisma.session.findMany({
            
            where:{userId:numericUserId},
            orderBy:{createdAt:'desc'},
        });
    }
    async deleteSession(sessionId: number) {
        const numericSessionId = typeof sessionId === 'string' ? parseInt(sessionId) : sessionId;
        // First, delete all messages in the session
        await this.prisma.message.deleteMany({
            where: { sessionId:numericSessionId },
        });

        // Then, delete the session
        return this.prisma.session.delete({
            where: { id: numericSessionId },
        });
    }
    
}

