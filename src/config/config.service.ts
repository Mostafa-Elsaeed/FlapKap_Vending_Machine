import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { IDatabaseConfig } from './sections/database/database.interface';
import { IAppConfig } from './sections/app/app.interface';
import { IAuthConfig } from './sections/auth/auth.interface';

@Injectable()
export class ConfigService {
  constructor(private configService: NestConfigService) {}

  get app(): IAppConfig {
    return this.configService.get<IAppConfig>('app') as IAppConfig;
  }

  get database(): IDatabaseConfig {
    return this.configService.get<IDatabaseConfig>(
      'database',
    ) as IDatabaseConfig;
  }

  get auth(): IAuthConfig {
    console.log('Auth Config:', this.configService.get<IAuthConfig>('auth'));
    return this.configService.get<IAuthConfig>('auth') as IAuthConfig;
  }
}
