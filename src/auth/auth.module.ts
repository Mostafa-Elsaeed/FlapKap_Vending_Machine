// import { Module } from '@nestjs/common';
// import { JwtModule } from '@nestjs/jwt';
// import { AuthController } from './auth.controller';
// import { UserModule } from 'src/user/user.module';
// import { AuthService } from './auth.service';
// import { ConfigService } from '../config/config.service';
// import { ConfigModule } from '../config/config.module';

// @Module({
//   imports: [
//     UserModule,
//     ConfigModule,
//     JwtModule.registerAsync({
//       imports: [ConfigModule],
//       useFactory: (configService: ConfigService) => ({
//         global: true,
//         secret: configService.auth.authSecret,
//         // ? configService.auth.authSecret
//         // : (console.warn('Auth secret not found in config, using default'),
//         //   'defaultSecretKey'),
//         signOptions: {
//           expiresIn: configService.auth.jwtExpirationTime,
//           // ? configService.auth.jwtExpirationTime
//           // : (console.warn(
//           //     'JWT expiration time not found in config, using default',
//           //   ),
//           //   '1d'),
//         },
//       }),
//       inject: [ConfigService],
//     }),
//   ],
//   providers: [AuthService],
//   controllers: [AuthController],
//   exports: [AuthService],
// })
// export class AuthModule {}

// This would be in your src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { UserModule } from '../user/user.module';
import { JwtStrategy } from './stratigies/jwt.strategy';
import { ConfigService } from '../config/config.service';
import { ConfigModule } from '../config/config.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
@Module({
  imports: [
    UserModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.auth.authSecret,
        // ? configService.auth.authSecret
        // : (console.warn('Auth secret not found in config, using default'),
        //   'defaultSecretKey'),
        signOptions: {
          expiresIn: configService.auth.jwtExpirationTime,
          // ? configService.auth.jwtExpirationTime
          // : (console.warn(
          //     'JWT expiration time not found in config, using default',
          //   ),
          //   '1d'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [JwtStrategy, AuthService],
  exports: [JwtModule, AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
