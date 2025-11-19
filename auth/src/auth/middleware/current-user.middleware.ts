/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-empty */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

interface UserPayload {
  id: string;
  email: string;
  username: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const auth = req.headers.authorization;

    if (!auth?.startsWith('Bearer ')) return next();

    try {
      const token = auth.split(' ')[1];
      req.currentUser = jwt.verify(
        token,
        process.env.JWT_SECRET!,
      ) as UserPayload;
    } catch {}

    next();
  }
}
