import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { useSwiper } from 'swiper/react'

function Navigation() {
  const swiper = useSwiper()
  const [slideConfig, setSlideConfig] = useState({
    isBeginning: swiper.isBeginning,
    isEnd: swiper.isEnd
  })

  useEffect(() => {
    swiper.on('slideChange', (swipe) => {
      setSlideConfig({ isBeginning: swipe.isBeginning, isEnd: swipe.isEnd })
    })
  }, [swiper])

  const handlePrev = () => {
    swiper.slidePrev()
  }

  const handleNext = () => {
    swiper.slideNext()
  }

  return (
    <>
      <button
        onClick={handlePrev}
        className={clsx(
          'absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-gray-200 p-1 duration-300',
          {
            'group hover:bg-primary': !slideConfig.isBeginning,
            'cursor-default opacity-50': slideConfig.isBeginning
          }
        )}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={clsx('h-6 w-6', {
            'group-hover:text-white': !slideConfig.isBeginning
          })}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>
      <button
        onClick={handleNext}
        className={clsx(
          'absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-gray-200 p-1 duration-300',
          {
            'group hover:bg-primary': !slideConfig.isEnd,
            'cursor-default opacity-50': slideConfig.isEnd
          }
        )}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={clsx('h-6 w-6', {
            'group-hover:text-white': !slideConfig.isEnd
          })}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    </>
  )
}

export default Navigation
