import clsx from 'clsx'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import ReactPaginate from 'react-paginate'

interface Props {
  pageCount?: number
  currentPage?: number
  onPageChange: (page: number) => void
}

function Pagination({ pageCount, currentPage, onPageChange }: Props) {
  const handlePageChange = ({ selected }: { selected: number }) => {
    onPageChange(selected + 1)
  }

  return (
    <ReactPaginate
      previousLabel={<FaArrowLeft />}
      nextLabel={<FaArrowRight />}
      pageLabelBuilder={(page) => {
        return (
          <span
            className={clsx(
              'block h-[40px] w-[40px] rounded-full bg-[#F2F3F4] text-center font-bold leading-[40px] duration-300 hover:bg-primary hover:text-white',
              {
                'bg-primary text-white': currentPage === page
              }
            )}
          >
            {page}
          </span>
        )
      }}
      onPageChange={handlePageChange}
      pageRangeDisplayed={3}
      marginPagesDisplayed={2}
      pageCount={pageCount || 0}
      previousLinkClassName="w-[40px] h-[40px] text-center leading-[40px] flex items-center justify-center bg-[#F2F3F4] hover:bg-primary hover:text-white rounded-full duration-300"
      nextLinkClassName="w-[40px] h-[40px] text-center leading-[40px] flex items-center justify-center bg-[#F2F3F4] hover:bg-primary hover:text-white rounded-full duration-300"
      breakLabel="..."
      breakLinkClassName="font-bold cursor-default tracking-widest"
      containerClassName="flex justify-center items-center gap-3"
      disabledLinkClassName="opacity-60 cursor-default hover:!bg-[#F2F3F4] hover:!text-[#7e7e7e]"
      renderOnZeroPageCount={null}
    />
  )
}
export default Pagination
