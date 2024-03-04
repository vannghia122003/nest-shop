import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { createSearchParams, useNavigate } from 'react-router-dom'
import categoryApi from '~/apis/category.api'
import productApi from '~/apis/product.api'
import Pagination from '~/components/Pagination'
import Product from '~/components/Product'
import ProductSkeleton from '~/components/ProductSkeleton'
import { useProductListParams } from '~/hooks'
import { ProductListQuery } from '~/types/product.type'
import AsideFilter from './components/AsideFilter'
import SortBar from './components/SortBar'
import QUERY_KEYS from '~/constants/keys'

function ProductList() {
  const productListParams = useProductListParams()
  const navigate = useNavigate()
  const categoriesQuery = useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES],
    queryFn: () => categoryApi.getCategories(),
    staleTime: 5 * 60 * 1000
  })
  const { data: productsData, isPending: isPendingProducts } = useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, productListParams],
    queryFn: () => productApi.getProducts(productListParams as ProductListQuery),
    placeholderData: keepPreviousData
  })

  const handlePageChange = (page: number) => {
    navigate({
      pathname: '',
      search: createSearchParams({
        ...productListParams,
        page: page.toString(),
        limit: productListParams.limit?.toString() as string
      }).toString()
    })
  }

  return (
    <div className="py-8">
      <Helmet>
        <title>Danh sách sản phẩm | Nest Shop</title>
        <meta name="description" content="Danh sách sản phẩm" />
      </Helmet>
      <div className="container">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-3">
            <AsideFilter productListParams={productListParams} categoriesQuery={categoriesQuery} />
          </div>

          <div className="col-span-12 lg:col-span-9">
            <SortBar productListParams={productListParams} />
            {productsData && productsData.result.length === 0 && (
              <div className="mt-6 text-center text-xl text-secondary">Không có sản phẩm</div>
            )}

            <div className="my-4 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-4">
              {isPendingProducts &&
                !productsData &&
                Array(Number(productListParams.limit))
                  .fill(0)
                  .map((_, index) => <ProductSkeleton key={index} />)}

              {!isPendingProducts &&
                productsData &&
                productsData.result?.map((product) => (
                  <Product key={product._id} product={product} />
                ))}
            </div>

            <Pagination
              pageCount={productsData?.total_pages}
              currentPage={Number(productListParams.page)}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductList
