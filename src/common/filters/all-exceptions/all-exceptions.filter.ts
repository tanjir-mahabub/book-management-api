import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const excResp = exception.getResponse();
      const message =
        typeof excResp === 'string'
          ? excResp
          : (excResp as { message?: string }).message || excResp;
      res.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: req.url,
        message,
        error: exception.name,
      });
      return;
    }

    if (
      exception instanceof QueryFailedError ||
      (exception as { code?: string }).code
    ) {
      const err = exception as {
        code?: string;
        errno?: string;
        message?: string;
      };
      const code = err.code || err.errno;
      const message = err.message || 'Database error';

      if (
        code === 'SQLITE_CONSTRAINT' ||
        code === '23505' ||
        /unique/i.test(message)
      ) {
        res.status(HttpStatus.CONFLICT).json({
          statusCode: HttpStatus.CONFLICT,
          timestamp: new Date().toISOString(),
          path: req.url,
          message: 'Conflict: unique constraint violation',
          error: 'Conflict',
          detail: message,
        });
        return;
      }
    }

    this.logger.error('Unhandled exception', exception);
    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    res.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: req.url,
      message: 'Internal server error',
      error: 'InternalServerError',
    });
  }
}
