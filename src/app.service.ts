import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getApiInfo() {
    return {
      name: 'Book Management API',
      version: '1.0.0',
      description: 'RESTful API for managing books and authors',
      status: 'operational',
      timestamp: new Date().toISOString(),
      endpoints: {
        authors: '/authors',
        books: '/books',
        health: '/health',
      },
      documentation: {
        readme: 'https://github.com/tanjir-mahabub/book-management-api',
        swagger: '/api-docs',
        postman: '/postman',
      },
    };
  }
}
