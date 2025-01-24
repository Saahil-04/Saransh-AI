import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { access } from 'fs';
import { SessionService } from 'src/session/session.service';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private readonly jwt: JwtService,
        private readonly sessionService: SessionService
    ) { }

    async validateUser(identifier: string, password: string): Promise<any> {
        const user = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { username: identifier },
                    { email: identifier },
                ],
            },
        });
        if (user && await bcrypt.compare(password, user.password)) {
            const { password, ...result } = user;
    
            // Determine whether the identifier matches the username or email
            // const matchedField = user.username === identifier ? user.username : user.email;
    
            return { ...result, username: user.username };
        }
        return null;
    }

    async login(user: any) {
        const payload = { username: user.username, sub: user.id };

        const sessions = await this.sessionService.getSessionsByUser(user.id);
        let currentSession;
        console.log("Checking user sessions");

        if (sessions.length === 0) {
            await this.sessionService.createSession(user.id, "New Chat");
            console.log("Session for new user Created");
        } else {
            currentSession = sessions[0];
            console.log("using existing session: ", currentSession);
        }
        console.log("siging the user with new session");
        console.log("the matchdfield ", user.matchedField);
        return {
            access_token: this.jwt.sign(payload),
            sessionId: currentSession.id,
            username:user.username,
        };
    }

    async register(username: string, email:string, password: string) {
        const hashedPassword = await bcrypt.hash(password, 10);
        return this.prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
        });
    }

    // Google OAuth logic (added functionality)
    async findOrCreateGoogleUser(user: any) {
        // Check if user already exists
        const existingUser = await this.prisma.user.findUnique({
            where: { email: user.email },
        });

        if (existingUser) {
            return existingUser;
        }

        // Create a new user for Google OAuth
        return this.prisma.user.create({
            data: {
                username: user.email, // Use email as username
                email: user.email,
                // firstName: user.firstName,
                // lastName: user.lastName,
                // picture: user.picture,
                password: '', // Empty because Google handles authentication
            },
        });
    }
}
