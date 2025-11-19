/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
  use(req: Request, next: NextFunction) {
    let token: string | undefined;

    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    console.log(token);

    if (!token) {
      return next();
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;
      req.currentUser = payload;
    } catch (err) {}

    next();
  }
}
