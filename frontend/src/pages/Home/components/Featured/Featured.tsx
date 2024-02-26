import Images from '~/constants/images'

const items = [
  {
    image: Images.BEST_PRICES,
    content: 'Giá cả tốt nhất'
  },
  {
    image: Images.DELIVERY,
    content: 'Giao hàng miễn phí'
  },
  {
    image: Images.DEAL,
    content: 'Ưu đãi hàng ngày tuyệt vời'
  },
  {
    image: Images.WIDE_ASSORTMENT,
    content: 'Sản phẩm đa dạng'
  },
  {
    image: Images.EASY_RETURNS,
    content: 'Dễ dàng hoàn trả'
  },
  {
    image: Images.SAFE_DELIVERY,
    content: 'Giao hàng an toàn'
  }
]

function Featured() {
  return (
    <div className="mt-10">
      <div className="grid grid-cols-1 gap-3 xs:grid-cols-1 sm:grid-cols-3 xl:grid-cols-6">
        {items.map((item, index) => (
          <div key={index} className="group rounded-xl bg-[#F4F6FA] p-4">
            <div className="flex h-[84px] items-center justify-start gap-3">
              <img
                className="h-[60px] w-[60px] duration-300 group-hover:-translate-y-1"
                src={item.image}
                alt={item.content}
              />
              <p className="text-lg font-semibold text-secondary">{item.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Featured
