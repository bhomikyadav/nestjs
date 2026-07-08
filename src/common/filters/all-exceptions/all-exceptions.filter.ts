import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { RequestContextService } from 'src/common/request-context/request-context.service';

@Catch()
export class AllExceptionsFilter<T> implements ExceptionFilter {
  constructor(
    protected readonly requestContextService: RequestContextService,
  ) {}
  catch(exception: T, host: ArgumentsHost) {
    // Get Express request and response objects
    const ctx = host.switchToHttp();

    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = `Something Went Wrong`;

    // handle Nest JS

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();

      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      }
      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        message = (exceptionResponse as any).message ?? exception.message;
      }
    }
    let requestId = this.requestContextService.get('requestId');

    return res.status(statusCode).json({
      success: statusCode === HttpStatus.OK,
      statusCode: statusCode,
      message,
      requestId,
      timestamp: new Date().toISOString(),
    });
  }
}
