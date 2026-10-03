import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // untuk validation decorator
  app.useGlobalPipes(new ValidationPipe({ 
    whitelist: true, // properti ga dibutuhkan otomatis g dianggap
    transform: true, // trf tipe data
  }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
