// config/config.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import defaultConfig from './sections/default.config';
import { validateEnv } from './zod-validator';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [defaultConfig],
      cache: true,
      envFilePath: ['.env.local', '.env'],
      validate: validateEnv,
    }),
  ],
})
export class ConfigModule {}
