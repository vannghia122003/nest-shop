import { shift, useFloating, useFocus, useInteractions } from '@floating-ui/react'
import { useQuery } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { FaSearch, FaTimes } from 'react-icons/fa'
import { Link, createSearchParams, useLocation, useNavigate } from 'react-router-dom'
import productApi from '~/apis/product.api'
import QUERY_KEYS from '~/constants/keys'
import path from '~/constants/path'
import { useDebounce } from '~/hooks'
import { formatCurrency, generateNameId } from '~/utils/helpers'

function Search() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [shift()],
    placement: 'bottom-start'
  })
  const focus = useFocus(context)
  const { getReferenceProps, getFloatingProps } = useInteractions([focus])
  const [searchValue, setSearchValue] = useState('')
  const debouncedSearchValue = useDebounce(searchValue, 700)

  const { data: searchResult, isFetching } = useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, debouncedSearchValue],
    queryFn: () => productApi.getProducts({ name: debouncedSearchValue }),
    enabled: Boolean(debouncedSearchValue)
  })

  useEffect(() => {
    handleClearSearchValue()
  }, [location])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value
    if (!searchValue.startsWith(' ')) {
      setSearchValue(searchValue)
    }
  }

  const handleClearSearchValue = () => {
    setSearchValue('')
    setIsOpen(false)
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    navigate({
      pathname: 'products',
      search: createSearchParams({
        name: searchValue
      }).toString()
    })
  }

  return (
    <div className="relative" ref={refs.setReference} {...getReferenceProps()}>
      <form className="flex rounded bg-white p-1" onSubmit={handleSubmit}>
        <input
          autoComplete="off"
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          className="flex-grow px-3 py-1 text-secondary outline-none"
          value={searchValue}
          onChange={handleChange}
        />
        <div className="mr-2 flex items-center">
          {isFetching && (
            <svg
              aria-hidden="true"
              className="h-5 w-5 animate-spin fill-primary text-gray-200"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          )}
          {!isFetching && searchValue.length > 0 && (
            <button onClick={handleClearSearchValue} type="button">
              <FaTimes />
            </button>
          )}
        </div>
        <button className="flex shrink-0 rounded-sm bg-primary px-6 py-2 hover:bg-[#29A56C] text-white text-xl">
          <FaSearch />
        </button>
      </form>
      <AnimatePresence>
        {searchResult?.result && isOpen && (
          <motion.div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="z-10 mt-1 max-h-[40vh] w-full overflow-y-auto rounded border-2 border-gray-100 bg-white shadow"
          >
            {searchResult.result.length !== 0 &&
              searchResult.result.map((product) => (
                <Link
                  key={product._id}
                  to={`${path.productList}/${generateNameId({
                    name: product.name,
                    id: product._id
                  })}`}
                  className="flex cursor-pointer items-center gap-5 p-3 hover:bg-gray-100"
                  onClick={handleClearSearchValue}
                >
                  <img className="h-[50px] w-[50px]" src={product.image} alt={product.name} />
                  <div>
                    <p className="text-secondary">{product.name}</p>
                    <p className="mt-1 text-primary">{formatCurrency(product.price)}₫</p>
                  </div>
                </Link>
              ))}
            {searchResult.result.length === 0 && (
              <div className="p-3 text-secondary">Không tìm thấy sản phẩm</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Search
