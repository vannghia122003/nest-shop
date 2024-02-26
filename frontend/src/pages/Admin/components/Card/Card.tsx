import { IconType } from 'react-icons'
import { formatNumberToCompactStyle } from '~/utils/helpers'

interface Props {
  Icon: IconType
  title: string
  number: number
}

function Card({ Icon, title, number }: Props) {
  return (
    <div className="bg-white shadow-md p-6 text-secondary">
      <div className="flex justify-center items-center flex-col">
        <div>
          <div className="text-3xl text-primary bg-gray-200 rounded-full p-2 w-12 h-12 flex justify-center items-center">
            <Icon />
          </div>
        </div>
        <p className="mt-4 font-bold text-2xl">{title}</p>
        <p className="mt-2 text-xl">{formatNumberToCompactStyle(number)}</p>
      </div>
    </div>
  )
}
export default Card
