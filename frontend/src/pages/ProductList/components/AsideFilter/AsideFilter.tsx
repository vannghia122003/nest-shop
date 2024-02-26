import { yupResolver } from '@hookform/resolvers/yup'
import { UseQueryResult } from '@tanstack/react-query'
import clsx from 'clsx'
import omit from 'lodash/omit'
import { Controller, useForm } from 'react-hook-form'
import { HiOutlineFilter } from 'react-icons/hi'
import { HiOutlineSquaresPlus } from 'react-icons/hi2'
import { Link, createSearchParams, useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import Button from '~/components/Button'
import InputNumber from '~/components/InputNumber'
import { ProductListParams } from '~/hooks/useProductListParams'
import { CategoryListResponse } from '~/types/category.type'
import RatingStars from '../RatingStars'
import { useEffect } from 'react'

interface Props {
  productListParams: ProductListParams
  categoriesQuery: UseQueryResult<CategoryListResponse, Error>
}

const priceSchema = yup.object({
  price_min: yup
    .string()
    .test({
      name: 'price-not-allowed',
      message: 'Giá không phù hợp',
      test: function (value) {
        const price_min = value
        const { price_max } = this.parent as { price_min: string; price_max: string }
        if (price_min !== '' && price_max !== '') {
          return Number(price_max) >= Number(price_min)
        }
        return true
      }
    })
    .default(''),
  price_max: yup
    .string()
    .test({
      name: 'price-not-allowed',
      message: 'Giá không phù hợp',
      test: function (value) {
        const price_max = value
        const { price_min } = this.parent as { price_min: string; price_max: string }
        if (price_min !== '' && price_max !== '') {
          return Number(price_max) >= Number(price_min)
        }
        return true
      }
    })
    .default('')
})
type FormData = yup.InferType<typeof priceSchema>

function AsideFilter({ categoriesQuery, productListParams }: Props) {
  const navigate = useNavigate()
  const { data: categoriesData, isPending } = categoriesQuery

  const form = useForm<FormData>({
    resolver: yupResolver<FormData>(priceSchema),
    shouldFocusError: false
  })

  useEffect(() => {
    const { price_min, price_max } = productListParams
    if (price_min && Number(price_min)) form.setValue('price_min', price_min)
    if (price_max && Number(price_max)) form.setValue('price_max', price_max)
  }, [form, productListParams])

  const handleFilterPrice = form.handleSubmit((data) => {
    const { price_min, price_max } = data
    if (price_min || price_max) {
      console.log(data)
      navigate(
        {
          search: createSearchParams({
            ...productListParams,
            price_min: data.price_min || '',
            price_max: data.price_max || ''
          }).toString()
        },
        { preventScrollReset: true }
      )
    }
  })

  const handleClearFilter = () => {
    form.reset()
    navigate(
      {
        search: createSearchParams(
          omit({ ...productListParams }, ['rating', 'category_id', 'price_min', 'price_max'])
        ).toString()
      },
      { preventScrollReset: true }
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-2xl border border-[#ececec] shadow">
        <h2 className="text-2xl font-bold text-secondary py-4 px-6 border-b border-primary flex items-center gap-2">
          <HiOutlineSquaresPlus />
          Danh mục
        </h2>
        <div className="max-h-[400px] overflow-y-auto">
          <ul
            className={clsx(
              'hidden_scrollbar flex items-center gap-4 overflow-x-auto lg:flex-col lg:items-stretch p-4',
              { 'animate-pulse': isPending }
            )}
          >
            {!isPending &&
              categoriesData &&
              categoriesData.result?.map((category) => (
                <li key={category._id}>
                  <Link
                    className={clsx(
                      'flex h-[50px] w-[150px] items-center gap-1 rounded-md border border-[#F2F3F4] px-4 py-1 text-center text-sm text-secondary shadow duration-300 hover:border-primary lg:h-auto lg:w-auto lg:text-left lg:text-base',
                      { 'border-primary': productListParams.category_id === category._id }
                    )}
                    to={{
                      search: createSearchParams(
                        omit(
                          {
                            ...productListParams,
                            category_id: category._id
                          },
                          ['page', 'name']
                        )
                      ).toString()
                    }}
                  >
                    <img src={category.image} className="h-8 w-8" alt={category.name} />
                    <p className="line-clamp-2">{category.name}</p>
                  </Link>
                </li>
              ))}
            {isPending &&
              !categoriesData &&
              Array(10)
                .fill(0)
                .map((_, index) => (
                  <li key={index} className="h-[42px] rounded-md bg-gray-200 shadow"></li>
                ))}
          </ul>
        </div>
      </div>
      <div className="rounded-2xl border border-[#ececec] shadow">
        <h2 className="text-2xl font-bold text-secondary py-4 px-6 border-b border-gray-300 flex items-center gap-2">
          <HiOutlineFilter />
          Bộ lọc
        </h2>
        <div className="p-4 border-b border-gray-300">
          <h4 className="text-secondary">Đánh giá</h4>
          <RatingStars productListParams={productListParams} />
        </div>
        <div className="p-4 border-b border-gray-300">
          <h4 className="text-secondary">Khoảng giá</h4>
          <form onSubmit={handleFilterPrice} className="text-secondary" autoComplete="off">
            <div className="my-2 flex flex-col gap-3">
              <div className="flex items-center justify-between gap-4">
                <label htmlFor="price_min" className="text-sm w-[30px] ml-3">
                  Từ
                </label>
                <Controller
                  control={form.control}
                  name="price_min"
                  render={({ field }) => (
                    <InputNumber
                      id="price_min"
                      classNameInput="p-1 text-sm outline-none border rounded border-gray-300 focus:border-primary bg-white"
                      {...field}
                      onChange={(event) => {
                        field.onChange(event)
                        form.trigger('price_max')
                      }}
                    />
                  )}
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <label htmlFor="price_max" className="text-sm w-[30px] ml-3">
                  Đến
                </label>
                <Controller
                  control={form.control}
                  name="price_max"
                  render={({ field }) => (
                    <InputNumber
                      id="price_max"
                      classNameInput="p-1 text-sm outline-none border rounded border-gray-300 focus:border-primary bg-white"
                      {...field}
                      onChange={(event) => {
                        field.onChange(event)
                        form.trigger('price_min')
                      }}
                    />
                  )}
                />
              </div>
              <div className="min-h-[1.25rem] text-sm text-red-600">
                {form.formState.errors.price_min?.message}
              </div>
            </div>
            <Button className="w-full rounded bg-primary py-2 text-sm uppercase text-white hover:bg-[#29A56C]">
              Áp dụng
            </Button>
          </form>
        </div>

        <div className="px-4 py-5">
          <button
            className="w-full rounded bg-primary py-2 text-sm uppercase text-white hover:bg-[#29A56C]"
            onClick={handleClearFilter}
          >
            Xoá tất cả
          </button>
        </div>
      </div>
    </div>
  )
}
export default AsideFilter
