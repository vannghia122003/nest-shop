import { Link } from 'react-router-dom'

import RatingStar from '@/components/rating-star'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { IProduct } from '@/types/product'
import { formatCurrency, formatNumberToCompactStyle, generateNameId } from '@/utils/helper'
import PATH from '@/utils/path'

interface IProps {
  product: IProduct
}

function Product({ product }: IProps) {
  return (
    <Link to={`${PATH.PRODUCT_LIST}/${generateNameId({ name: product.name, id: product.id })}`}>
      <article>
        <Card className="transition-[border,transform] hover:-translate-y-1 hover:border-primary">
          <CardHeader className="border-b p-0">
            <div className="relative w-full pt-[100%]">
              <img
                className="absolute inset-0 size-full rounded-tl-xl rounded-tr-xl"
                src={product.thumbnail}
                alt={product.name}
              />
            </div>
          </CardHeader>
          <CardContent className="px-3 py-2">
            <h3 className="line-clamp-2 h-[48px] text-base font-semibold">{product.name}</h3>
            <div className="mt-1">
              <div className="font-semibold text-primary">
                {formatCurrency((product.price * (100 - product.discount)) / 100)}
                <sup>₫</sup>
              </div>
              <div className="h-6">
                {product.discount > 0 && (
                  <>
                    <Badge variant="secondary" className="bg-primary/20 px-2 py-0 text-xs">
                      -{product.discount}%
                    </Badge>
                    <sup className="ml-1 text-xs text-secondary-foreground">
                      <del>{formatCurrency(product.price)}₫</del>
                    </sup>
                  </>
                )}
              </div>
              <div className="mt-1 flex justify-between gap-2">
                <RatingStar rating={product.rating} size={14} />
                <span className="text-xs text-secondary-foreground">
                  {formatNumberToCompactStyle(product.sold)} sold
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </article>
    </Link>
  )
}
export default Product
