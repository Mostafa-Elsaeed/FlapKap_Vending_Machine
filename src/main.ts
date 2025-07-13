import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'reflect-metadata';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('FlapKap Vending Machine')
    .setDescription('The API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  const theme = new SwaggerTheme();
  const options = {
    explorer: true,
    customCss: theme.getBuffer(SwaggerThemeNameEnum.DARK),
  };
  SwaggerModule.setup('docs', app, document, options);
  console.log('swagger is running on http://localhost:3000/docs');
  await app.listen(process.env.PORT ?? 3000);
}
// bootstrap();
bootstrap()
  .then(() => console.log('Application started successfully'))
  .catch((err) => console.error('Failed to start application:', err));
