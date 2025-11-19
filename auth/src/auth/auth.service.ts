import { Body, Injectable, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../db/schemas/user.schema';
import { CreateUserDto, LoginUserDto } from './dto';
import { Password } from '../utils/password';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private user: Model<User>) {}

  getCurrentUser(req: Request): { currentUser: object | undefined } {
    return { currentUser: req.currentUser || undefined };
  }

  async signup(
    data: CreateUserDto,
  ): Promise<{ token: string; user: UserDocument }> {
    const { username, email, password } = data;

    const hashed = await Password.hash(password);

    const newUser = new this.user({ username, email, password: hashed });

    const token = jwt.sign(
      { id: newUser._id, username: newUser.username, email: newUser.email },
      process.env.JWT_SECRET!,
    );

    await newUser.save();

    return { token, user: newUser };
  }

  async signin(
    @Body() data: LoginUserDto,
  ): Promise<{ token: string; user: UserDocument }> {
    const { email, password } = data;

    const user = await this.user.findOne({ email }).exec();

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await Password.compare(password, user.password);

    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET!,
    );

    return { token, user };
  }

  // signout(req: Request): string {
  //   req.session = undefined;
  //   return 'User signed out';
  // }
}
