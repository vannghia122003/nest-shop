import { Avatar } from 'flowbite-react'
import { useContext } from 'react'
import { FaBars } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import Images from '~/constants/images'
import path from '~/constants/path'
import { AppContext } from '~/contexts/app.context'

interface Props {
  sidebarOpen: boolean
  setSidebarOpen: (arg: boolean) => void
}

function Header({ sidebarOpen, setSidebarOpen }: Props) {
  const { profile } = useContext(AppContext)

  return (
    <header className="sticky top-0 z-9 flex w-full bg-white drop-shadow-1">
      <div className="flex flex-grow items-center justify-between py-4 px-4 shadow md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setSidebarOpen(!sidebarOpen)
            }}
            className="z-99999 block rounded-sm border border-gray-300 bg-white p-1.5 shadow-sm lg:hidden"
          >
            <FaBars />
          </button>
        </div>
        <Link to={path.home}>
          <img className="w-[200px]" src={Images.LOGO} alt="logo" />
        </Link>

        <div className="flex items-center gap-2">
          <Avatar img={profile?.avatar} rounded />
          <p className="text-secondary hidden sm:block">{profile?.name}</p>
        </div>
      </div>
    </header>
  )
}
export default Header
