// import { Injectable } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';

// @Injectable()
// export class JwtAuthGuard extends AuthGuard('jwt') {}

// src/auth/guards/jwt-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtStrategiesEnum } from '../enum/jwt.enum';

@Injectable()
export class JwtAuthGuard extends AuthGuard(JwtStrategiesEnum.JWT) {}
