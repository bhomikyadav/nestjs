import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { RequestContextService } from './request-context.service';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  constructor(protected readonly requestContext: RequestContextService) {}
  use(req: Request, res: Response, next: NextFunction) {

console.log('🚀 request-context.middleware.ts:10 -> ');
    
    const requestId: string = randomUUID();
    this.requestContext.run(() => {
      this.requestContext.set('requestId', requestId);
      req['requestId'] = requestId;
      next();
    });
  }
}
