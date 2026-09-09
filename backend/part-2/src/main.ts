import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('Nexgile-WealthAgent Part 2 API')
    .setDescription('Advisor Workstation, Tax/Estate Tools, Monte Carlo Engine, and Reporting API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 3002;
  await app.listen(port);
  console.log(`Advisor Workstation API running on http://localhost:${port}`);
  console.log(`Swagger OpenAPI documentation available at http://localhost:${port}/docs`);
}

bootstrap();
