import { Module } from '@nestjs/common';
import { ParckingManagementService } from './parcking-management.service';
import { ParckingManagementController } from './parcking-management.controller';

@Module({
  controllers: [ParckingManagementController],
  providers: [ParckingManagementService]
})
export class ParckingManagementModule {}
