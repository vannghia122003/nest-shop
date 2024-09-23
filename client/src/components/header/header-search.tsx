import { IconSearch } from '@tabler/icons-react'
import capitalize from 'lodash/capitalize'
import qs from 'qs'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'

function HeaderSearch() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchValue, setSearchValue] = useState('')

  useEffect(() => {
    setSearchValue('')
  }, [location])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value
    if (!searchValue.startsWith(' ')) {
      setSearchValue(searchValue)
    }
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    navigate({
      pathname: 'products',
      search: qs.stringify({
        'filter.name': `$ilike:${capitalize(searchValue)}`
      })
    })
  }

  return (
    <form className="flex rounded border-2 border-primary bg-white p-1" onSubmit={handleSubmit}>
      <input
        autoComplete="off"
        type="text"
        placeholder="Search for products..."
        className="w-full flex-grow px-2 py-1 outline-none xs:px-3"
        value={searchValue}
        onChange={handleChange}
      />
      <Button className="rounded-sm sm:px-6">
        <IconSearch />
      </Button>
    </form>
  )
}
export default HeaderSearch
