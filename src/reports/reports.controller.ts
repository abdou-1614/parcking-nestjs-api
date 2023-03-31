import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SummaryReportDto } from './dto/summary-reports.dto';
import { DetailsReportsDto } from './dto/details-reports.dto';
import { IsAdmin } from 'src/common/decorators/is-admin.decorator';
import { Public } from 'src/auth/public.decorator';

@IsAdmin()
@ApiBearerAuth()
@ApiTags('REPORTS')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('slot-report')
  async getReports(@Query() query: SummaryReportDto){
    return this.reportsService.getReport(query)
  }
  @Get('summary-report')
  async SummaryReport(@Query() query: SummaryReportDto){
    return this.reportsService.getSummaryReport(query)
  }
  @Get('details-report')
  async DetailsReport(@Query() query: DetailsReportsDto){
    return this.reportsService.detailsReport(query)
  }
}
