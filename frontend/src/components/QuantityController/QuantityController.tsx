import clsx from 'clsx'
import InputNumber from '../InputNumber'
import { ChangeEvent, FocusEvent, InputHTMLAttributes, useState } from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  max?: number
  onIncrease?: (value: number) => void
  onDecrease?: (value: number) => void
  onType?: (value: number) => void
  onFocusOut?: (value: number) => void
}

function QuantityController(props: Props) {
  const { max, onIncrease, onDecrease, onType, onFocusOut, value, disabled, ...rest } = props
  const [localValue, setLocalValue] = useState<number>(Number(value || 0))

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    let valueInput = Number(event.target.value)
    if (max !== undefined && valueInput > max) {
      valueInput = max
    } else if (valueInput < 1) {
      valueInput = 1
    }
    onType && onType(valueInput)
    setLocalValue(valueInput)
  }

  const handleIncrease = () => {
    const valueInput = Number(value || localValue) + 1
    if (max !== undefined && valueInput > max) {
      // valueInput = max
      return
    }
    onIncrease && onIncrease(valueInput)
    setLocalValue(valueInput)
  }

  const handleDecrease = () => {
    const valueInput = Number(value || localValue) - 1
    if (valueInput < 1) {
      // valueInput = 1
      return
    }
    onDecrease && onDecrease(valueInput)
    setLocalValue(valueInput)
  }

  const handleBlur = (event: FocusEvent<HTMLInputElement, Element>) => {
    onFocusOut && onFocusOut(Number(event.target.value))
  }

  return (
    <div
      className={clsx(
        'relative flex h-[50px] max-w-[90px] items-center rounded border-2 border-primary pl-3 pr-6',
        {
          'opacity-50': disabled
        }
      )}
    >
      <InputNumber
        name="quantity"
        classNameInput="w-full text-center text-secondary outline-none border-none shadow-none"
        value={value || localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={disabled}
        {...rest}
      />
      <div className="absolute bottom-0 right-0 top-0 flex flex-col justify-between px-1 py-[2px]">
        <button onClick={handleIncrease} disabled={disabled} className="outline-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-4 w-4 text-primary"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
          </svg>
        </button>
        <button onClick={handleDecrease} disabled={disabled} className="outline-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-4 w-4 text-primary"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default QuantityController
