import { Module } from '@nestjs/common';
import { ParckingSetupService } from './parcking-setup.service';
import { ParckingSetupController } from './parcking-setup.controller';

@Module({
  controllers: [ParckingSetupController],
  providers: [ParckingSetupService]
})
export class ParckingSetupModule {}
