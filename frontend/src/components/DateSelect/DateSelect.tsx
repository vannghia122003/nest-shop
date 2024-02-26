import range from 'lodash/range'
import { useEffect, useState } from 'react'
import type { SingleValue } from 'react-select'
import Select from '../Select'

interface Props {
  value?: Date
  onChange?: (value: Date) => void
  errorMessage?: string
  classNameError?: string
}

function DateSelect({
  value,
  onChange,
  errorMessage,
  classNameError = 'mt-1 text-red-600 text-sm min-h-[1.25rem]'
}: Props) {
  const [date, setDate] = useState({
    date: value?.getDate() || 10,
    month: value?.getMonth() || 10,
    year: value?.getFullYear() || 1990
  })

  useEffect(() => {
    if (value) {
      setDate({
        date: value.getDate(),
        month: value.getMonth(),
        year: value.getFullYear()
      })
    }
  }, [value])

  const handleChange =
    (name: 'date' | 'month' | 'year') =>
    (
      option: SingleValue<{
        value: number
        label: number
      }>
    ) => {
      const newDate = {
        date: value?.getDate() || date.date,
        month: value?.getMonth() || date.month,
        year: value?.getFullYear() || date.year,
        [name]: option?.value
      }
      setDate(newDate)
      onChange && onChange(new Date(newDate.year, newDate.month, newDate.date))
    }

  return (
    <div>
      <div className="flex gap-2">
        <Select
          className="grow"
          placeholder="Ngày"
          isSearchable={false}
          options={range(1, 32).map((number) => ({ value: number, label: number }))}
          value={{
            value: value?.getDate() || date.date,
            label: value?.getDate() || date.date
          }}
          onChange={handleChange('date')}
        />
        <Select
          className="grow"
          placeholder="Tháng"
          isSearchable={false}
          options={range(0, 12).map((number) => ({ value: number, label: number + 1 }))}
          value={{
            value: value?.getMonth() || date.month,
            label: (value?.getMonth() || date.month) + 1
          }}
          onChange={handleChange('month')}
        />
        <Select
          className="grow"
          placeholder="Năm"
          isSearchable={false}
          options={range(1980, 2025).map((number) => ({ value: number, label: number }))}
          value={{
            value: value?.getFullYear() || date.year,
            label: value?.getFullYear() || date.year
          }}
          onChange={handleChange('year')}
        />
      </div>
      <div className={classNameError}>{errorMessage}</div>
    </div>
  )
}

export default DateSelect
