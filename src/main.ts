import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function launchApp() {
  const app = await NestFactory.create(AppModule);

  console.log('Orígenes permitidos:', process.env.CORS_ORIGINS?.split(','));
  console.log('Métodos permitidos:', process.env.CORS_METHODS?.split(','));
  console.log(
    'Headers permitidos:',
    process.env.CORS_ALLOWED_HEADERS?.split(','),
  );

  app.enableCors({
    origin: process.env.CORS_ORIGINS?.split(',').map((o) => o.trim()), // URL frontend
    methods: process.env.CORS_METHODS?.split(',') || ['GET', 'POST'],
    allowedHeaders: process.env.CORS_ALLOWED_HEADERS?.split(',') || [],
    credentials: true,
    exposedHeaders: [],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT || 3000); // Puerto del backend
  console.log(`Application is running on: ${await app.getUrl()}`);
}
launchApp().catch((error) => {
  console.error('Error starting the application:', error);
  process.exit(1);
});
