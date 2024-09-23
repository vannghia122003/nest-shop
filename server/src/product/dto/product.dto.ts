class AttributeDto {
  id: number
  key: string
  value: string
}

class PhotoDto {
  id: string
  url: string
}

export class ProductDto {
  id: number
  name: string
  description: string
  thumbnail: string
  price: number
  stock: number
  sold: number
  discount: number
  view: number
  isPublished: boolean
  updatedAt: Date
  createdAt: Date
  category: { id: number; name: string; thumbnail: string; updatedAt: Date; createdAt: Date }
  attributes: AttributeDto[]
  photos: PhotoDto[]
}
