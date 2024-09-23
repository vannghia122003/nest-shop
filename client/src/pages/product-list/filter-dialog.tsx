import { zodResolver } from '@hookform/resolvers/zod'
import { IconFilter } from '@tabler/icons-react'
import omit from 'lodash/omit'
import qs from 'qs'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

import FormText from '@/components/form-input/form-text'
import RatingStar from '@/components/rating-star'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { IProductQueryParams } from '@/types/product'

interface IProps {
  productQueryParams: IProductQueryParams
}

const schema = z.object({
  rating: z.string(),
  priceMin: z.string(),
  priceMax: z.string()
})
type FormData = z.infer<typeof schema>

function FilterDialog({ productQueryParams }: IProps) {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    shouldFocusError: false,
    defaultValues: { rating: '', priceMin: '', priceMax: '' }
  })

  const handleOpenChange = (open: boolean) => {
    setOpen(open)
  }

  const handleClearFilter = () => {
    form.reset()
    navigate({
      search: qs.stringify(
        omit(productQueryParams, [
          'filter.rating',
          'filter.price',
          'searchBy',
          'search',
          'filter.name'
        ])
      )
    })
    setOpen(false)
  }

  const handleFilter = form.handleSubmit((values) => {
    const searchParams = new URLSearchParams()
    values.rating && searchParams.append('filter.rating', `$gte:${values.rating}`)
    values.priceMin && searchParams.append('filter.price', `$gte:${values.priceMin}`)
    values.priceMax && searchParams.append('filter.price', `$lte:${values.priceMax}`)
    const searchObj = { ...productQueryParams, ...qs.parse(searchParams.toString()) }
    navigate({ search: qs.stringify(searchObj) })
    setOpen(false)
  })

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" leftSection={<IconFilter />} className="text-sm font-normal">
          Filter
        </Button>
      </DialogTrigger>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>All filters</DialogTitle>
          <DialogDescription>Filter product here</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleFilter}>
            <div>
              <h4 className="mb-3 font-semibold">Rating</h4>
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormControl>
                      <RadioGroup
                        className="flex flex-col space-y-1"
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        {Array(5)
                          .fill(0)
                          .map((_, index) => (
                            <FormItem className="flex items-center space-x-3 space-y-0" key={index}>
                              <FormControl>
                                <RadioGroupItem value={`${5 - index}`} />
                              </FormControl>
                              <FormLabel className="font-normal">
                                <RatingStar rating={5 - index} size={20} />
                              </FormLabel>
                            </FormItem>
                          ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Separator className="my-4" />
            <div>
              <h4 className="font-semibold">Price</h4>
              <div className="flex items-center gap-2">
                <FormText
                  form={form}
                  name="priceMin"
                  type="number"
                  placeholder="MIN"
                  className="grow"
                />
                <Separator className="w-4" />
                <FormText
                  form={form}
                  name="priceMax"
                  type="number"
                  placeholder="MAX"
                  className="grow"
                />
              </div>
            </div>
          </form>
        </Form>

        <DialogFooter className="!justify-between">
          <Button variant="outline" onClick={handleClearFilter}>
            Clear all
          </Button>
          <Button onClick={handleFilter}>Apply</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
export default FilterDialog
