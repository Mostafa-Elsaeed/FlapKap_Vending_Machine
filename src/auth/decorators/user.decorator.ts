import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { IJwtPayload } from '../interfaces/jwt.interface';
export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): IJwtPayload | undefined => {
    const request = ctx.switchToHttp().getRequest<Request>();

    const user = request.user as IJwtPayload | undefined;

    if (!user) {
      return undefined;
    }

    // if (data) {
    //   return user[data];
    // }

    return user;
  },
);
