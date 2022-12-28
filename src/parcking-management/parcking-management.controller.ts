import { Controller } from '@nestjs/common';
import { ParckingManagementService } from './parcking-management.service';

@Controller('parcking-management')
export class ParckingManagementController {
  constructor(private readonly parckingManagementService: ParckingManagementService) {}
}
