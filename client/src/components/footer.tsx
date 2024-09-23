import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconLockSquare,
  IconMail,
  IconMapPin,
  IconPhone
} from '@tabler/icons-react'
import { Link } from 'react-router-dom'

import Logo from '@/components/logo'
import IMAGES from '@/utils/images'
import PATH from '@/utils/path'

function Footer() {
  return (
    <footer className="border-t-4 border-primary/50 pb-4 pt-16">
      <div className="container text-secondary">
        <div className="grid grid-cols-1 gap-10 pb-10 sm:grid-cols-3 lg:grid-cols-6">
          <div className="sm:col-span-2">
            <Logo />
            <ul className="mt-5 flex flex-col gap-3">
              <li className="flex items-center">
                <span className="mr-[6px] text-primary">
                  <IconMapPin />
                </span>
                <span className="text-foreground">
                  <strong>Location:</strong> Da Nang
                </span>
              </li>
              <li className="flex items-center">
                <span className="mr-[6px] text-primary">
                  <IconPhone />
                </span>
                <span className="text-foreground">
                  <strong>Phone:</strong> (+84) 123-456-789
                </span>
              </li>
              <li className="flex items-center">
                <span className="mr-[6px] text-primary">
                  <IconMail />
                </span>
                <span className="text-foreground">
                  <strong>Email:</strong> vannghia.122003@gmail.com
                </span>
              </li>
            </ul>
          </div>
          <div className="col-span-1">
            <h4 className="mb-5 text-2xl font-bold text-foreground">About Us</h4>
            <ul className="flex flex-col gap-3">
              <li>
                <Link
                  to={PATH.PRIVACY_POLICY}
                  className="inline-flex items-center gap-2 pr-10 text-base text-foreground duration-300 hover:text-primary"
                >
                  <IconLockSquare />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <a
                  href="https://www.facebook.com"
                  className="inline-flex items-center gap-2 pr-10 text-base text-foreground duration-300 hover:text-primary"
                >
                  <IconBrandFacebook />
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com"
                  className="inline-flex items-center gap-2 pr-10 text-base text-foreground duration-300 hover:text-primary"
                >
                  <IconBrandInstagram />
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com"
                  className="inline-flex items-center gap-2 pr-10 text-base text-foreground duration-300 hover:text-primary"
                >
                  <IconBrandLinkedin />
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
          <div className="col-span-1">
            <h4 className="mb-5 text-2xl font-bold text-foreground">Payment</h4>
            <div className="flex flex-wrap gap-2">
              <div className="h-8 w-16 overflow-hidden rounded-sm p-2 shadow">
                <img src={IMAGES.VISA} alt="logo" />
              </div>
              <div className="h-8 w-16 overflow-hidden rounded-sm p-2 shadow">
                <img src={IMAGES.MASTER_CARD} alt="logo" />
              </div>
              <div className="h-8 w-16 overflow-hidden rounded-sm p-2 shadow">
                <img src={IMAGES.JCB} alt="logo" />
              </div>
              <div className="h-8 w-16 overflow-hidden rounded-sm p-2 shadow">
                <img src={IMAGES.AMERICAN_EXPRESS} alt="logo" />
              </div>
              <div className="h-8 w-16 overflow-hidden rounded-sm p-2 shadow">
                <img src={IMAGES.COD} alt="logo" />
              </div>
              <div className="h-8 w-16 overflow-hidden rounded-sm p-2 shadow">
                <img src={IMAGES.INSTALLMENT} alt="logo" />
              </div>
              <div className="h-8 w-16 overflow-hidden rounded-sm p-2 shadow">
                <img src={IMAGES.SHOPEE_PAY} alt="logo" />
              </div>
              <div className="h-8 w-16 overflow-hidden rounded-sm p-2 shadow">
                <img src={IMAGES.SHOPEE_PAY_LATE} alt="logo" />
              </div>
            </div>
          </div>
          <div className="col-span-1">
            <h4 className="mb-5 text-2xl font-bold text-foreground">Logistics</h4>
            <div className="flex flex-wrap gap-2">
              <div className="h-8 w-16 overflow-hidden rounded-sm p-2 shadow">
                <img src={IMAGES.SHOPEE_EXPRESS} alt="logo" />
              </div>
              <div className="h-8 w-16 overflow-hidden rounded-sm p-2 shadow">
                <img src={IMAGES.GHN} alt="logo" />
              </div>
              <div className="h-8 w-16 overflow-hidden rounded-sm p-2 shadow">
                <img src={IMAGES.VIETTEL_POST} alt="logo" />
              </div>
              <div className="h-8 w-16 overflow-hidden rounded-sm p-2 shadow">
                <img src={IMAGES.VIETNAM_POST} alt="logo" />
              </div>
              <div className="h-8 w-16 overflow-hidden rounded-sm p-2 shadow">
                <img src={IMAGES.JT} alt="logo" />
              </div>
              <div className="h-8 w-16 overflow-hidden rounded-sm p-2 shadow">
                <img src={IMAGES.GRAB_EXPRESS} alt="logo" />
              </div>
              <div className="h-8 w-16 overflow-hidden rounded-sm p-2 shadow">
                <img src={IMAGES.NINJA_VAN} alt="logo" />
              </div>
              <div className="h-8 w-16 overflow-hidden rounded-sm p-2 shadow">
                <img src={IMAGES.BEST_EXPRESS} alt="logo" />
              </div>
              <div className="h-8 w-16 overflow-hidden rounded-sm p-2 shadow">
                <img src={IMAGES.BE} alt="logo" />
              </div>
              <div className="h-8 w-16 overflow-hidden rounded-sm p-2 shadow">
                <img src={IMAGES.AHAMOVE} alt="logo" />
              </div>
            </div>
          </div>
          <div className="col-span-1">
            <h4 className="mb-5 text-2xl font-bold text-foreground">App Download</h4>
            <div>
              <p className="text-foreground">From App Store or Google Play</p>
              <div className="my-6 flex gap-2 sm:flex-col">
                <div className="h-[38px] w-[128px]">
                  <img src={IMAGES.APP_STORE} alt="app store" />
                </div>
                <div className="h-[38px] w-[128px]">
                  <img src={IMAGES.GOOGLE_PLAY} alt="google play" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="h-[1px] w-full bg-primary"></div>
        <p className="mt-2 text-center text-foreground">
          &copy; {new Date().getFullYear()}, <span className="text-primary">Tran Van Nghia</span> -
          Ecommerce
        </p>
      </div>
    </footer>
  )
}

export default Footer
