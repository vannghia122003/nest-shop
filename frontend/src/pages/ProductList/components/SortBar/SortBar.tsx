import clsx from 'clsx'
import omit from 'lodash/omit'
import { createSearchParams, useNavigate } from 'react-router-dom'
import Popover from '~/components/Popover'
import { order as orderConstant, sortBy } from '~/constants/product'
import { ProductListParams } from '~/hooks/useProductListParams'
import { ProductListQuery } from '~/types/product.type'

interface Props {
  productListParams: ProductListParams
}

function SortBar({ productListParams }: Props) {
  const navigate = useNavigate()
  const { order, sort_by } = productListParams

  const isActiveSortBy = (sortByValue: Exclude<ProductListQuery['sort_by'], undefined>) =>
    sort_by === sortByValue
  const handleSortBy = (sortByValue: Exclude<ProductListQuery['sort_by'], undefined>) => {
    navigate({
      pathname: '',
      search: createSearchParams(
        omit(
          {
            ...productListParams,
            sort_by: sortByValue
          },
          ['order']
        )
      ).toString()
    })
  }
  const showLabelOrder = () => {
    if (!order) return 'Giá'
    if (order === orderConstant.asc) return 'Thấp đến cao'
    if (order === orderConstant.desc) return 'Cao đến thấp'
  }
  const isActiveOrder = (orderValue: Exclude<ProductListQuery['order'], undefined>) =>
    order === orderValue
  const handlePriceOrder = (orderValue: Exclude<ProductListQuery['order'], undefined>) => {
    navigate({
      pathname: '',
      search: createSearchParams({
        ...productListParams,
        sort_by: sortBy.price,
        order: orderValue
      }).toString()
    })
  }

  return (
    <div className="flex items-center gap-4 rounded bg-[#f5f5f5] px-2 py-4 text-secondary">
      <span className="hidden sm:block">Sắp xếp theo</span>
      <div className="flex flex-wrap items-center justify-center gap-2 xs:flex-nowrap">
        <button
          className={clsx(
            'whitespace-nowrap rounded-lg border border-[#ececec] bg-white px-2 py-2 shadow duration-300 hover:border-primary sm:px-4',
            {
              'border-primary text-primary': isActiveSortBy(sortBy.popular)
            }
          )}
          onClick={() => handleSortBy(sortBy.popular)}
        >
          Phổ biến
        </button>
        <button
          className={clsx(
            'whitespace-nowrap rounded-lg border border-[#ececec] bg-white px-2 py-2 shadow duration-300 hover:border-primary sm:px-4',
            {
              'border-primary text-primary': isActiveSortBy(sortBy.createdAt)
            }
          )}
          onClick={() => handleSortBy(sortBy.createdAt)}
        >
          Mới nhất
        </button>
        <button
          className={clsx(
            'whitespace-nowrap rounded-lg border border-[#ececec] bg-white px-2 py-2 shadow duration-300 hover:border-primary sm:px-4',
            {
              'border-primary text-primary': isActiveSortBy(sortBy.sold)
            }
          )}
          onClick={() => handleSortBy(sortBy.sold)}
        >
          Bán chạy
        </button>
        <Popover
          offsetSize={0}
          renderPopover={
            <div className="min-w-[140px] rounded-md border border-[#ececec] bg-white shadow sm:min-w-[160px]">
              <ul className="py-4 text-secondary">
                <li
                  aria-hidden="true"
                  className="flex cursor-pointer items-center justify-between px-2 py-2 hover:text-primary sm:px-4"
                  onClick={() => handlePriceOrder(orderConstant.asc)}
                >
                  <span>Thấp đến cao</span>
                  {isActiveOrder(orderConstant.asc) && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-5 w-5 text-primary"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                  )}
                </li>
                <li
                  aria-hidden="true"
                  className="flex cursor-pointer items-center justify-between px-2 py-2 hover:text-primary sm:px-4"
                  onClick={() => handlePriceOrder(orderConstant.desc)}
                >
                  <span>Cao đến thấp</span>
                  {isActiveOrder(orderConstant.desc) && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-5 w-5 text-primary"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                  )}
                </li>
              </ul>
            </div>
          }
        >
          <button
            className={clsx(
              'min-w-[140px] rounded-lg border border-[#ececec] bg-white px-2 py-2 text-left shadow duration-300 hover:border-primary sm:min-w-[160px] sm:px-4',
              {
                'border-primary text-primary': isActiveSortBy(sortBy.price)
              }
            )}
          >
            {showLabelOrder()}
          </button>
        </Popover>
      </div>
    </div>
  )
}

export default SortBar
