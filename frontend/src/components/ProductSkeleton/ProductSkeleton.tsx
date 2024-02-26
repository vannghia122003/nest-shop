function ProductSkeleton() {
  return (
    <div className="select-none overflow-hidden rounded-lg border border-gray-100 bg-white shadow">
      <div className="relative flex w-full animate-pulse items-center justify-center bg-gray-300 pt-[100%]">
        <svg
          className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 text-gray-200"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 18"
        >
          <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
        </svg>
      </div>
      <div className="animate-pulse p-2">
        <div className="mb-2 h-12 bg-gray-200"></div>
        <div className="mb-2 h-4 w-[55%] bg-gray-200" />
        <div className="flex h-[32px] items-center justify-between gap-2">
          <div className="h-4 basis-1/2 bg-gray-200" />
          <div className="basis-1/3">
            <div className="mb-1 h-3 bg-gray-200" />
            <div className="h-3 bg-gray-200" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductSkeleton
