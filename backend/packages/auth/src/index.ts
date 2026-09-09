import { CanActivate, ExecutionContext, Injectable, SetMetadata, createParamDecorator } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
export type AuthUser = { sub: string; email: string; roles: { role: string; scopeType: string; scopeId: string }[] };
export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext) => ctx.switchToHttp().getRequest().user as AuthUser);
export const RequireRole = (...roles: string[]) => SetMetadata('nexgile:roles', roles);
export const requireRole = RequireRole;
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}
  canActivate(context: ExecutionContext) { const req = context.switchToHttp().getRequest(); const token = req.headers.authorization?.replace(/^Bearer\s+/i, ''); if (!token) return false; try { req.user = this.jwt.verify<AuthUser>(token); return true; } catch { return false; } }
}
@Injectable()
export class RolesGuard implements CanActivate { canActivate(context: ExecutionContext) { const roles: string[] = Reflect.getMetadata('nexgile:roles', context.getHandler()) || []; if (!roles.length) return true; const user = context.switchToHttp().getRequest().user as AuthUser; return !!user?.roles?.some((entry) => roles.includes(entry.role)); } }
