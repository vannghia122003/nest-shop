function CartItemSkeleton() {
  return (
    <div className="grid grid-cols-12 gap-6 rounded-sm border border-gray-200 bg-white p-4 text-secondary">
      <div className="col-span-6 animate-pulse">
        <div className="flex">
          <div className="flex flex-shrink-0 items-center justify-center pr-3">
            <div className="h-5 w-5 bg-gray-200"></div>
          </div>
          <div className="flex-grow">
            <div className="flex">
              <div className="flex h-20 w-20 items-center justify-center rounded bg-gray-300">
                <svg
                  className="h-10 w-10 text-gray-200"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 18"
                >
                  <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                </svg>
              </div>

              <div className="flex-grow px-2 pb-2 pt-1">
                <div>
                  <div className="mb-1 h-4 w-full bg-gray-200" />
                  <div className="mb-1 h-4 w-full bg-gray-200" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-6 animate-pulse">
        <div className="grid grid-cols-5 justify-center gap-6">
          <div className="col-span-2">
            <div className="flex items-center justify-center gap-3">
              <div className="h-4 w-32 bg-gray-200" />
            </div>
          </div>
          <div className="col-span-1">
            <div className="mx-auto h-[50px] w-[90px] max-w-full bg-gray-200"></div>
          </div>
          <div className="col-span-1">
            <div className="h-4 w-full bg-gray-200" />
          </div>
          <div className="col-span-1">
            <div className="mx-auto h-6 w-6 bg-gray-200"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartItemSkeleton
