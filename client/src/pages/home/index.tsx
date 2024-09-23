import { useQuery } from '@tanstack/react-query'
import qs from 'qs'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

import { categoryApi, productApi } from '@/api'
import Product from '@/components/product'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'
import IMAGES from '@/utils/images'
import PATH from '@/utils/path'
import QUERY_KEY from '@/utils/query-key'

const features = [
  { image: IMAGES.BEST_PRICES, content: 'Best prices & offers', description: 'Orders $50 or more' },
  { image: IMAGES.DELIVERY, content: 'Free delivery', description: '24/7 amazing services' },
  { image: IMAGES.DEAL, content: 'Great daily deal', description: 'When you sign up' },
  { image: IMAGES.WIDE_ASSORTMENT, content: 'Wide assortment', description: 'Mega Discounts' },
  { image: IMAGES.EASY_RETURNS, content: 'Easy returns', description: 'Within 30 days' },
  { image: IMAGES.SAFE_DELIVERY, content: 'Safe delivery', description: 'Within 30 days' }
]

function Home() {
  const { data: categoriesData } = useQuery({
    queryKey: [QUERY_KEY.CATEGORIES],
    queryFn: () => categoryApi.getAllCategories(),
    staleTime: 5 * 60 * 1000
  })
  const { data: latestProductsData } = useQuery({
    queryFn: () => productApi.getAllProducts({ limit: '12', sortBy: 'createdAt:DESC' }),
    queryKey: [QUERY_KEY.PRODUCTS, 'latest']
  })
  const { data: popularProductsData } = useQuery({
    queryFn: () => productApi.getAllProducts({ limit: '12', sortBy: 'view:DESC' }),
    queryKey: [QUERY_KEY.PRODUCTS, 'popular']
  })
  const { data: bestSellerProductsData } = useQuery({
    queryFn: () => productApi.getAllProducts({ limit: '12', sortBy: 'sold:DESC' }),
    queryKey: [QUERY_KEY.PRODUCTS, 'best-seller']
  })

  return (
    <div className="py-6">
      <Helmet>
        <title>Nest Shop</title>
        <meta name="description" content="Shop online at Nest Shop" />
      </Helmet>
      <div className="container">
        <section className="overflow-hidden rounded-xl">
          <img className="size-full object-cover" src={IMAGES.BANNER} alt="banner" />
        </section>

        {categoriesData && (
          <section className="mt-10">
            <h2 className="mb-4 text-xl text-foreground xs:text-2xl">Categories</h2>
            <Carousel opts={{ slidesToScroll: 'auto' }}>
              <CarouselContent>
                {categoriesData.data.data.map((category) => (
                  <CarouselItem
                    key={category.id}
                    className="xs:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                  >
                    <Link
                      to={{
                        pathname: PATH.PRODUCT_LIST,
                        search: qs.stringify({
                          searchBy: 'category.id',
                          search: String(category.id)
                        })
                      }}
                    >
                      <Card className="transition-[border] hover:border-primary">
                        <CardContent className="p-4">
                          <img
                            className="mx-auto size-1/2 object-cover"
                            src={category.thumbnail}
                            alt={category.name}
                          />
                          <p className="line-clamp-2 h-10 text-center text-sm capitalize">
                            {category.name}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-4" />
              <CarouselNext className="-right-4" />
            </Carousel>
          </section>
        )}

        {latestProductsData && (
          <section className="mt-10">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl text-foreground xs:text-2xl">New Arrivals</h2>
              <Button asChild variant="link">
                <Link
                  to={{
                    pathname: PATH.PRODUCT_LIST,
                    search: qs.stringify({ sortBy: 'createdAt:DESC' })
                  }}
                >
                  View all
                </Link>
              </Button>
            </div>
            <div className="grid gap-4 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {latestProductsData.data.data.map((product) => (
                <Product key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {popularProductsData && (
          <section className="mt-10">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl text-foreground xs:text-2xl">Popular Products</h2>
              <Button asChild variant="link">
                <Link
                  to={{
                    pathname: PATH.PRODUCT_LIST,
                    search: qs.stringify({ sortBy: 'view:DESC' })
                  }}
                >
                  View all
                </Link>
              </Button>
            </div>
            <div className="grid gap-4 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {popularProductsData.data.data.map((product) => (
                <Product key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {bestSellerProductsData && (
          <section className="mt-10">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl text-foreground xs:text-2xl">Best Sellers</h2>
              <Button asChild variant="link">
                <Link
                  to={{
                    pathname: PATH.PRODUCT_LIST,
                    search: qs.stringify({ sortBy: 'sold:DESC' })
                  }}
                >
                  View all
                </Link>
              </Button>
            </div>
            <div className="grid gap-4 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {bestSellerProductsData.data.data.map((product) => (
                <Product key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        <section className="mt-10">
          <div className="grid grid-cols-1 gap-3 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {features.map((feature, index) => (
              <div key={index} className="group rounded-xl bg-secondary p-4">
                <section className="flex h-[84px] items-center justify-start gap-3">
                  <img
                    className="h-[60px] w-[60px] duration-300 group-hover:-translate-y-1"
                    src={feature.image}
                    alt={feature.content}
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{feature.content}</h3>
                    <p className="text-secondary-foreground">{feature.description}</p>
                  </div>
                </section>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
export default Home
