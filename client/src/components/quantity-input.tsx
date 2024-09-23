import { IconChevronDown, IconChevronUp } from '@tabler/icons-react'
import { ChangeEvent, FocusEvent, InputHTMLAttributes, useState } from 'react'

import { Input } from '@/components/ui/input'
import { cn } from '@/utils/helper'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  max?: number
  onIncrease?: (value: number) => void
  onDecrease?: (value: number) => void
  onType?: (value: number) => void
  onFocusOut?: (value: number) => void
}

function QuantityInput(props: Props) {
  const { max, onIncrease, onDecrease, onType, onFocusOut, value, disabled, ...rest } = props
  const [localValue, setLocalValue] = useState<number>(Number(value) || 0)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    let valueInput = Number(event.target.value)
    if (max && valueInput > max) {
      valueInput = max
    } else if (valueInput < 1) {
      valueInput = 1
    }
    onType && onType(valueInput)
    setLocalValue(valueInput)
  }

  const handleIncrease = () => {
    const valueInput = Number(value || localValue) + 1
    if (max && valueInput > max) return
    onIncrease && onIncrease(valueInput)
    setLocalValue(valueInput)
  }

  const handleDecrease = () => {
    const valueInput = Number(value || localValue) - 1
    if (valueInput < 1) return
    onDecrease && onDecrease(valueInput)
    setLocalValue(valueInput)
  }

  const handleBlur = (event: FocusEvent<HTMLInputElement, Element>) => {
    onFocusOut && onFocusOut(Number(event.target.value))
  }

  return (
    <div
      className={cn(
        'relative flex h-[50px] max-w-[90px] items-center rounded border-2 border-primary pl-3 pr-6',
        disabled && 'opacity-50'
      )}
    >
      <Input
        autoComplete="off"
        className="w-full border-none p-1 text-center outline-none focus-visible:ring-0"
        value={value || localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={disabled}
        {...rest}
      />
      <div className="absolute bottom-0 right-0 top-0 flex flex-col justify-between">
        <button onClick={handleIncrease} disabled={disabled} className="p-1">
          <IconChevronUp className="size-4 text-primary" />
        </button>
        <button onClick={handleDecrease} disabled={disabled} className="p-1">
          <IconChevronDown className="size-4 text-primary" />
        </button>
      </div>
    </div>
  )
}

export default QuantityInput
