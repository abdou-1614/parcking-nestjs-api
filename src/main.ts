import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors()


  const config = new DocumentBuilder()
  .setTitle('Parcking Backend')
  .setDescription('Parcking Management For Backend')
  .setVersion('0.0.1')
  .addBearerAuth()
  .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('doc', app, document, {
    customSiteTitle: 'Parcking Swagger API'
  })

  await app.listen(3000);
}
bootstrap();
