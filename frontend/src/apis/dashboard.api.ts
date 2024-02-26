import http from './http'

const dashboardApi = {
  getStatistics() {
    return http.get<
      undefined,
      {
        total_views: number
        total_products: number
        total_products_sold: number
        total_users: number
      }
    >('/dashboard')
  }
}

export default dashboardApi
