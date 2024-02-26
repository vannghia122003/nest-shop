import omitBy from 'lodash/omitBy'
import isUndefined from 'lodash/isUndefined'
import { ProductListQuery } from '~/types/product.type'
import useQueryParams from './useQueryParams'
import { sortBy } from '~/constants/product'

export type ProductListParams = {
  [key in keyof ProductListQuery]: string
}

function useProductListParams() {
  const queryParams = useQueryParams()
  const productListQuery: ProductListParams = omitBy(
    {
      page: queryParams.page || '1',
      limit: queryParams.limit || '12',
      sort_by: queryParams.sort_by || sortBy.popular,
      name: queryParams.name,
      order: queryParams.order,
      category_id: queryParams.category_id,
      rating: queryParams.rating,
      price_min: queryParams.price_min,
      price_max: queryParams.price_max
    },
    isUndefined
  )
  return productListQuery
}

export default useProductListParams
