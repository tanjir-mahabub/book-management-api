import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('getApiInfo', () => {
    it('should return API metadata', () => {
      const result = appController.getApiInfo();
      expect(result).toHaveProperty('name', 'Book Management API');
      expect(result).toHaveProperty('version', '1.0.0');
      expect(result).toHaveProperty('status', 'operational');
      expect(result).toHaveProperty('endpoints');
      expect(result.endpoints).toHaveProperty('authors', '/authors');
      expect(result.endpoints).toHaveProperty('books', '/books');
    });
  });

  describe('getHealth', () => {
    it('should return health status', () => {
      const result = appController.getHealth();
      expect(result).toHaveProperty('status', 'ok');
      expect(result).toHaveProperty('uptime');
      expect(result).toHaveProperty('timestamp');
      expect(typeof result.uptime).toBe('number');
    });
  });
});
