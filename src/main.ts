import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { static as expose } from 'express'
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets('tmp');

  app.enableCors({
    origin: [
      'http://localhost:3000',
      "https://parking-nestjs-api.onrender.com",
      "https://parking-react-demo.onrender.com"
      
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  })

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true
  }))

  const config = new DocumentBuilder()
  .setTitle('Parking Backend')
  .setDescription('Parking Management For Backend')
  .setVersion('0.0.1')
  .addBearerAuth()
  .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('doc', app, document, {
    customSiteTitle: 'Parking Swagger API'
  })

  await app.listen( process.env.PORT || 4000);
}
bootstrap();
