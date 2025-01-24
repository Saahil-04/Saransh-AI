import { Body, Controller, Get, Post,Res ,Req, UseGuards, UnauthorizedException } from '@nestjs/common';
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
    async register(@Body() body: { username: string; email:string; password: string }) {
        return this.authService.register(body.username,body.email,body.password);
    }
    // Google OAuth2 Login
    @Get('google')
    @UseGuards(AuthGuard('google')) // Initiates Google OAuth
    async googleAuth() {
        // This route is a placeholder; the actual redirect happens automatically
    }

    // Google OAuth2 Callback
    @Get('google/callback')
    @UseGuards(AuthGuard('google')) // Handles callback from Google
    async googleAuthRedirect(@Req() req, @Res() res: Response) {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: 'Google login failed' });
          }
        // Check if user exists in your database or create a new one
        const existingUser = await this.authService.findOrCreateGoogleUser(user);
        const token = this.authService.login(existingUser);
        const username = user.name; // Assuming 'name' exists in the user object

        // Set the token/username in cookies
        res.cookie('token', token, { httpOnly: true, secure: false }); // Use secure: true in production
        res.cookie('username', username, { httpOnly: true, secure: false });
  
        // Redirect to the frontend
        return res.redirect('http://localhost:4200/home');

    }

}
