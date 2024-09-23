import { ChangeEvent } from 'react'
import { ControllerRenderProps, FieldPath, FieldValues, Path, UseFormReturn } from 'react-hook-form'

import PasswordInput from '@/components/password-input'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { NUMBER_REGEX } from '@/utils/constants'

interface IProps<TFieldValues extends FieldValues> {
  form: UseFormReturn<TFieldValues>
  name: FieldPath<TFieldValues>
  placeholder?: string
  label?: string
  className?: string
  disabled?: boolean
  type?: 'text' | 'password' | 'number' | 'textarea'
  inputProps?: Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'type' | 'disabled' | 'placeholder'
  >
}

function FormText<TFieldValues extends FieldValues>(props: IProps<TFieldValues>) {
  const { name, form, placeholder, label, className, disabled, type, inputProps } = props

  const handleChangeInput = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: ControllerRenderProps<TFieldValues, Path<TFieldValues>>
  ) => {
    form.clearErrors(name)
    if (type === 'number') {
      NUMBER_REGEX.test(e.target.value) && field.onChange(e)
    } else {
      field.onChange(e)
    }
  }

  const renderInput = (field: ControllerRenderProps<TFieldValues, Path<TFieldValues>>) => {
    if (type === 'password') {
      return (
        <PasswordInput
          disabled={disabled}
          placeholder={placeholder}
          {...inputProps}
          {...field}
          onChange={(e) => handleChangeInput(e, field)}
        />
      )
    }
    if (type === 'textarea') {
      return (
        <Textarea
          disabled={disabled}
          placeholder={placeholder}
          className="resize-none"
          rows={4}
          {...field}
          onChange={(e) => handleChangeInput(e, field)}
        />
      )
    }

    return (
      <Input
        disabled={disabled}
        placeholder={placeholder}
        {...inputProps}
        {...field}
        onChange={(e) => handleChangeInput(e, field)}
      />
    )
  }

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>{renderInput(field)}</FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default FormText
