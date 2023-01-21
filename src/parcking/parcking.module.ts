import { Module } from '@nestjs/common';
import { ParckingService } from './parcking.service';
import { ParckingController } from './parcking.controller';

@Module({
  controllers: [ParckingController],
  providers: [ParckingService]
})
export class ParckingModule {}
