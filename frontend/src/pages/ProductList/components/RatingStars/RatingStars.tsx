import clsx from 'clsx'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { ProductListParams } from '~/hooks/useProductListParams'

interface Props {
  productListParams: ProductListParams
}

function RatingStars({ productListParams }: Props) {
  const navigate = useNavigate()

  const handleFilterStar = (ratingFilter: number) => {
    navigate({
      search: createSearchParams({
        ...productListParams,
        rating: ratingFilter.toString()
      }).toString()
    })
  }

  return (
    <ul className="mt-2">
      {Array(5)
        .fill(0)
        .map((_, index) => (
          <li className="py-1" key={index}>
            <div
              aria-hidden="true"
              className={clsx('inline-flex cursor-pointer items-center px-3 text-sm', {
                'rounded-xl bg-gray-200': Number(productListParams.rating) === 5 - index
              })}
              onClick={() => handleFilterStar(5 - index)}
            >
              {Array(5)
                .fill(0)
                .map((_, indexStar) => {
                  if (indexStar < 5 - index) {
                    return (
                      <svg
                        key={indexStar}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-6 w-6 cursor-pointer text-yellow-400"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )
                  }
                  return (
                    <svg
                      key={indexStar}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-6 w-6 cursor-pointer text-yellow-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                      />
                    </svg>
                  )
                })}

              {index !== 0 && <span className="ml-1">trở lên</span>}
            </div>
          </li>
        ))}
    </ul>
  )
}

export default RatingStars
