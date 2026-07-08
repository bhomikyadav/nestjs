import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { map, Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { RESPONSE_MESSAGE } from 'src/decorator/response/response.decorator';
import { RequestContextService } from 'src/common/request-context/request-context.service';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly requestContextService: RequestContextService,
  ) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();

    const res = http.getResponse<Response>();
    let req = http.getRequest<Request>();
    let message =
      this.reflector.get<string>(RESPONSE_MESSAGE, context.getHandler()) ??
      'Request is Completed';
    let requestId = this.requestContextService.get('requestId');

    return next.handle().pipe(
      map((data) => ({
        success: true,
        statusCode: res.statusCode,
        message,
        data,
        timestamp: new Date().toISOString(),
        requestId,
      })),
    );
  }
}
