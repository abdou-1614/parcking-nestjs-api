import { Controller } from '@nestjs/common';
import { ParckingSetupService } from './parcking-setup.service';

@Controller('parcking-setup')
export class ParckingSetupController {
  constructor(private readonly parckingSetupService: ParckingSetupService) {}
}
