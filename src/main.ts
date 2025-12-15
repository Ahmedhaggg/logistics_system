import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RedisIoAdapter } from '@common/sockets/adapters/redis-io.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // global prefix
  app.setGlobalPrefix('api');

  // class validator
  app.useGlobalPipes(new ValidationPipe());

  // swagger docs
  const config = new DocumentBuilder()
    .setTitle('Log Saga API')
    .setDescription('The Log Saga API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  app.enableCors({
    origin: ['http://localhost:5173', 'https://myfrontend.com'], // web clients
    methods: 'GET,POST,PUT,DELETE',
  });

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const socketIoAdapter = new RedisIoAdapter(app);

  await socketIoAdapter.connectToRedis();
  app.useWebSocketAdapter(socketIoAdapter);
  // start app
  await app.listen(3000);
}
bootstrap();
