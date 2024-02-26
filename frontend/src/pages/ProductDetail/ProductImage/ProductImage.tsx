import { useEffect, useMemo, useRef, useState } from 'react'
import { Product } from '~/types/product.type'

interface Props {
  product?: Product
}

function ProductImage({ product }: Props) {
  const imageRef = useRef<HTMLImageElement>(null)
  const [activeImage, setActiveImage] = useState('')
  const [currentIndexImages, setCurrentIndexImages] = useState([0, 4])
  const currentImages = useMemo(
    () => (product ? product.images.slice(...currentIndexImages) : []),
    [currentIndexImages, product]
  )

  useEffect(() => {
    if (product && product.images.length > 0) {
      setActiveImage(product.images[0])
    }
  }, [product])

  const next = () => {
    if (currentIndexImages[1] < (product as Product).images.length) {
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

  const handleZoom = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const image = imageRef.current as HTMLImageElement
    const rect = event.currentTarget.getBoundingClientRect()
    const { naturalWidth, naturalHeight } = image
    const { offsetX, offsetY } = event.nativeEvent
    const top = offsetY * (1 - naturalHeight / rect.height)
    const left = offsetX * (1 - naturalWidth / rect.width)
    image.style.width = naturalWidth + 'px'
    image.style.height = naturalHeight + 'px'
    image.style.maxWidth = 'unset'
    image.style.top = top + 'px'
    image.style.left = left + 'px'
  }

  const handleRemoveZoom = () => {
    imageRef.current?.removeAttribute('style')
  }

  return (
    <>
      <div
        className="relative w-full cursor-zoom-in overflow-hidden rounded-2xl border border-gray-300 pt-[100%] shadow"
        onMouseMove={handleZoom}
        onMouseLeave={handleRemoveZoom}
      >
        <img
          className="l-0 pointer-events-none absolute top-0 h-full w-full rounded-2xl"
          ref={imageRef}
          src={activeImage}
          alt={product?.name}
        />
      </div>
      <div className="relative mt-7 grid grid-cols-4 gap-5">
        <button
          className="absolute left-0 top-1/2 z-[1] h-9 w-5 -translate-y-1/2 bg-black/30 text-white"
          onClick={prev}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        {currentImages.map((img) => {
          const isActive = img === activeImage
          return (
            <div
              className="relative w-full cursor-pointer pt-[100%]"
              key={img}
              onMouseEnter={() => handleHoverImg(img)}
            >
              <img className="l-0 absolute top-0 h-full w-full rounded-2xl" src={img} alt={img} />
              {isActive ? (
                <div className="absolute inset-0 rounded-2xl border-4 border-primary" />
              ) : (
                <div className="absolute inset-0 rounded-2xl border border-gray-300" />
              )}
            </div>
          )
        })}
        <button
          className="absolute right-0 top-1/2 z-[1] h-9 w-5 -translate-y-1/2 bg-black/30 text-white"
          onClick={next}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
    </>
  )
}
export default ProductImage
