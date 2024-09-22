import { Injectable,UnauthorizedException} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { access } from 'fs';

@Injectable()
export class AuthService {
    constructor(private prisma:PrismaService,private jwt:JwtService){}

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
        return{
            access_token:this.jwt.sign(payload),
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
