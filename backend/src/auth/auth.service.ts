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
    
        // Check for existing sessions
        const sessions = await this.sessionService.getSessionsByUser(user.id);
        let currentSession;
    
        if (sessions.length === 0) {
            // Create a new session for the user
            currentSession = await this.sessionService.createSession(user.id, 'New Chat');
            console.log("the current new session created",currentSession);
        } else {
            // Use the first existing session
            currentSession = sessions[0];
        }
    
        // Generate and return the JWT token and session details
        return {
            access_token: this.jwt.sign(payload),
            sessionId: currentSession.id,
            username: user.username,
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
    async findOrCreateGoogleUser(googleUser: any) {
        const { email, firstName } = googleUser;
    
        // Check if user already exists
        let existingUser = await this.prisma.user.findUnique({ where: { email } });
    
        if (!existingUser) {
            // Create a new user for Google OAuth
            existingUser = await this.prisma.user.create({
                data: {
                    username: email.split('@')[0], // Fallback to part of email
                    email,
                    password: '', // Google handles authentication
                },
            });
        }
    
        return existingUser;
    }
}
