import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthUser } from './decorators';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<string[]>('nexgile:roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles || roles.length === 0) {
      return true;
    }
    const user = context.switchToHttp().getRequest().user as AuthUser;
    if (!user || !user.roles) {
      throw new ForbiddenException('User lacks required roles');
    }
    const hasRole = user.roles.some((entry) => roles.includes(entry.role));
    if (!hasRole) {
      throw new ForbiddenException(`Requires one of roles: ${roles.join(', ')}`);
    }
    return true;
  }
}
