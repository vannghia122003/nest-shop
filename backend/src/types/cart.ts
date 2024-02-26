export interface UpdateCartReqBody {
  buy_count: number
}

export interface AddToCartReqBody {
  product_id: string
  buy_count: number
}

export interface DeleteCartReqBody {
  product_ids: string[]
}

export interface BuyProductsReqBody {
  product_ids: string[]
}

export interface CartIdReqParams {
  cart_id: string
}
