import { Link, createSearchParams } from 'react-router-dom'
import { SwiperSlide } from 'swiper/react'
import SwiperContainer from '~/components/SwiperContainer'
import path from '~/constants/path'
import { Category } from '~/types/category.type'

interface Props {
  categoryList: Category[]
  isPending: boolean
}

function CategoryList({ categoryList, isPending }: Props) {
  return (
    <div className="mt-10">
      <h2 className="mb-4 text-2xl font-bold text-secondary xs:text-3xl">Danh mục</h2>
      <SwiperContainer row={2} fill="row">
        {isPending &&
          Array(12)
            .fill(0)
            .map((_, index) => (
              <SwiperSlide key={index}>
                <div className="relative h-[160px] w-full animate-pulse rounded-lg border border-gray-100 bg-gray-300">
                  <svg
                    className="absolute right-1/2 top-1/2 h-10 w-10 -translate-y-1/2 translate-x-1/2 text-gray-200"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 18"
                  >
                    <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                  </svg>
                </div>
              </SwiperSlide>
            ))}

        {!isPending &&
          categoryList.map((category) => (
            <SwiperSlide key={category._id}>
              <Link
                to={{
                  pathname: path.productList,
                  search: createSearchParams({
                    category_id: category._id
                  }).toString()
                }}
                className="block rounded-xl border-[1px] border-[#ececec] duration-300 hover:border-primary"
              >
                <div className="overflow-hidden rounded-full">
                  <img className="mx-auto h-1/2 w-1/2" src={category.image} alt={category.name} />
                </div>
                <p className="line-clamp-2 h-[40px] text-center capitalize text-secondary">
                  {category.name}
                </p>
              </Link>
            </SwiperSlide>
          ))}
      </SwiperContainer>
    </div>
  )
}

export default CategoryList
