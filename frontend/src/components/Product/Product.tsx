import { Link } from 'react-router-dom'
import path from '~/constants/path'
import { Product } from '~/types/product.type'
import { formatCurrency, formatNumberToCompactStyle, generateNameId } from '~/utils/helpers'
import ProductRating from '../ProductRating'

interface Props {
  isNew?: boolean
  product: Product
}

function Product({ isNew, product }: Props) {
  return (
    <Link to={`${path.productList}/${generateNameId({ name: product.name, id: product._id })}`}>
      <div className="select-none overflow-hidden rounded-lg border border-gray-100 bg-white shadow duration-300 hover:-translate-y-1 hover:border-primary">
        <div className="relative w-full pt-[100%]">
          <img
            className="l-0 absolute top-0 h-full w-full"
            src={product.image}
            alt={product.name}
          />
          {isNew && (
            <div className="absolute right-0 top-0 rounded-bl-3xl rounded-tr-lg bg-primary px-4 py-2 text-xs text-white">
              New
            </div>
          )}
        </div>
        <div className="p-2">
          <p className="mb-2 line-clamp-2 h-[48px] text-base font-bold text-secondary">
            {product.name}
          </p>

          <div className="mb-2 flex items-center justify-start">
            <div className="flex items-center">
              <ProductRating rating={product.rating} />
              <span className="ml-1 text-xs">({product.rating})</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="text-primary">
              <span className="text-lg font-bold">{formatCurrency(product.price)}₫</span>
            </div>
            <div className="text-xs text-secondary">
              <div className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>{formatNumberToCompactStyle(product.view)}</span>
              </div>
              <div>Đã bán {formatNumberToCompactStyle(product.sold)}</div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default Product
