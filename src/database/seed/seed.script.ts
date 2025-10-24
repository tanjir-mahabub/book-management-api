import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from '../../app.module';
import { SeedService } from './seed.service';

async function bootstrap() {
  const logger = new Logger('SeedScript');

  try {
    // Create NestJS application context
    const app = await NestFactory.createApplicationContext(AppModule, {
      logger: ['log', 'error', 'warn'],
    });

    // Get SeedService
    const seedService = app.get(SeedService);

    // Parse command line arguments
    const args = process.argv.slice(2);
    const command = args[0];

    if (command === 'clear') {
      logger.log('Running clear command...');
      await seedService.clear();
    } else {
      logger.log('Running seed command...');
      await seedService.seed();
    }

    await app.close();
    process.exit(0);
  } catch (error) {
    logger.error('Seed script failed', error);
    process.exit(1);
  }
}

void bootstrap();

