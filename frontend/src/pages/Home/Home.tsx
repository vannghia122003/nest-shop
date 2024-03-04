import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { createSearchParams } from 'react-router-dom'
import categoryApi from '~/apis/category.api'
import productApi from '~/apis/product.api'
import QUERY_KEYS from '~/constants/keys'
import { sortBy } from '~/constants/product'
import Banner from './components/Banner'
import CategoryList from './components/CategoryList'
import Featured from './components/Featured'
import Newsletter from './components/Newsletter'
import ProductList from './components/ProductList'

function Home() {
  const { data: categoriesData, isPending: isPendingCategories } = useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES],
    queryFn: () => categoryApi.getCategories(),
    staleTime: 5 * 60 * 1000
  })
  const { data: latestProductsData, isPending: isPendingLatestProductsData } = useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, sortBy.createdAt],
    queryFn: () =>
      productApi.getProducts({
        limit: 6,
        sort_by: sortBy.createdAt
      })
  })
  const { data: popularProductsData, isPending: isPendingPopularProductsData } = useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, sortBy.popular],
    queryFn: () =>
      productApi.getProducts({
        limit: 6,
        sort_by: sortBy.popular
      })
  })

  return (
    <div className="py-6">
      <Helmet>
        <title>Nest Shop</title>
        <meta name="description" content="Mua sắm trực tuyến tại Nest Shop" />
      </Helmet>
      <div className="container">
        <Banner />
        <CategoryList isPending={isPendingCategories} categoryList={categoriesData?.result || []} />
        <ProductList
          to={{
            pathname: 'products',
            search: createSearchParams({
              sort_by: sortBy.createdAt
            }).toString()
          }}
          isNew
          title="Sản phẩm mới nhất"
          isPending={isPendingPopularProductsData}
          productList={latestProductsData?.result || []}
        />
        <ProductList
          to={{
            pathname: 'products',
            search: createSearchParams({
              sort_by: sortBy.popular
            }).toString()
          }}
          title="Sản phẩm phổ biến"
          isPending={isPendingLatestProductsData}
          productList={popularProductsData?.result || []}
        />
        <Newsletter />
        <Featured />
      </div>
    </div>
  )
}

export default Home
