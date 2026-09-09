import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt.guard';
import { CurrentUser, AuthUser } from './decorators';

export class LoginDto {
  email: string;
  password: string;
}

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('auth/login')
  @ApiOperation({ summary: 'Login and obtain JWT token' })
  @ApiResponse({ status: 200, description: 'Authentication successful' })
  async login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }

  @Get('auth/me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get profile of currently logged-in user' })
  async me(@CurrentUser() user: AuthUser) {
    return user;
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  health() {
    return { status: 'ok', service: 'advisor-api-part-2', timestamp: new Date().toISOString() };
  }
}
