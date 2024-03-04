import { keepPreviousData, useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { Pagination } from 'flowbite-react'
import { FormEvent, useRef, useState } from 'react'
import { FaPlus, FaSearch, FaSync, FaTimes } from 'react-icons/fa'
import categoryApi from '~/apis/category.api'
import productApi from '~/apis/product.api'
import Button from '~/components/Button'
import Input from '~/components/Input'
import Popover from '~/components/Popover'
import { order, sortBy } from '~/constants/product'
import { ProductListQuery } from '~/types/product.type'
import ProductModal from './ProductModal'
import ProductTable from './ProductTable/ProductTable'
import QUERY_KEYS from '~/constants/keys'

const defaultState: ProductListQuery = {
  page: 1,
  limit: 8
  // sort_by: 'createdAt'
}

function ProductAdmin() {
  const modalRef = useRef<{ reset: () => void }>(null)
  const [openModal, setOpenModal] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [updatingProductId, setUpdatingProductId] = useState('')
  const [productListQuery, setProductListQuery] = useState<ProductListQuery>(defaultState)
  const { data: productData, refetch } = useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, productListQuery],
    queryFn: () => productApi.getProducts(productListQuery),
    placeholderData: keepPreviousData
  })
  const { data: categoryListData } = useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES],
    queryFn: () => categoryApi.getCategories(),
    staleTime: 5 * 60 * 1000
  })

  const handlePageChange = (page: number) => {
    setProductListQuery({ ...productListQuery, page })
  }

  const handleSortBy = (sortByValue: Exclude<ProductListQuery['sort_by'], undefined>) => {
    setProductListQuery({ ...productListQuery, sort_by: sortByValue })
  }

  const handlePriceOrder = (orderValue: Exclude<ProductListQuery['order'], undefined>) => {
    setProductListQuery({ ...productListQuery, sort_by: sortBy.price, order: orderValue })
  }

  const showLabelOrder = () => {
    if (!productListQuery.order) return 'Giá'
    if (productListQuery.order === order.asc) return 'Thấp đến cao'
    if (productListQuery.order === order.desc) return 'Cao đến thấp'
  }

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setProductListQuery({ ...productListQuery, name: searchValue })
  }

  const handleCloseModal = () => {
    if (updatingProductId) setUpdatingProductId('')
    setOpenModal(false)
    modalRef.current?.reset()
  }

  const handleUpdateProduct = (productId: string) => {
    setOpenModal(true)
    setUpdatingProductId(productId)
  }

  const showLabelCategory = () => {
    if (!productListQuery.category_id) return 'Danh mục'
    if (productListQuery.category_id) {
      const category = categoryListData?.result.find(
        (category) => category._id === productListQuery.category_id
      )
      return category?.name
    }
  }

  const handleChangeCategory = (category_id: string) => {
    setProductListQuery({ ...productListQuery, category_id, page: 1 })
  }

  const handleClearFilter = () => setProductListQuery(defaultState)

  return (
    <div className="overflow-x-auto shadow py-4 px-8 bg-white">
      <div className="min-w-[1024px] mx-auto">
        <div className="flex justify-between flex-col gap-4 2xl:flex-row py-4 text-secondary">
          <form className="flex gap-2" onSubmit={handleSearch}>
            <div className="relative">
              <Input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                name="name"
                type="text"
                className="w-[320px]"
                placeholder="Tìm kiếm sản phẩm..."
              />
              {searchValue.length > 0 && (
                <button
                  type="button"
                  className="absolute top-1/2 -translate-y-1/2 right-2"
                  onClick={() => setSearchValue('')}
                >
                  <FaTimes />
                </button>
              )}
            </div>
            <Button className="bg-secondary text-white hover:opacity-80 px-4 rounded-md">
              <FaSearch />
            </Button>
          </form>
          <div className="flex items-center gap-2">
            <Popover
              offsetSize={5}
              placement="bottom"
              renderPopover={
                <div className="min-w-[140px] rounded-md border border-[#ececec] bg-white shadow">
                  <div className="py-2 text-secondary max-h-[250px] overflow-y-auto">
                    {categoryListData &&
                      categoryListData.result.map((category) => (
                        <button
                          key={category._id}
                          className="flex items-center justify-between p-2 hover:text-primary sm:px-4 w-full"
                          onClick={() => handleChangeCategory(category._id)}
                        >
                          {category.name}
                        </button>
                      ))}
                  </div>
                </div>
              }
            >
              <button
                className={clsx(
                  'min-w-[140px] rounded-lg border border-[#ececec] bg-white px-4 py-2 text-left shadow duration-300 hover:border-secondary',
                  { 'border-secondary': productListQuery.category_id }
                )}
              >
                {showLabelCategory()}
              </button>
            </Popover>
            <Popover
              offsetSize={5}
              renderPopover={
                <div className="min-w-[140px] rounded-md border border-[#ececec] bg-white shadow">
                  <div className="py-4 text-secondary">
                    <button
                      className="flex items-center justify-between p-2 hover:text-primary sm:px-4"
                      onClick={() => handlePriceOrder(order.asc)}
                    >
                      Thấp đến cao
                    </button>
                    <button
                      className="flex items-center justify-between p-2 hover:text-primary sm:px-4"
                      onClick={() => handlePriceOrder(order.desc)}
                    >
                      Cao đến thấp
                    </button>
                  </div>
                </div>
              }
            >
              <button
                className={clsx(
                  'min-w-[140px] rounded-lg border border-[#ececec] bg-white px-4 py-2 text-left shadow duration-300 hover:border-secondary',
                  { 'border-secondary': productListQuery.sort_by === sortBy.price }
                )}
              >
                {showLabelOrder()}
              </button>
            </Popover>
            <button
              className={clsx(
                'rounded-lg border border-[#ececec] bg-white p-2 shadow duration-300 hover:border-secondary sm:px-4 whitespace-nowrap',
                { 'border-secondary': productListQuery.sort_by === sortBy.popular }
              )}
              onClick={() => handleSortBy(sortBy.popular)}
            >
              Phổ biến
            </button>
            <button
              className={clsx(
                'rounded-lg border border-[#ececec] bg-white p-2 shadow duration-300 hover:border-secondary sm:px-4 whitespace-nowrap',
                { 'border-secondary': productListQuery.sort_by === sortBy.createdAt }
              )}
              onClick={() => handleSortBy(sortBy.createdAt)}
            >
              Mới nhất
            </button>
            <button
              className={clsx(
                'rounded-lg border border-[#ececec] bg-white p-2 shadow duration-300 hover:border-secondary sm:px-4 whitespace-nowrap',
                { 'border-secondary': productListQuery.sort_by === sortBy.sold }
              )}
              onClick={() => handleSortBy(sortBy.sold)}
            >
              Bán chạy
            </button>
            <button
              onClick={handleClearFilter}
              title="Xoá bộ lọc"
              className="rounded-lg border border-[#ececec] bg-white px-3 py-2 shadow duration-300 hover:border-secondary "
            >
              <FaTimes />
            </button>
            <button
              onClick={() => refetch()}
              title="Làm mới"
              className="rounded-lg border border-[#ececec] bg-white px-3 py-2 shadow duration-300 hover:border-secondary "
            >
              <FaSync />
            </button>
            <button
              title="Thêm sản phẩm"
              className="rounded-lg border border-[#ececec] bg-white px-3 py-2 shadow duration-300 hover:border-secondary "
              onClick={() => setOpenModal(true)}
            >
              <FaPlus />
            </button>
          </div>
        </div>
        <ProductTable
          productList={productData?.result || []}
          handleUpdateProduct={handleUpdateProduct}
        />
        <div className="bg-white border-t p-4 flex justify-center">
          <Pagination
            layout="pagination"
            currentPage={productListQuery.page as number}
            totalPages={productData?.total_pages || 1}
            onPageChange={handlePageChange}
            previousLabel=""
            nextLabel=""
            showIcons
          />
        </div>
      </div>
      <ProductModal
        ref={modalRef}
        openModal={openModal}
        onCloseModal={handleCloseModal}
        updatingProductId={updatingProductId}
      />
    </div>
  )
}
export default ProductAdmin
