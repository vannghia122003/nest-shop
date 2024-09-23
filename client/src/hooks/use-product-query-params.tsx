import isUndefined from 'lodash/isUndefined'
import omitBy from 'lodash/omitBy'
import qs from 'qs'
import { useLocation } from 'react-router-dom'

import { IProductQueryParams } from '@/types/product'

function useProductQueryParams() {
  const location = useLocation()
  const queryParams = qs.parse(location.search.slice(1))
  const productQueryParams: IProductQueryParams = omitBy(
    {
      page: queryParams.page || '1',
      limit: queryParams.limit || '12',
      sortBy: queryParams.sortBy || 'view:DESC',
      searchBy: queryParams.searchBy,
      search: queryParams.search,
      'filter.name': queryParams['filter.name'],
      'filter.rating': queryParams['filter.rating'],
      'filter.price': queryParams['filter.price']
    },
    isUndefined
  )
  return productQueryParams
}

export default useProductQueryParams
