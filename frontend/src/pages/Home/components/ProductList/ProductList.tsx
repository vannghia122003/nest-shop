import { Link, To } from 'react-router-dom'
import { SwiperSlide } from 'swiper/react'
import Product from '~/components/Product'
import ProductSkeleton from '~/components/ProductSkeleton'
import SwiperContainer from '~/components/SwiperContainer'
import { Product as ProductType } from '~/types/product.type'

interface Props {
  productList: ProductType[]
  title: string
  isNew?: boolean
  isPending: boolean
  to: To
}

function ProductList({ productList, title, isPending, isNew, to }: Props) {
  return (
    <div className="mt-10">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="text-2xl font-bold text-secondary xs:text-3xl">{title}</h2>
        <Link
          to={to}
          className="flex items-center justify-between text-primary opacity-70 duration-300 hover:opacity-100"
        >
          <span>Xem tất cả</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </Link>
      </div>
      <SwiperContainer row={1}>
        {isPending &&
          Array(5)
            .fill(0)
            .map((_, index) => (
              <SwiperSlide key={index}>
                <ProductSkeleton />
              </SwiperSlide>
            ))}
        {!isPending &&
          productList.map((product) => (
            <SwiperSlide key={product._id}>
              <Product isNew={isNew} product={product} />
            </SwiperSlide>
          ))}
      </SwiperContainer>
    </div>
  )
}

export default ProductList
