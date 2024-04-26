import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { patchNestJsSwagger } from 'nestjs-zod';
import { SwaggerModule } from '@nestjs/swagger';
import { sharedSwaggerConfig } from './shared/config/swagger.config';
import { config } from 'dotenv';
import { HttpException, HttpStatus, ValidationPipe } from '@nestjs/common';
import * as cors from 'cors'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
