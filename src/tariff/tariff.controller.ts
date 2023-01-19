import { Body, Controller, Post } from '@nestjs/common';
import { TariffService } from './tariff.service';
import { CreateTariffDto } from './dto/create-tariff.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Tariff')
@Controller('tariff')
export class TariffController {
  constructor(private readonly tariffService: TariffService) {}


  @Post()
  async create(@Body() dto: CreateTariffDto){
    return this.tariffService.createTariff(dto)
  }
}
