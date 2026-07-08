import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger, Logger, ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/all-exceptions/all-exceptions.filter';
import { ResponseInterceptor } from './common/interceptors/response/response.interceptor';
import { RequestContextService } from './common/request-context/request-context.service';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: false,
  });

  // Set the global prefix for all HTTP routes
  app.setGlobalPrefix('api');

  const reflector = app.get(Reflector);
  const requestContextService = app.get(RequestContextService);
  app.useGlobalFilters(new AllExceptionsFilter(requestContextService));
  app.useGlobalInterceptors(
    new ResponseInterceptor(reflector, requestContextService),
  );
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
