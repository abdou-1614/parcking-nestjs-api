import { Controller } from '@nestjs/common';
import { ParckingService } from './parcking.service';

@Controller('parcking-setup')
export class ParckingController {
  constructor(private readonly parckingService: ParckingService) {}
}
