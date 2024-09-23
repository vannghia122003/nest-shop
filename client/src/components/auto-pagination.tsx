import qs from 'qs'

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'
import { cn } from '@/utils/helper'

interface IProps {
  page: number
  pageSize: number
  pathname: string
  queryParams: any
  preventScrollReset?: boolean
}

const RANGE = 1
function AutoPagination({ page, pageSize, pathname, queryParams, preventScrollReset }: IProps) {
  const renderPagination = () => {
    let dotAfter = false
    let dotBefore = false
    const renderDogBefore = (index: number) => {
      if (!dotBefore) {
        dotBefore = true
        return (
          <PaginationItem key={index}>
            <PaginationEllipsis />
          </PaginationItem>
        )
      }
      return null
    }

    const renderDogAfter = (index: number) => {
      if (!dotAfter) {
        dotAfter = true
        return (
          <PaginationItem key={index}>
            <PaginationEllipsis />
          </PaginationItem>
        )
      }
      return null
    }

    return Array(pageSize)
      .fill(0)
      .map((_, index) => {
        const pageNumber = index + 1

        if (
          page <= RANGE * 2 + 1 &&
          pageNumber > page + RANGE &&
          pageNumber < pageSize - RANGE + 1
        ) {
          return renderDogAfter(index)
        } else if (page > RANGE * 2 + 1 && page < pageSize - RANGE * 2) {
          if (pageNumber > RANGE && pageNumber < page - RANGE) {
            return renderDogBefore(index)
          } else if (pageNumber > page + RANGE && pageNumber < pageSize - RANGE + 1) {
            return renderDogAfter(index)
          }
        } else if (page > pageSize - RANGE * 2 && pageNumber > RANGE && pageNumber < page - RANGE) {
          return renderDogAfter(index)
        }

        return (
          <PaginationItem key={index}>
            <PaginationLink
              preventScrollReset={preventScrollReset}
              to={{ pathname, search: qs.stringify({ ...queryParams, page: pageNumber }) }}
              isActive={pageNumber === page}
            >
              {pageNumber}
            </PaginationLink>
          </PaginationItem>
        )
      })
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            preventScrollReset={preventScrollReset}
            to={{ pathname, search: qs.stringify({ ...queryParams, page: page - 1 }) }}
            className={cn({ 'cursor-not-allowed': page === 1 })}
            onClick={(e) => {
              if (page === 1) {
                e.preventDefault()
              }
            }}
          />
        </PaginationItem>
        {renderPagination()}

        <PaginationItem>
          <PaginationNext
            preventScrollReset={preventScrollReset}
            to={{ pathname, search: qs.stringify({ ...queryParams, page: page + 1 }) }}
            className={cn({ 'cursor-not-allowed': page === pageSize })}
            onClick={(e) => {
              if (page === pageSize) {
                e.preventDefault()
              }
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export default AutoPagination
