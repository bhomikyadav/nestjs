import { Module } from '@nestjs/common';
import { RequestContextService } from './request-context/request-context.service';

@Module({
  imports: [],
  providers: [RequestContextService],
  exports: [RequestContextService],
})
export class CommonModule {}
