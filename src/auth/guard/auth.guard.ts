import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(protected readonly jwt: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Response>();

    const [type, token] = req.headers['authorization']?.split(' ') ?? [];
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Unauthorized');
    }

    try {
      const payload = await this.jwt.verifyAsync(token, {
        secret: process.env.JWT_SECRET_KEY,
      });

      req['user'] = payload;
    } catch (err) {
      throw new UnauthorizedException('Unauthorized');
    }
    return true;
  }
}
