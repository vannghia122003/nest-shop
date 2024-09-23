import { IconCheck, IconSelector } from '@tabler/icons-react'
import isEqual from 'lodash/isEqual'
import { useState } from 'react'
import { FieldPath, FieldValues, Path, PathValue, UseFormReturn } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/utils/helper'

interface IProps<TFieldValues extends FieldValues> {
  form: UseFormReturn<TFieldValues>
  name: FieldPath<TFieldValues>
  placeholder: string
  label: string
  description?: string
  className?: string
  data?: { label: string; value: any }[]
  disabled?: boolean
  onSelect?: (name: Path<TFieldValues>, value: PathValue<TFieldValues, Path<TFieldValues>>) => void
}

function FormComboBox<TFieldValues extends FieldValues>(props: IProps<TFieldValues>) {
  const {
    name,
    form,
    placeholder,
    label,
    className,
    data = [],
    description,
    disabled,
    onSelect
  } = props
  const [open, setOpen] = useState(false)

  const handleSelect = (
    name: Path<TFieldValues>,
    value: PathValue<TFieldValues, Path<TFieldValues>>
  ) => {
    onSelect && onSelect(name, value)
    setOpen(false)
  }

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn('flex flex-col', className)}>
          <FormLabel>{label}</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  disabled={disabled}
                  variant="outline"
                  role="combobox"
                  className={cn('justify-between', !field.value && 'text-muted-foreground')}
                >
                  {field.value
                    ? data.find((item) => isEqual(item.value, field.value))?.label
                    : placeholder}
                  <IconSelector className="ml-2 size-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <Command>
                <CommandInput placeholder="Search..." />
                <CommandList>
                  <CommandEmpty>Not found.</CommandEmpty>
                  <CommandGroup>
                    {data.map((item, i) => (
                      <CommandItem
                        value={item.label}
                        key={i}
                        onSelect={() => handleSelect(field.name, item.value)}
                      >
                        <IconCheck
                          className={cn(
                            'mr-2 size-4',
                            item.value === field.value ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        {item.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default FormComboBox
