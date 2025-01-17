import { Injectable,UnauthorizedException} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { access } from 'fs';
import { SessionService } from 'src/session/session.service';

@Injectable()
export class AuthService {
    constructor(
        private prisma:PrismaService,
        private readonly jwt:JwtService,
        private readonly sessionService:SessionService
    ){}

    async validateUser(username:string,password:string):Promise<any>{
        const user = await this.prisma.user.findUnique({where:{username}});
        if(user && await bcrypt.compare(password,user.password)){
            const {password,...result} = user;
            return result;
        }
        return null;
    }

    async login (user:any){
        const payload = {username:user.username,sub:user.id};

        const sessions = await this.sessionService.getSessionsByUser(user.id);
        let currentSession;
        console.log("Checking user sessions");

        if(sessions.length === 0 ){
            await this.sessionService.createSession(user.id,"New Chat");
            console.log("Session for new user Created");
        } else{
            currentSession = sessions[0];
            console.log("using existing session: ",currentSession);
        }
        console.log("siging the user with new session");
        return{
            access_token:this.jwt.sign(payload),
            sessionId: currentSession.id,
        };
    }

    async register(username:string,password:string){
        const hashedPassword = await bcrypt.hash(password,10);
        return this.prisma.user.create({
            data:{
                username,
                password:hashedPassword,
            },
        });
    }
}
