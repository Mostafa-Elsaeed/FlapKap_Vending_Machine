import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IJwtPayload } from '../interfaces/jwt.interface';
import { ConfigService } from 'src/config/config.service';
import { JwtStrategiesEnum } from '../enum/jwt.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  JwtStrategiesEnum.JWT,
) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.auth.authSecret,
    });
  }

  validate(payload: IJwtPayload): IJwtPayload {
    return payload;
  }
}
