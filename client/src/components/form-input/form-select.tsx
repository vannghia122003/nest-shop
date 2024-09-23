import { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form'

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { cn } from '@/utils/helper'

interface IProps<TFieldValues extends FieldValues> {
  form: UseFormReturn<TFieldValues>
  name: FieldPath<TFieldValues>
  placeholder: string
  label: string
  className?: string
  data?: { id: number | string; name?: string }[]
}

function FormSelect<TFieldValues extends FieldValues>(props: IProps<TFieldValues>) {
  const { name, form, placeholder, label, className, data } = props
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <Select
            value={field.value ? String(field.value) : undefined}
            onValueChange={(value) => {
              field.onChange(value)
              form.clearErrors(name)
            }}
          >
            <FormControl>
              <SelectTrigger className={cn(!field.value && 'text-muted-foreground')}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {data?.map((item, i) => (
                <SelectItem key={i} value={`${item.id}`}>
                  {item.name ?? item.id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default FormSelect
