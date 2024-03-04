import { useQuery } from '@tanstack/react-query'
import { FaRegEye, FaRegMoneyBillAlt, FaRegUser } from 'react-icons/fa'
import { HiOutlineSquare3Stack3D } from 'react-icons/hi2'
import dashboardApi from '~/apis/dashboard.api'
import Card from '../../components/Card'
import QUERY_KEYS from '~/constants/keys'

function Dashboard() {
  const { data } = useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD],
    queryFn: dashboardApi.getStatistics
  })

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      <Card Icon={FaRegEye} title="Lượt xem" number={data?.total_views || 0} />
      <Card Icon={HiOutlineSquare3Stack3D} title="Sản phẩm" number={data?.total_products || 0} />
      <Card Icon={FaRegMoneyBillAlt} title="Đã bán" number={data?.total_products_sold || 0} />
      <Card Icon={FaRegUser} title="Người dùng" number={data?.total_users || 0} />
    </div>
  )
}
export default Dashboard
