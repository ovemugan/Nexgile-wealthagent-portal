import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../common/prisma.service';
import * as bcrypt from 'bcrypt';
import { AuthUser } from './decorators';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async login(email: string, password: string):Promise<{ accessToken: string; user: AuthUser }> {
    const person = await this.prisma.person.findUnique({
      where: { email },
      include: { roles: true },
    });

    if (!person) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, person.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: AuthUser = {
      sub: person.id,
      email: person.email,
      roles: person.roles.map((r) => ({
        role: r.role,
        scopeType: r.scopeType,
        scopeId: r.scopeId,
      })),
    };

    const accessToken = this.jwt.sign(payload);
    return { accessToken, user: payload };
  }

  async validateToken(token: string): Promise<AuthUser> {
    try {
      return this.jwt.verify<AuthUser>(token);
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
