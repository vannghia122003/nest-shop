import Images from '~/constants/images'

function Banner() {
  return (
    <div className="overflow-hidden rounded-3xl">
      <img className="h-full w-full" src={Images.BANNER} alt="banner" />
    </div>
  )
}

export default Banner
