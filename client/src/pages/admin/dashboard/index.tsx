import { IconClipboardText, IconMoneybag, IconPackage, IconUsers } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'

import dashboardApi from '@/api/dashboard-api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import CategoryChart from '@/pages/admin/dashboard/category-chart'
import RevenueChart from '@/pages/admin/dashboard/revenue-chart'
import { formatCurrency } from '@/utils/helper'
import QUERY_KEY from '@/utils/query-key'

function Dashboard() {
  const { data: statsData } = useQuery({
    queryKey: [QUERY_KEY.STATS],
    queryFn: dashboardApi.getStats
  })
  const stats = statsData?.data

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Total Revenue</CardTitle>
            <IconMoneybag className="size-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-medium">{formatCurrency(stats?.totalRevenue ?? 0)}₫</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Total Order</CardTitle>
            <IconClipboardText className="size-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-medium">{stats?.orderCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Total Products</CardTitle>
            <IconPackage className="size-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-medium">{stats?.productCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Customer</CardTitle>
            <IconUsers className="size-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-medium">{stats?.customerCount}</div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-8 xl:grid-cols-12">
        <div className="xl:col-span-8">
          <RevenueChart />
        </div>
        <div className="xl:col-span-4">
          <CategoryChart />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
