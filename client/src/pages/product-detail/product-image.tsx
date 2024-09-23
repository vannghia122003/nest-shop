import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import { useEffect, useMemo, useRef, useState } from 'react'

import { IProduct } from '@/types/product'

interface Props {
  product?: IProduct
}

function ProductImage({ product }: Props) {
  const imageRef = useRef<HTMLImageElement>(null)
  const [activeImage, setActiveImage] = useState('')
  const [currentIndexImages, setCurrentIndexImages] = useState([0, 4])
  const currentImages = useMemo(
    () => (product ? product.photos.slice(...currentIndexImages) : []),
    [currentIndexImages, product]
  )

  useEffect(() => {
    if (product && product.photos.length > 0) {
      setActiveImage(product.photos[0].url)
    }
  }, [product])

  const next = () => {
    if (currentIndexImages[1] < product!.photos.length) {
      setCurrentIndexImages((prev) => [prev[0] + 1, prev[1] + 1])
    }
  }
  const prev = () => {
    if (currentIndexImages[0] > 0) {
      setCurrentIndexImages((prev) => [prev[0] - 1, prev[1] - 1])
    }
  }
  const handleHoverImg = (img: string) => {
    setActiveImage(img)
  }

  return (
    <>
      <div className="relative w-full overflow-hidden border border-gray-300 pt-[100%] shadow">
        <img
          className="l-0 pointer-events-none absolute top-0 size-full object-cover"
          ref={imageRef}
          src={activeImage}
          alt={product?.name}
        />
      </div>
      <div className="relative mt-4 grid grid-cols-4 gap-5">
        <button
          className="absolute left-0 top-1/2 z-[1] h-9 -translate-y-1/2 bg-black/30 text-white"
          onClick={prev}
        >
          <IconChevronLeft />
        </button>
        {currentImages.map((photo) => {
          const isActive = photo.url === activeImage
          return (
            <div
              className="relative w-full cursor-pointer pt-[100%]"
              key={photo.id}
              onMouseEnter={() => handleHoverImg(photo.url)}
            >
              <img className="l-0 absolute top-0 size-full" src={photo.url} alt={photo.url} />
              {isActive ? (
                <div className="absolute inset-0 border-4 border-primary" />
              ) : (
                <div className="absolute inset-0 border border-gray-300" />
              )}
            </div>
          )
        })}
        <button
          className="absolute right-0 top-1/2 z-[1] h-9 -translate-y-1/2 bg-black/30 text-white"
          onClick={next}
        >
          <IconChevronRight />
        </button>
      </div>
    </>
  )
}
export default ProductImage
