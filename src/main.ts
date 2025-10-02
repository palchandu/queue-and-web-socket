import { NestFactory } from '@nestjs/core';
import { RootModule } from './root.module';

async function bootstrap() {
  const app = await NestFactory.create(RootModule);
  await app.listen(process.env.PORT ?? 4532);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
void bootstrap();
