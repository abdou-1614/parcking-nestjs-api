import { Module } from '@nestjs/common';
import { ParckingPlaceService } from './parcking-place.service';
import { ParckingPlaceController } from './parcking-place.controller';

@Module({
  controllers: [ParckingPlaceController],
  providers: [ParckingPlaceService]
})
export class ParckingPlaceModule {}
