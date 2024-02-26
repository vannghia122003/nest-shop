import { useSearchParams } from 'react-router-dom'

function useQueryParams() {
  const [searchParams] = useSearchParams()
  return Object.fromEntries<string | undefined>([...searchParams])
}

export default useQueryParams
