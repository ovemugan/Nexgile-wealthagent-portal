import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';

export type AuthUser = {
  sub: string;
  email: string;
  roles: { role: string; scopeType: string; scopeId: string }[];
};

export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext): AuthUser => {
  const req = ctx.switchToHttp().getRequest();
  return req.user as AuthUser;
});

export const RequireRole = (...roles: string[]) => SetMetadata('nexgile:roles', roles);
export const requireRole = RequireRole;
