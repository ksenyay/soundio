import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequireAuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(req.session);
    console.log(req.currentUser);
    if (!req.currentUser) {
      throw new UnauthorizedException('Not authorized');
    }
    next();
  }
}
