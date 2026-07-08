import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class RateLimiterGuard implements CanActivate {
  users: Map<string, number[]>;
  size: number;
  timeLimit: number;

  constructor() {
    this.users = new Map();
    this.size = 5;
    this.timeLimit = 5 * 60 * 1000;
  }

  checkIp(ip: string): boolean {
    const currentTime = Date.now();

    let userdata: number[] = [];

    if (this.users.has(ip)) {
      userdata = this.users.get(ip) as number[];

      while (userdata.length && currentTime - this.timeLimit > userdata[0]) {
        userdata.shift();
      }

      if (userdata.length === this.size) {
        return false;
      }
    }

    userdata.push(currentTime);

    this.users.set(ip, userdata);

    return true;
  }

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();

    const ip = req.ip;
    if (!ip) {
      return false;
    }

    if (!this.checkIp(ip)) throw new HttpException('Too Many Request', 429);
    return true;
  }
}
