import { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form'

import MultipleSelect, { Item } from '@/components/multiple-select'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

interface IProps<TFieldValues extends FieldValues> {
  form: UseFormReturn<TFieldValues>
  name: FieldPath<TFieldValues>
  placeholder?: string
  label: string
  className?: string
  options?: { label: string; value: number }[]
  value: Item[]
  onSelect?: (value: Item[]) => void
}

function FormMultipleSelect<TFieldValues extends FieldValues>(props: IProps<TFieldValues>) {
  const { name, form, placeholder, label, className, options, value, onSelect } = props

  return (
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <MultipleSelect
              options={options}
              value={value}
              onSelect={(value) => onSelect && onSelect(value)}
              placeholder={placeholder}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default FormMultipleSelect
