import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'Get API information',
    description:
      'Returns API metadata including name, version, available endpoints, and documentation links',
  })
  @ApiResponse({
    status: 200,
    description: 'API information retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Book Management API' },
        version: { type: 'string', example: '1.0.0' },
        description: { type: 'string' },
        status: { type: 'string', example: 'operational' },
        timestamp: { type: 'string', format: 'date-time' },
        endpoints: {
          type: 'object',
          properties: {
            authors: { type: 'string', example: '/authors' },
            books: { type: 'string', example: '/books' },
            health: { type: 'string', example: '/health' },
          },
        },
        documentation: {
          type: 'object',
          properties: {
            readme: { type: 'string' },
            apiDocs: { type: 'string', example: '/api-docs' },
          },
        },
      },
    },
  })
  getApiInfo() {
    return this.appService.getApiInfo();
  }

  @Get('health')
  @ApiOperation({
    summary: 'Health check',
    description:
      'Health check endpoint for monitoring. Returns server status, uptime, and environment.',
  })
  @ApiResponse({
    status: 200,
    description: 'Server is healthy',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        uptime: { type: 'number', example: 123.45 },
        timestamp: { type: 'string', format: 'date-time' },
        environment: { type: 'string', example: 'development' },
      },
    },
  })
  getHealth() {
    return {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      environment: process.env['NODE_ENV'] || 'development',
    };
  }
}
