import { Body, Controller, Get, Post, Res, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    async login(@Body() body: { identifier: string; password: string }) {
        const user = await this.authService.validateUser(body.identifier, body.password);
        if (!user) {
            throw new UnauthorizedException();
        }
        return this.authService.login(user);
    }

    @Post('register')
    async register(@Body() body: { username: string; email: string; password: string }) {
        return this.authService.register(body.username, body.email, body.password);
    }
    // Google OAuth2 Login
    @Get('google')
    @UseGuards(AuthGuard('google')) // Initiates Google OAuth
    async googleAuth() {
        // This route is a placeholder; the actual redirect happens automatically
    }

    // Google OAuth2 Callback@Get('google/callback')
    @Get('google/callback')
    @UseGuards(AuthGuard('google')) // Handles callback from Google
    async googleAuthRedirect(@Req() req, @Res() res: Response) {
        const googleUser = req.user; // Extracted user info from Google
        if (!googleUser) {
            throw new UnauthorizedException('Google login failed');
        }

        // Find or create a user in the database
        const user = await this.authService.findOrCreateGoogleUser(googleUser);

        // Use the same login flow to create session and generate JWT
        const loginResponse = await this.authService.login(user);
        console.log("the sessionID of the new google user",loginResponse.sessionId);

        // Set cookies for token and username
        res.cookie('token', loginResponse.access_token, { httpOnly: false, secure: false ,sameSite: 'strict',});
        res.cookie('username', loginResponse.username, { httpOnly: false, secure: false,  sameSite: 'strict', });
        res.cookie('sessionId', loginResponse.sessionId, { httpOnly: false, secure: false,  sameSite: 'strict', });

        // Redirect to the frontend with sessionId if needed
        return res.redirect(`http://localhost:4200/home`);
    }

}
