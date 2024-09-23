import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Bar, BarChart, XAxis, YAxis } from 'recharts'

import dashboardApi from '@/api/dashboard-api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'
import QUERY_KEY from '@/utils/query-key'

const chartConfig = {
  sold: {
    label: 'Sold'
  }
} satisfies ChartConfig

const colors = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))'
]

function CategoryChart() {
  const { data } = useQuery({
    queryKey: [QUERY_KEY.BEST_SELLING_CATEGORIES],
    queryFn: dashboardApi.getBestSellingCategories
  })
  const chartData = useMemo(() => {
    return data?.data.map((item, index) => ({ ...item, fill: colors[index] }))
  }, [data?.data])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top selling</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData} layout="vertical" margin={{ left: 0 }}>
            <YAxis
              dataKey="category.name"
              type="category"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
            />
            <XAxis dataKey="sold" type="number" hide />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="sold" layout="vertical" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default CategoryChart
