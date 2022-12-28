import { Controller } from '@nestjs/common';
import { ParckingPlaceService } from './parcking-place.service';

@Controller('parcking-place')
export class ParckingPlaceController {
  constructor(private readonly parckingPlaceService: ParckingPlaceService) {}
}
