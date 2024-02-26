import clsx from 'clsx'
import { ChangeEvent, InputHTMLAttributes, forwardRef, useState } from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean
  errorMessage?: string
  classNameInput?: string
  classNameError?: string
}

const InputNumber = forwardRef<HTMLInputElement, Props>(function InputNumberInner(
  {
    hasError,
    className,
    errorMessage,
    classNameInput,
    classNameError = 'mt-1 text-red-600 text-sm min-h-[1.25rem]',
    onChange,
    value,
    ...rest
  },
  ref
) {
  const [localValue, setLocalValue] = useState<string>((value as string) || '')

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    // Kiểm tra xem giá trị nhập vào có phải là số không
    if (/^\d*$/g.test(value)) {
      onChange && onChange(event)
      setLocalValue(value)
    }
  }

  return (
    <div className={className}>
      <input
        className={clsx(
          `${classNameInput ? classNameInput : 'py-3 px-4 w-full outline-none border rounded-md'} `,
          {
            'border-red-600 bg-red-50': errorMessage,
            'border-gray-300 focus:border-primary shadow bg-white': !errorMessage
          }
        )}
        {...rest}
        value={value === undefined ? localValue : value}
        onChange={handleChange}
        ref={ref}
      />
      {hasError && <div className={classNameError}>{errorMessage}</div>}
    </div>
  )
})

export default InputNumber
