import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ApiTags } from '@nestjs/swagger';
import { SummaryReportDto } from './dto/summary-reports.dto';

@ApiTags('REPORTS')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('slot-report')
  async getReports(@Query() query: SummaryReportDto){
    return this.reportsService.getReport(query)
  }
}
