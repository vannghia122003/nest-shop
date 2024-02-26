import 'swiper/css'
import 'swiper/css/grid'
import 'swiper/css/navigation'
import { Grid, Navigation, Pagination } from 'swiper/modules'
import { Swiper } from 'swiper/react'
// import Navigation from './Navigation'

interface Props {
  children: React.ReactNode
  row?: number
  fill?: 'row' | 'column'
}

function SwiperContainer({ children, row, fill }: Props) {
  return (
    <Swiper
      modules={[Grid, Navigation, Pagination]}
      // className="!sm:-mx-[14px] !sm:px-[14px] relative !-mx-[10px] !px-[10px] !py-1"
      className="!-mx-[10px] !px-[10px] !py-1"
      navigation
      grid={{
        rows: row,
        fill: fill
      }}
      slidesPerView={2}
      spaceBetween={10}
      breakpoints={{
        576: {
          slidesPerView: 3,
          spaceBetween: 16
        },
        768: {
          slidesPerView: 4,
          spaceBetween: 16
        },
        1024: {
          slidesPerView: 5,
          spaceBetween: 16
        }
      }}
      updateOnWindowResize
    >
      {children}
      {/* <Navigation /> */}
    </Swiper>
  )
}

export default SwiperContainer
