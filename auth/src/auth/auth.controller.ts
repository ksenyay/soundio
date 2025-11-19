import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto';
import { LoginUserDto } from './dto';
import type { Request, Response } from 'express';

@Controller('api/users')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('currentuser')
  @HttpCode(200)
  getCurrentUser(@Req() req: Request) {
    return this.authService.getCurrentUser(req);
  }

  @Post('signup')
  @HttpCode(201)
  async signup(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const { token, user } = await this.authService.signup(createUserDto);

    res.setHeader('Authorization', `Bearer ${token}`);
    return user;
  }

  @Post('signin')
  @HttpCode(200)
  async signin(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
    const { token, user } = await this.authService.signin(loginUserDto);

    res.setHeader('Authorization', `Bearer ${token}`);
    return user;
  }

  // @Post('signout')
  // @HttpCode(200)
  // signout(@Req() req: Request) {
  //   return this.authService.signout(req);
  // }
}
