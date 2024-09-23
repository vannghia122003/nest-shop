import { zodResolver } from '@hookform/resolvers/zod'
import { IconTrash } from '@tabler/icons-react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Path, PathValue, useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

import { cartApi, orderApi, provinceApi } from '@/api'
import FormComboBox from '@/components/form-input/form-combo-box'
import FormText from '@/components/form-input/form-text'
import QuantityInput from '@/components/quantity-input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { ICreateOrderBody } from '@/types/order'
import { ICartItem } from '@/types/product'
import { formatCurrency, generateNameId, handleUnprocessableEntityError } from '@/utils/helper'
import IMAGES from '@/utils/images'
import PATH from '@/utils/path'
import QUERY_KEY from '@/utils/query-key'

interface ICartItemExtended extends ICartItem {
  disabled: boolean
}

const schema = z.object({
  province: z.object({ code: z.number(), name: z.string() }, { message: 'Province is required' }),
  district: z.object({ code: z.number(), name: z.string() }, { message: 'District is required' }),
  ward: z.object({ code: z.number(), name: z.string() }, { message: 'Ward is required' }),
  address: z.string().min(1, { message: 'Address is required' })
})
type FormData = z.infer<typeof schema>

function Cart() {
  const [cart, setCart] = useState<ICartItemExtended[]>([])
  const deleteProductMutation = useMutation({ mutationFn: cartApi.deleteProduct })
  const updateCartMutation = useMutation({ mutationFn: cartApi.updateCart })
  const createOrderMutation = useMutation({ mutationFn: orderApi.createOrder })
  const { data: cartData, refetch } = useQuery({
    queryKey: [QUERY_KEY.CART],
    queryFn: cartApi.getCart
  })
  const productsInCart = cartData?.data
  const totalPrice = useMemo(
    () =>
      cart.reduce(
        (totalPrice, cartItem) =>
          totalPrice +
          ((cartItem.product.price * (100 - cartItem.product.discount)) / 100) * cartItem.quantity,
        0
      ),
    [cart]
  )

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { address: '' },
    shouldFocusError: false
  })
  const province = form.watch('province')
  const district = form.watch('district')

  const { data: provincesData } = useQuery({
    queryKey: [QUERY_KEY.PROVINCES],
    queryFn: provinceApi.getAllProvinces
  })
  const { data: provinceDetailData } = useQuery({
    queryKey: [QUERY_KEY.PROVINCE_DETAIL, province],
    queryFn: () => provinceApi.getProvince(province!.code),
    enabled: Boolean(province)
  })
  const { data: districtDetailData } = useQuery({
    queryKey: [QUERY_KEY.PROVINCE_DETAIL, district],
    queryFn: () => provinceApi.getDistrict(district!.code),
    enabled: Boolean(district)
  })

  useEffect(() => {
    if (productsInCart) {
      setCart(productsInCart.map((product) => ({ ...product, disabled: false })))
    }
  }, [productsInCart])

  const handleTypeQuantity = (productIndex: number, value: number) => {
    const newCart = [...cart]
    newCart[productIndex].quantity = value
    setCart(newCart)
  }

  const handleChangeQuantity = async (productIndex: number, value: number) => {
    const product = cart[productIndex].product
    const newCart = [...cart]
    if (productsInCart![productIndex].quantity === value) return
    newCart[productIndex].disabled = true
    setCart(newCart)
    await updateCartMutation.mutateAsync({ productId: product.id, quantity: value })
    await refetch()
  }

  const handleDeleteProduct = async (productId: number) => {
    await deleteProductMutation.mutateAsync({ productIds: [productId] })
    await refetch()
  }

  const handleSelect = (name: Path<FormData>, value: PathValue<FormData, Path<FormData>>) => {
    if (name === 'province' && form.getValues('province')) {
      form.resetField('district')
      form.resetField('ward')
    }
    if (name === 'district' && form.getValues('district')) {
      form.resetField('ward')
    }
    form.setValue(name, value)
    form.clearErrors(name)
  }

  const handleCheckout = form.handleSubmit(async (values) => {
    const body: ICreateOrderBody = {
      province: values.province?.name,
      district: values.district?.name,
      ward: values.ward?.name,
      address: values.address
    }
    try {
      const res = await createOrderMutation.mutateAsync(body)
      await refetch()
      toast.success(res.message)
      form.reset()
    } catch (error) {
      handleUnprocessableEntityError(error, form.setError)
    }
  })

  return (
    <div className="pb-10 pt-6">
      <Helmet>
        <title>Cart</title>
        <meta name="description" content="Cart" />
      </Helmet>
      <div className="container">
        <div className="grid grid-cols-12 gap-6">
          <Card className="col-span-12 lg:col-span-8">
            <CardHeader className="p-4">
              <CardTitle className="text-2xl">Cart</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              {cart.length > 0 ? (
                <div className="overflow-auto border">
                  <div className="min-w-[768px]">
                    <div className="sticky top-0 grid grid-cols-12 gap-2 px-9 py-5 font-bold capitalize">
                      <div className="col-span-4">Product</div>
                      <div className="col-span-8">
                        <div className="grid grid-cols-5 gap-6 whitespace-nowrap text-center">
                          <div className="col-span-2">Unit Price</div>
                          <div className="col-span-1">Quantity</div>
                          <div className="col-span-1">Total Price</div>
                          <div className="col-span-1">Actions</div>
                        </div>
                      </div>
                    </div>
                    {cart.map((cartItem, index) => {
                      const productId = cartItem.product.id
                      const path = `${PATH.PRODUCT_DETAIL}${generateNameId({
                        name: cartItem.product.name,
                        id: productId
                      })}`
                      const discountPrice =
                        (cartItem.product.price * (100 - cartItem.product.discount)) / 100

                      return (
                        <div
                          key={cartItem.id}
                          className="grid grid-cols-12 items-center gap-2 border-t p-4"
                        >
                          <div className="col-span-4 flex">
                            <Link
                              to={path}
                              className="size-20 flex-shrink-0"
                              title={cartItem.product.name}
                            >
                              <img src={cartItem.product.thumbnail} alt={cartItem.product.name} />
                            </Link>
                            <div className="flex-grow px-2 pb-2 pt-1">
                              <Link
                                to={path}
                                title={cartItem.product.name}
                                className="line-clamp-2"
                              >
                                {cartItem.product.name}
                              </Link>
                            </div>
                          </div>
                          <div className="col-span-8">
                            <div className="grid grid-cols-5 place-items-center justify-center gap-6">
                              <div className="col-span-2">
                                <span className="mr-1 font-semibold text-primary">
                                  {formatCurrency(discountPrice)}
                                  <sup>₫</sup>
                                </span>
                                <del className="text-secondary-foreground">
                                  {formatCurrency(cartItem.product.price)}
                                  <sup>₫</sup>
                                </del>
                              </div>
                              <div className="col-span-1">
                                <QuantityInput
                                  max={cartItem.product.stock}
                                  value={cartItem.quantity}
                                  disabled={cartItem.disabled}
                                  onType={(value) => handleTypeQuantity(index, value)}
                                  onIncrease={(value) => handleChangeQuantity(index, value)}
                                  onDecrease={(value) => handleChangeQuantity(index, value)}
                                  onFocusOut={(value) => handleChangeQuantity(index, value)}
                                />
                              </div>
                              <div className="col-span-1">
                                <div className="font-semibold text-primary">
                                  <span>{formatCurrency(discountPrice * cartItem.quantity)}</span>
                                  <sup>₫</sup>
                                </div>
                              </div>
                              <div className="col-span-1">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleDeleteProduct(cartItem.product.id)}
                                >
                                  <IconTrash />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <img src={IMAGES.EMPTY_CART} alt="empty cart" className="inline-block" />
                  <p className="font-bold">Your shopping cart is empty</p>
                  <Button asChild className="mb-6 mt-2">
                    <Link to={PATH.PRODUCT_LIST}>Go Shopping Now</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="col-span-12 lg:col-span-4">
            <CardHeader className="p-4">
              <CardTitle className="text-2xl">Check out</CardTitle>
            </CardHeader>
            <CardContent className="px-4">
              <Form {...form}>
                <form onSubmit={handleCheckout}>
                  <div className="grid grid-cols-1 gap-4">
                    <FormComboBox
                      form={form}
                      name="province"
                      label="Province"
                      placeholder="Select province"
                      disabled={cart.length === 0}
                      data={provincesData?.map((province) => ({
                        label: province.name,
                        value: { code: province.code, name: province.name }
                      }))}
                      onSelect={(name, value) => handleSelect(name, value)}
                    />
                    <FormComboBox
                      form={form}
                      name="district"
                      label="District"
                      placeholder="Select district"
                      disabled={!province || cart.length === 0}
                      data={provinceDetailData?.districts.map((district) => ({
                        label: district.name,
                        value: { code: district.code, name: district.name }
                      }))}
                      onSelect={(name, value) => handleSelect(name, value)}
                    />
                    <FormComboBox
                      form={form}
                      name="ward"
                      label="Ward"
                      placeholder="Select ward"
                      disabled={!district || cart.length === 0}
                      data={districtDetailData?.wards.map((ward) => ({
                        label: ward.name,
                        value: { code: ward.code, name: ward.name }
                      }))}
                      onSelect={(name, value) => handleSelect(name, value)}
                    />
                    <FormText
                      form={form}
                      name="address"
                      label="Address"
                      placeholder="Enter your address"
                      disabled={cart.length === 0}
                    />
                  </div>
                  <div className="mt-4">
                    <span>Total ({cart.length} item):</span>
                    <span className="ml-2 text-xl font-semibold text-primary">
                      {formatCurrency(totalPrice)} <sup>₫</sup>
                    </span>
                  </div>
                  <Button type="submit" className="mt-4 w-full" disabled={cart.length === 0}>
                    Check out
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Cart
