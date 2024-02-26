import {
  BsClock,
  BsEnvelope,
  BsFacebook,
  BsGeoAlt,
  BsInstagram,
  BsLinkedin,
  BsTelephone,
  BsTwitter
} from 'react-icons/bs'
import { FaFacebookF } from 'react-icons/fa'
import { TbBrandGithubFilled } from 'react-icons/tb'
import { BiLogoInstagramAlt } from 'react-icons/bi'
import Images from '~/constants/images'

function Footer() {
  return (
    <footer className="bg-[#f5f5f5] py-16 border-t-4 border-primary">
      <div className="container text-secondary">
        <div className="grid grid-cols-1 gap-10 pb-10 sm:grid-cols-3 lg:grid-cols-6">
          <div className="sm:col-span-2">
            <div>
              <img src={Images.LOGO} alt="logo" />
            </div>
            <ul className="mt-5 flex flex-col gap-3">
              <li className="flex items-center">
                <span className="mr-[6px] text-primary">
                  <BsGeoAlt />
                </span>
                <span>
                  <strong>Địa chỉ:</strong> Đà Nẵng
                </span>
              </li>
              <li className="flex items-center">
                <span className="mr-[6px] text-primary">
                  <BsTelephone />
                </span>
                <span>
                  <strong>Điện thoại:</strong> (+84) 123-456-789
                </span>
              </li>
              <li className="flex items-center">
                <span className="mr-[6px] text-primary">
                  <BsEnvelope />
                </span>
                <span>
                  <strong>Email:</strong> vannghia.122003@gmail.com
                </span>
              </li>
              <li className="flex items-center">
                <span className="mr-[6px] text-primary">
                  <BsClock />
                </span>
                <span>
                  <strong>Giờ làm việc:</strong> 8:00 - 18:00, Thứ 2 - Thứ 7
                </span>
              </li>
            </ul>
          </div>
          <div className="col-span-1">
            <h4 className="mb-5 mt-7 text-2xl font-bold">Theo dõi</h4>
            <ul className="flex flex-col gap-3">
              <li>
                <a
                  href="https://www.facebook.com/vannghia.122003"
                  className="inline-flex items-center gap-2 pr-10 text-base text-secondary duration-300 hover:text-primary"
                >
                  <BsFacebook />
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/vannghia.122003"
                  className="inline-flex items-center gap-2 pr-10 text-base text-secondary duration-300 hover:text-primary"
                >
                  <BsInstagram />
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/vannghia.122003"
                  className="inline-flex items-center gap-2 pr-10 text-base text-secondary duration-300 hover:text-primary"
                >
                  <BsTwitter />
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/vannghia.122003"
                  className="inline-flex items-center gap-2 pr-10 text-base text-secondary duration-300 hover:text-primary"
                >
                  <BsLinkedin />
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
          <div className="col-span-1">
            <h4 className="mb-5 mt-7 text-2xl font-bold">Thanh toán</h4>
            <div className="flex flex-wrap gap-2">
              <div className="h-8 w-16 overflow-hidden rounded-sm bg-white p-2 shadow">
                <img src={Images.VISA} alt="logo" />
              </div>
              <div className="h-8 w-16 overflow-hidden rounded-sm bg-white p-2 shadow">
                <img src={Images.MASTER_CARD} alt="logo" />
              </div>
              <div className="h-8 w-16 overflow-hidden rounded-sm bg-white p-2 shadow">
                <img src={Images.JCB} alt="logo" />
              </div>
              <div className="h-8 w-16 overflow-hidden rounded-sm bg-white p-2 shadow">
                <img src={Images.AMERICAN_EXPRESS} alt="logo" />
              </div>
              <div className="h-8 w-16 overflow-hidden rounded-sm bg-white p-2 shadow">
                <img src={Images.COD} alt="logo" />
              </div>
              <div className="h-8 w-16 overflow-hidden rounded-sm bg-white p-2 shadow">
                <img src={Images.INSTALLMENT} alt="logo" />
              </div>
              <div className="h-8 w-16 overflow-hidden rounded-sm bg-white p-2 shadow">
                <img src={Images.SHOPEE_PAY} alt="logo" />
              </div>
              <div className="h-8 w-16 overflow-hidden rounded-sm bg-white p-2 shadow">
                <img src={Images.SHOPEE_PAY_LATE} alt="logo" />
              </div>
            </div>
          </div>
          <div className="col-span-1">
            <h4 className="mb-5 mt-7 text-2xl font-bold text-secondary">Vận chuyển</h4>
            <div className="flex flex-wrap gap-2">
              <div className="h-8 w-16 overflow-hidden rounded-sm bg-white p-2 shadow">
                <img src={Images.SHOPEE_EXPRESS} alt="logo" />
              </div>
              <div className="h-8 w-16 overflow-hidden rounded-sm bg-white p-2 shadow">
                <img src={Images.GHN} alt="logo" />
              </div>
              <div className="h-8 w-16 overflow-hidden rounded-sm bg-white p-2 shadow">
                <img src={Images.VIETTEL_POST} alt="logo" />
              </div>
              <div className="h-8 w-16 overflow-hidden rounded-sm bg-white p-2 shadow">
                <img src={Images.VIETNAM_POST} alt="logo" />
              </div>
              <div className="h-8 w-16 overflow-hidden rounded-sm bg-white p-2 shadow">
                <img src={Images.JT} alt="logo" />
              </div>
              <div className="h-8 w-16 overflow-hidden rounded-sm bg-white p-2 shadow">
                <img src={Images.GRAB_EXPRESS} alt="logo" />
              </div>
              <div className="h-8 w-16 overflow-hidden rounded-sm bg-white p-2 shadow">
                <img src={Images.NINJA_VAN} alt="logo" />
              </div>
              <div className="h-8 w-16 overflow-hidden rounded-sm bg-white p-2 shadow">
                <img src={Images.BEST_EXPRESS} alt="logo" />
              </div>
              <div className="h-8 w-16 overflow-hidden rounded-sm bg-white p-2 shadow">
                <img src={Images.BE} alt="logo" />
              </div>
              <div className="h-8 w-16 overflow-hidden rounded-sm bg-white p-2 shadow">
                <img src={Images.AHAMOVE} alt="logo" />
              </div>
            </div>
          </div>
          <div className="col-span-1">
            <h4 className="mb-5 mt-7 text-2xl font-bold">Tải ứng dụng</h4>
            <div>
              <div>Từ App Store hoặc Google Play</div>
              <div className="my-6 flex gap-2 sm:flex-col">
                <div className="h-[38px] w-[128px]">
                  <img src={Images.APP_STORE} alt="app store" />
                </div>
                <div className="h-[38px] w-[128px]">
                  <img src={Images.GOOGLE_PLAY} alt="google play" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="h-[1px] w-full bg-primary"></div>
        <div className="mt-9 flex flex-col items-center justify-center gap-4">
          <div className="flex justify-center gap-6 lg:justify-center">
            <a
              href="https://www.facebook.com/vannghia.122003"
              target="_blank"
              rel="noreferrer"
              className="block rounded-full border border-secondary p-2 duration-300 hover:border-primary hover:text-primary"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://github.com/vannghia122003"
              target="_blank"
              rel="noreferrer"
              className="block rounded-full border border-secondary p-2 duration-300 hover:border-primary hover:text-primary"
            >
              <TbBrandGithubFilled />
            </a>
            <a
              href="https://www.instagram.com/vannghia.122003"
              target="_blank"
              rel="noreferrer"
              className="block rounded-full border border-secondary p-2 duration-300 hover:border-primary hover:text-primary"
            >
              <BiLogoInstagramAlt />
            </a>
          </div>
          <p className="mt-2 text-center lg:text-left">
            &copy; 2023, <span className="text-primary">Trần Văn Nghĩa</span> - Ecommerce
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
