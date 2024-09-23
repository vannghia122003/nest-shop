import { IconCalendar } from '@tabler/icons-react'
import { format } from 'date-fns'
import { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/utils/helper'

interface IProps<TFieldValues extends FieldValues> {
  form: UseFormReturn<TFieldValues>
  name: FieldPath<TFieldValues>
  placeholder?: string
  label?: string
  className?: string
}

function FormDataPicker<TFieldValues extends FieldValues>(props: IProps<TFieldValues>) {
  const { name, form, placeholder, label, className } = props
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full pl-3 text-left font-normal',
                    !field.value && 'text-muted-foreground'
                  )}
                >
                  {field.value ? format(field.value, 'dd/MM/yyyy') : <span>{placeholder}</span>}
                  <IconCalendar className="ml-auto size-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                captionLayout="dropdown"
                fromYear={1990}
                toYear={new Date().getFullYear()}
                disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                selected={field.value ?? undefined}
                onSelect={field.onChange}
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default FormDataPicker
