import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { patchNestJsSwagger } from 'nestjs-zod';
import { SwaggerModule } from '@nestjs/swagger';
import { sharedSwaggerConfig } from './shared/config/swagger.config';
import { config } from 'dotenv';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
