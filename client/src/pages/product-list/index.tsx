import { IconChevronDown } from '@tabler/icons-react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import omit from 'lodash/omit'
import qs from 'qs'
import { Helmet } from 'react-helmet-async'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { categoryApi, productApi } from '@/api'
import AutoPagination from '@/components/auto-pagination'
import Product from '@/components/product'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import useProductQueryParams from '@/hooks/use-product-query-params'
import FilterDialog from '@/pages/product-list/filter-dialog'
import { IProductQueryParams } from '@/types/product'
import { cn } from '@/utils/helper'
import QUERY_KEY from '@/utils/query-key'

const sortMenus: { label: string; sortValue: IProductQueryParams['sortBy'] }[] = [
  { label: 'Popular', sortValue: 'view:DESC' },
  { label: 'Latest', sortValue: 'createdAt:DESC' },
  { label: 'Top sales', sortValue: 'sold:DESC' },
  { label: 'Price low to high', sortValue: 'price:ASC' },
  { label: 'Price high to low', sortValue: 'price:DESC' }
]

function ProductList() {
  const navigate = useNavigate()
  const location = useLocation()
  const productQueryParams = useProductQueryParams()
  const { data: categoriesData, isPending: isPendingCategories } = useQuery({
    queryKey: [QUERY_KEY.CATEGORIES],
    queryFn: () => categoryApi.getAllCategories({ limit: -1 }),
    staleTime: 5 * 60 * 1000
  })
  const { data: productsData, isPending: isPendingProducts } = useQuery({
    queryKey: [QUERY_KEY.PRODUCTS, productQueryParams],
    queryFn: () => productApi.getAllProducts(productQueryParams),
    placeholderData: keepPreviousData
  })

  const isCurrentSort = (sortValue: IProductQueryParams['sortBy']) => {
    return sortValue === productQueryParams.sortBy
  }

  const showLabelCurrentSort = (sortValue: IProductQueryParams['sortBy']) => {
    const currentSort = sortMenus.find((menu) => menu.sortValue === sortValue)
    return currentSort ? currentSort.label : null
  }

  const handleSort = (sortValue: IProductQueryParams['sortBy']) => {
    navigate({
      search: qs.stringify({ ...productQueryParams, sortBy: sortValue })
    })
  }

  return (
    <div className="py-8">
      <Helmet>
        <title>Product List | Nest Shop</title>
        <meta name="description" content="Product List" />
      </Helmet>
      <div className="container">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-3">
            <Card className="sticky top-4 max-h-screen overflow-y-scroll scrollbar-none">
              <CardHeader className="p-4">
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <ul className="flex items-center gap-3 overflow-x-auto scrollbar-none lg:flex-col lg:items-stretch">
                  {!isPendingCategories &&
                    categoriesData &&
                    categoriesData.data.data.map((category) => (
                      <li key={category.id}>
                        <Link
                          to={{
                            search: qs.stringify(
                              omit(
                                {
                                  ...productQueryParams,
                                  searchBy: 'category.id',
                                  search: String(category.id)
                                },
                                ['page', 'filter.name']
                              )
                            )
                          }}
                        >
                          <Card
                            className={cn(
                              'w-[150px] transition-[border] hover:border-primary lg:w-full',
                              productQueryParams.searchBy?.includes('category.id') &&
                                productQueryParams.search === String(category.id) &&
                                'border-primary'
                            )}
                          >
                            <CardContent className="flex items-center p-2">
                              <img
                                src={category.thumbnail}
                                className="size-8"
                                alt={category.name}
                              />
                              <p className="ml-2 line-clamp-2 text-sm">{category.name}</p>
                            </CardContent>
                          </Card>
                        </Link>
                      </li>
                    ))}
                  {isPendingCategories &&
                    !categoriesData &&
                    Array(10)
                      .fill(0)
                      .map((_, index) => <Skeleton key={index} className="h-[42px]" />)}
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="col-span-12 lg:col-span-9">
            <div className="flex justify-between bg-secondary px-4 py-2">
              <div className="mr-2">
                <span className="mr-2 text-sm">Sort by</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="font-normal"
                      rightSection={<IconChevronDown size={16} />}
                    >
                      {showLabelCurrentSort(productQueryParams.sortBy)}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {sortMenus.map((menu) => (
                      <DropdownMenuCheckboxItem
                        key={menu.sortValue}
                        checked={isCurrentSort(menu.sortValue)}
                        onClick={() => handleSort(menu.sortValue)}
                      >
                        {menu.label}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <FilterDialog productQueryParams={productQueryParams} />
            </div>

            {productsData && productsData.data.data.length === 0 && (
              <div className="mt-6 text-center text-xl">No products</div>
            )}

            <div className="my-4 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-4">
              {!isPendingProducts &&
                productsData &&
                productsData.data.data.map((product) => (
                  <Product key={product.id} product={product} />
                ))}
            </div>

            {productsData && productsData.data.meta.totalPages > 0 && (
              <AutoPagination
                page={productsData.data.meta.currentPage}
                pageSize={productsData.data.meta.totalPages}
                pathname={location.pathname}
                queryParams={productQueryParams}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
export default ProductList
