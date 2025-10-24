import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions/all-exceptions.filter';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SeedService } from './database/seed/seed.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  // Swagger/OpenAPI Documentation
  const config = new DocumentBuilder()
    .setTitle('Book Management API')
    .setDescription(
      'RESTful API for managing books and their authors. Built with NestJS, TypeScript, and TypeORM.',
    )
    .setVersion('1.0.0')
    .addTag('authors', 'Author management endpoints')
    .addTag('books', 'Book management endpoints')
    .addTag('health', 'Health check and API info endpoints')
    .setContact(
      'API Support',
      'https://github.com/tanjir-mahabub/book-management-api',
      'support@example.com',
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    customSiteTitle: 'Book Management API Docs',
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Auto-seed database in development mode
  const nodeEnv = configService.get<string>('NODE_ENV', 'development');
  if (nodeEnv === 'development') {
    const seedService = app.get(SeedService);
    await seedService.seed();
  }

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}`);
  logger.log(`Swagger documentation: http://localhost:${port}/api-docs`);
}

void bootstrap();
