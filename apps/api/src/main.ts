import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { globalValidationPipe } from './common/pipes/validation.pipe';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Prefixo Global da API
  app.setGlobalPrefix('api/v1');

  // Segurança (Helmet & CORS)
  app.use(helmet({ contentSecurityPolicy: false }));
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Interceptors, Filters e Pipes Globais
  app.useGlobalPipes(globalValidationPipe);
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(),
  );

  // Documentação Interativa Swagger
  const config = new DocumentBuilder()
    .setTitle('Grupo Bairral - Canal de Ética e Integridade (API)')
    .setDescription(
      'Documentação Swagger das APIs de governança, relatos, auditoria e planos de ação.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, document);

  // Graceful Shutdown Hooks
  app.enableShutdownHooks();

  const port = process.env.PORT || 3000;
  logger.log(`NestJS API Foundation inicializada. Swagger em /api/v1/docs`);
}

// Executado quando iniciado diretamente via CLI Node
if (process.env.START_NEST === 'true') {
  bootstrap();
}
