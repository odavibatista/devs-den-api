import { DocumentBuilder } from '@nestjs/swagger'

export const sharedSwaggerConfig = new DocumentBuilder()
  .setTitle("Dev's Den")
  .setDescription(
    "Documentação dos endpoints do projeto Dev's Den."
  )
  .setVersion('1.0.0')
  .addBearerAuth({
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
    description: 'Insira um token JWT para autenticar a requisição.'
  }, 
  'user-token'
  ).build()