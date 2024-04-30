import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { patchNestJsSwagger } from 'nestjs-zod';
import { SwaggerModule } from '@nestjs/swagger';
import { sharedSwaggerConfig } from '../shared/config/swagger.config';
import { HttpException, HttpStatus, ValidationPipe } from '@nestjs/common';
import * as cors from 'cors'
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose']
  });

  app.use(cors({
    origin: '*'
  }))

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) =>
        new HttpException(
          {
            message: 'Entrada de dados invalida',
            errors: errors,
          },
          HttpStatus.BAD_REQUEST,
        ),
    }))

  const PORT = process.env.API_PORT

  patchNestJsSwagger()

  const sharedDocument = SwaggerModule.createDocument(
    app,
    sharedSwaggerConfig
  )

  SwaggerModule.setup('swagger', app, sharedDocument)

  await app.listen(PORT);
}
bootstrap();
