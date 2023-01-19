import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { TariffService } from './tariff.service';
import { CreateTariffDto } from './dto/create-tariff.dto';
import { ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FilterQueryDto } from 'src/common/dto/filterquery.dto';

@ApiTags('Tariff')
@Controller('tariff')
export class TariffController {
  constructor(private readonly tariffService: TariffService) {}


  @ApiCreatedResponse({
    description: 'Tariff Created Successfully !'
  })
  @ApiNotFoundResponse({
    description: 'The Entered Place Not Found'
  })
  @ApiNotFoundResponse({
    description: 'The Entered Type Not Found'
  })
  @ApiOperation({ summary: 'Create Tariff' })
  @Post()
  async create(@Body() dto: CreateTariffDto){
    return this.tariffService.createTariff(dto)
  }

  @ApiOkResponse({
    description: 'Tariff Found Successfully'
  })
  @ApiNotFoundResponse({
    description: 'Tariff Not Found !'
  })
  @ApiOperation({ summary: 'Find All Tariff' })
  @Get()
  async find(@Query() query: FilterQueryDto){
    return this.tariffService.queryAll(query)
  }
}
