import { IconBuildingStore } from '@tabler/icons-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import PATH from '@/utils/path'

function Logo() {
  return (
    <Button variant="link" asChild>
      <Link to={PATH.HOME} className="!p-0">
        <IconBuildingStore size={40} />
        <h1 className="ml-2 text-3xl font-bold">Nest</h1>
      </Link>
    </Button>
  )
}
export default Logo
