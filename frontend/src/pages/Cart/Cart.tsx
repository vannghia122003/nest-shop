import { useMutation, useQuery } from '@tanstack/react-query'
import keyBy from 'lodash/keyBy'
import { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import cartApi from '~/apis/cart.api'
import Button from '~/components/Button'
import QuantityController from '~/components/QuantityController'
import Images from '~/constants/images'
import QUERY_KEYS from '~/constants/keys'
import path from '~/constants/path'
import { ProductLineItem } from '~/types/product.type'
import { formatCurrency, generateNameId } from '~/utils/helpers'

export interface CartItem extends ProductLineItem {
  disabled: boolean
  checked: boolean
}

function Cart() {
  const [cart, setCart] = useState<CartItem[]>([])
  const { data: productsInCartData, refetch } = useQuery({
    queryKey: [QUERY_KEYS.CART],
    queryFn: cartApi.getCart,
    staleTime: 5 * 60 * 1000
  })
  const updateCartMutation = useMutation({
    mutationFn: cartApi.updateCart,
    onSuccess: () => {
      refetch()
    }
  })
  const deleteProductMutation = useMutation({
    mutationFn: cartApi.deleteProductsInCart,
    onSuccess: () => {
      refetch()
    }
  })
  const buyProductsMutation = useMutation({
    mutationFn: cartApi.buyProducts,
    onSuccess: (data) => {
      refetch()
      toast.success(data.message)
    }
  })
  const productsInCart = productsInCartData?.result
  const isAllChecked = useMemo(
    () => cart.length !== 0 && cart.every((product) => product.checked),
    [cart]
  )
  const checkedProducts = cart.filter((product) => product.checked)
  const checkedProductsCount = checkedProducts.length
  const checkedProductsTotalPrice = useMemo(
    () =>
      checkedProducts.reduce(
        (totalPrice, product) => totalPrice + product.product_detail.price * product.buy_count,
        0
      ),
    [checkedProducts]
  )

  useEffect(() => {
    setCart((prev) => {
      const cartObject = keyBy(prev, 'product_id')

      return (
        productsInCart?.map((product) => ({
          ...product,
          disabled: false,
          checked: Boolean(cartObject[product.product_id]?.checked)
        })) || []
      )
    })
  }, [productsInCart])

  const handleCheck = (productIndex: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCart = [...cart]
    newCart[productIndex].checked = e.target.checked
    setCart(newCart)
  }

  const handleCheckAll = () => {
    setCart((prev) => prev.map((product) => ({ ...product, checked: !isAllChecked })))
  }

  const handleChangeQuantity = (productIndex: number) => (value: number) => {
    const product = cart[productIndex]
    const newCart = [...cart]
    // kiểm tra nếu value k đổi thì k gọi api
    if ((productsInCart as ProductLineItem[])[productIndex].buy_count === value) return

    newCart[productIndex].disabled = true
    setCart(newCart)
    updateCartMutation.mutate({ product_id: product.product_id, buy_count: value })
  }

  const handleTypeQuantity = (productIndex: number) => (value: number) => {
    const newCart = [...cart]
    newCart[productIndex].buy_count = value
    setCart(newCart)
  }

  const handleDeleteProduct = (productIndex: number) => () => {
    const product_id = cart[productIndex].product_id
    deleteProductMutation.mutate([product_id])
  }

  const handleDeleteManyProduct = () => {
    if (checkedProductsCount > 0) {
      const productIds = checkedProducts.map((product) => product.product_id)
      deleteProductMutation.mutate(productIds)
    } else {
      toast.info('Vui lòng chọn sản phẩm')
    }
  }

  const handleBuyProducts = () => {
    if (checkedProductsCount > 0) {
      const productIds = checkedProducts.map((product) => product.product_id)
      buyProductsMutation.mutate(productIds)
    } else {
      toast.info('Bạn vẫn chưa chọn sản phẩm nào để mua')
    }
  }

  return (
    <div className="pb-10 pt-6">
      <Helmet>
        <title>Giỏ hàng</title>
        <meta name="description" content="Giỏ hàng" />
      </Helmet>
      <div className="container">
        <h2 className="text-center text-5xl font-bold text-secondary">Giỏ hàng</h2>
        {cart.length > 0 ? (
          <>
            <div className="mt-4 overflow-auto border border-[#e9ecef]">
              <div className="min-w-[1024px]">
                <div className="grid grid-cols-12 gap-6 rounded-sm bg-gray-200 px-9 py-5 font-bold capitalize text-secondary shadow">
                  <div className="col-span-6">
                    <div className="flex items-center">
                      <div className="flex flex-shrink-0 items-center justify-center pr-3">
                        <input
                          type="checkbox"
                          className="h-5 w-5 accent-primary"
                          checked={isAllChecked}
                          onChange={handleCheckAll}
                        />
                      </div>
                      <div className="flex-grow text-secondary">Sản phẩm</div>
                    </div>
                  </div>

                  <div className="col-span-6">
                    <div className="grid grid-cols-5 gap-6 text-center">
                      <div className="col-span-2 whitespace-nowrap">Đơn giá</div>
                      <div className="col-span-1 whitespace-nowrap">Số lượng</div>
                      <div className="col-span-1 whitespace-nowrap">Số tiền</div>
                      <div className="col-span-1 whitespace-nowrap">Thao tác</div>
                    </div>
                  </div>
                </div>

                {cart.length > 0 && (
                  <div className="flex flex-col gap-4 rounded-sm bg-white p-4 shadow">
                    {cart.map((product, index) => (
                      <div
                        key={product.product_id}
                        className="grid grid-cols-12 items-center gap-6 rounded-sm border border-gray-200 bg-white p-4 text-secondary"
                      >
                        <div className="col-span-6">
                          <div className="flex">
                            <div className="flex flex-shrink-0 items-center justify-center pr-3">
                              <input
                                type="checkbox"
                                className="h-5 w-5 accent-primary"
                                checked={product.checked}
                                onChange={handleCheck(index)}
                              />
                            </div>
                            <div className="flex-grow">
                              <div className="flex">
                                <Link
                                  to={`${path.productDetail}${generateNameId({
                                    name: product.product_detail.name,
                                    id: product.product_id
                                  })}`}
                                  className="h-20 w-20 flex-shrink-0"
                                  title={product.product_detail.name}
                                >
                                  <img
                                    src={product.product_detail.image}
                                    alt={product.product_detail.name}
                                  />
                                </Link>
                                <div className="flex-grow px-2 pb-2 pt-1">
                                  <Link
                                    to={`${path.productDetail}${generateNameId({
                                      name: product.product_detail.name,
                                      id: product.product_id
                                    })}`}
                                    title={product.product_detail.name}
                                    className="line-clamp-2"
                                  >
                                    {product.product_detail.name}
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="col-span-6">
                          <div className="grid grid-cols-5 place-items-center justify-center gap-6">
                            <div className="col-span-2 font-medium">
                              {formatCurrency(product.product_detail.price)}₫
                            </div>
                            <div className="col-span-1">
                              <QuantityController
                                max={product.product_detail.quantity}
                                value={product.buy_count}
                                disabled={product.disabled}
                                onIncrease={handleChangeQuantity(index)}
                                onDecrease={handleChangeQuantity(index)}
                                onType={handleTypeQuantity(index)}
                                onFocusOut={handleChangeQuantity(index)}
                              />
                            </div>
                            <div className="col-span-1">
                              <span className="text-primary">
                                {formatCurrency(product.product_detail.price * product.buy_count)}₫
                              </span>
                            </div>
                            <div className="col-span-1">
                              <button
                                className="transition-colors hover:text-primary"
                                onClick={handleDeleteProduct(index)}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="h-6 w-6"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {/* {isFetching && (
                      <>
                        <CartItemSkeleton />
                        <CartItemSkeleton />
                        <CartItemSkeleton />
                      </>
                    )} */}
                  </div>
                )}
              </div>
            </div>
            <div className="sticky bottom-0 mt-8 flex flex-col gap-6 md:gap-4 rounded-sm border border-[#e9ecef] bg-white p-4 text-secondary shadow md:flex-row md:items-center">
              <div className="flex flex-shrink-0 items-center justify-center">
                <div className="flex flex-shrink-0 items-center justify-center">
                  <input
                    type="checkbox"
                    className="h-5 w-5 accent-primary"
                    checked={isAllChecked}
                    onChange={handleCheckAll}
                  />
                </div>
                <button className="mx-3 border-none bg-none" onClick={handleCheckAll}>
                  Chọn tất cả ({cart.length})
                </button>
                <button className="mx-3 border-none bg-none" onClick={handleDeleteManyProduct}>
                  Xoá
                </button>
              </div>

              <div className="flex flex-col gap-4 md:ml-auto md:flex-row md:items-center">
                <div className="flex items-center justify-center flex-col lg:flex-row md:justify-end">
                  <div>Tổng thanh toán ({checkedProductsCount} sản phẩm):</div>
                  <div className="ml-2 text-2xl text-primary">
                    {formatCurrency(checkedProductsTotalPrice)}₫
                  </div>
                </div>
                <Button
                  className="mx-auto h-10 w-52 rounded-sm bg-primary text-center font-bold text-white hover:bg-[#29A56C] duration-300"
                  onClick={handleBuyProducts}
                  disabled={buyProductsMutation.isPending}
                >
                  Mua hàng
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center">
            <img src={Images.EMPTY_CART} alt="empty cart" className="mx-auto" />
            <div className="font-bold">Giỏ hàng của bạn còn trống</div>
            <Link
              to={path.home}
              className="mt-5 inline-block bg-primary px-6 py-2 uppercase text-white hover:bg-[#29A56C]"
            >
              Mua ngay
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart
