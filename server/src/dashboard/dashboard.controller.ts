import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ResponseMessage } from '../common/decorators/response-message.decorator'
import { DASHBOARD_MESSAGES } from '../common/utils/constants'
import { DashboardService } from './dashboard.service'

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @ResponseMessage(DASHBOARD_MESSAGES.GET_STATS_SUCCESS)
  @Get('stats')
  getStats() {
    return this.dashboardService.getStats()
  }

  @ResponseMessage(DASHBOARD_MESSAGES.GET_REVENUE_BY_YEAR_SUCCESS)
  @Get('revenue')
  getRevenueByYear(@Query('year', ParseIntPipe) year: number) {
    return this.dashboardService.getRevenueByYear(year)
  }

  @ResponseMessage(DASHBOARD_MESSAGES.GET_REVENUE_BY_YEAR_SUCCESS)
  @Get('best-selling-categories')
  getBestSellingCategories() {
    return this.dashboardService.getBestSellingCategories()
  }
}
