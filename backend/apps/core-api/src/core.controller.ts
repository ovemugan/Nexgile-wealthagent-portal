import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common'; import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'; import { JwtAuthGuard, CurrentUser, AuthUser, RequireRole, RolesGuard } from '@nexgile/auth'; import { CoreService } from './core.service';
@ApiTags('core') @Controller() export class CoreController {
  constructor(private readonly core: CoreService) {}
  @Post('auth/login') login(@Body() body: { email: string; password: string }) { return this.core.login(body.email, body.password); }
  @Get('auth/me') @UseGuards(JwtAuthGuard) @ApiBearerAuth() me(@CurrentUser() user: AuthUser) { return this.core.me(user.sub); }
  @Get('households/:id') @UseGuards(JwtAuthGuard) @ApiBearerAuth() household(@CurrentUser() u: AuthUser, @Param('id') id: string) { return this.core.household(u, id); }
  @Get('households/:id/members') @UseGuards(JwtAuthGuard) members(@CurrentUser() u: AuthUser, @Param('id') id: string) { return this.core.household(u, id).then(h => h.people); }
  @Get('households/:id/accounts') @UseGuards(JwtAuthGuard) accounts(@CurrentUser() u: AuthUser, @Param('id') id: string) { return this.core.accounts(u, id); }
  @Get('households/:id/net-worth') @UseGuards(JwtAuthGuard) netWorth(@CurrentUser() u: AuthUser, @Param('id') id: string) { return this.core.netWorth(u, id); }
  @Get('households/:id/performance') @UseGuards(JwtAuthGuard) performance(@CurrentUser() u: AuthUser, @Param('id') id: string) { return this.core.performance(u, id); }
  @Get('accounts/:id') @UseGuards(JwtAuthGuard) account(@CurrentUser() u: AuthUser, @Param('id') id: string) { return this.core.account(u, id); }
  @Get('accounts/:id/holdings') @UseGuards(JwtAuthGuard) holdings(@CurrentUser() u: AuthUser, @Param('id') id: string) { return this.core.holdings(u, id); }
  @Get('accounts/:id/transactions') @UseGuards(JwtAuthGuard) transactions(@CurrentUser() u: AuthUser, @Param('id') id: string, @Query() q: any) { return this.core.transactions(u, id, q); }
  @Post('accounts/:id/sync') @UseGuards(JwtAuthGuard) sync(@CurrentUser() u: AuthUser, @Param('id') id: string) { return this.core.enqueueSync(u, id); }
  @Get('sync-jobs/:jobId') @UseGuards(JwtAuthGuard) syncJob(@Param('jobId') jobId: string) { return this.core.syncStatus(jobId); }
  @Get('households/:id/goals') @UseGuards(JwtAuthGuard) goals(@CurrentUser() u: AuthUser, @Param('id') id: string) { return this.core.goals(u, id); }
  @Post('households/:id/goals') @UseGuards(JwtAuthGuard) createGoal(@CurrentUser() u: AuthUser, @Param('id') id: string, @Body() b: any) { return this.core.createGoal(u, id, b); }
  @Post('goals/:id/scenarios') @UseGuards(JwtAuthGuard) scenario(@CurrentUser() u: AuthUser, @Param('id') id: string, @Body('assumptions') a: Record<string, number>) { return this.core.scenario(u, id, a); }
  @Post('documents') @UseGuards(JwtAuthGuard) documentCreate(@CurrentUser() u: AuthUser, @Body() b: any) { return this.core.createDocument(u, b); }
  @Get('households/:id/documents') @UseGuards(JwtAuthGuard) documents(@CurrentUser() u: AuthUser, @Param('id') id: string) { return this.core.documents(u, id); }
  @Get('documents/:id') @UseGuards(JwtAuthGuard) document(@CurrentUser() u: AuthUser, @Param('id') id: string) { return this.core.document(u, id); }
  @Get('people/:id/notifications') @UseGuards(JwtAuthGuard) notifications(@CurrentUser() u: AuthUser, @Param('id') id: string) { return this.core.notifications(u, id); }
  @Post('notifications/:id/read') @UseGuards(JwtAuthGuard) read(@CurrentUser() u: AuthUser, @Param('id') id: string) { return this.core.readNotification(u, id); }
  @Get('audit') @UseGuards(JwtAuthGuard, RolesGuard) @RequireRole('advisor', 'compliance') audits(@CurrentUser() u: AuthUser, @Query() q: any) { return this.core.audits(u, q); }
}
