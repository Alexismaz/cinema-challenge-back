import './config/dd-tracer';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { urlencoded, json } from 'express';
import * as pg from 'pg';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { winstonLogger } from '@infrastructure/loggers/winston.logger';
import { DataService } from './scripts/DataService';
import { HttpExceptionFilter } from '@infrastructure/filters/global-exception.filter';

export const logger = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production' ? winstonLogger : new Logger('backend-call');

async function bootstrap() {
  pg.defaults.parseInputDatesAsUTC = false;
  pg.types.setTypeParser(1114, (stringValue: string) => new Date(`${stringValue}Z`));

  const app = await NestFactory.create(AppModule);
  app.use(json({ limit: '3mb' }));
  app.use(urlencoded({ extended: true, limit: '3mb' }));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors({
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
    origin: [/http\:\/\/localhost\:\d{1,5}$/],
  });
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder().setTitle('Cinema API').setDescription('Cinema API docuemntation').addBearerAuth().setVersion('1.0').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);

  const loadData = app.get(DataService);
  await loadData.loadDataByDefault();
  app.useWebSocketAdapter(new IoAdapter(app));

  await app.listen(3001);
}
bootstrap();
