import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts'

import dashboardApi from '@/api/dashboard-api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { generateYearList } from '@/utils/helper'
import QUERY_KEY from '@/utils/query-key'

const chartConfig = {
  revenue: {
    label: 'Revenue',
    color: 'hsl(var(--chart-1))'
  }
} satisfies ChartConfig

function RevenueChart() {
  const [year, setYear] = useState(new Date().getFullYear())
  const { data } = useQuery({
    queryKey: [QUERY_KEY.REVENUE, year],
    queryFn: () => dashboardApi.getRevenue(year)
  })
  const chartData = data?.data
  const yearData = generateYearList(2022)

  const handleChangeYear = (value: string) => {
    setYear(Number(value))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <span>Revenue</span>
          <Select value={String(year)} onValueChange={handleChangeYear}>
            <SelectTrigger className="ml-4 w-[100px]">
              <SelectValue placeholder="Select a year" />
            </SelectTrigger>
            <SelectContent>
              {yearData.map((year) => (
                <SelectItem key={year} value={String(year)}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart accessibilityLayer data={chartData} margin={{ left: 12, right: 12 }}>
            <CartesianGrid />
            <XAxis
              dataKey="date"
              interval="preserveStartEnd"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                const [month, year] = value.split('/')
                const date = new Date(year, month - 1)
                return date.toDateString().split(' ')[1]
              }}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
            <Line
              dataKey="revenue"
              type="linear"
              stroke="var(--color-revenue)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default RevenueChart
