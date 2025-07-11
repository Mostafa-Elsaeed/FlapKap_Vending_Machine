import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'reflect-metadata';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
// bootstrap();
bootstrap()
  .then(() => console.log('Application started successfully'))
  .catch((err) => console.error('Failed to start application:', err));
