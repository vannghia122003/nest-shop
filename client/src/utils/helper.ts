import { IEntityErrorResponse } from '@/types/response'
import { isUnprocessableEntity } from '@/utils/error'
import { type ClassValue, clsx } from 'clsx'
import { UseFormSetError } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const removeSpecialCharacter = (str: string) =>
  str.replace(
    // eslint-disable-next-line no-useless-escape
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
    ''
  )

export const generateNameId = ({ name, id }: { name: string; id: number }) => {
  return removeSpecialCharacter(name).replace(/\s+/g, '-') + `-i-${id}`
}

export const getIdFromNameId = (nameId: string) => {
  const arr = nameId.split('-i-')
  return arr[arr.length - 1]
}

export function formatCurrency(currency: number) {
  return new Intl.NumberFormat('de-DE').format(currency)
}

export function formatNumberToCompactStyle(value: number) {
  return new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1
  })
    .format(value)
    .replace('.', ',')
    .toLowerCase()
}

export const setItemLocalStorage = (key: string, value: string) => localStorage.setItem(key, value)

export const getItemLocalStorage = <T = string>(key: string, parse?: boolean): T | null => {
  const result = localStorage.getItem(key)
  if (!result) return null
  return parse ? JSON.parse(result) : result
}

export const eventTarget = new EventTarget()

export const logoutLocalStorage = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('profile')
  eventTarget.dispatchEvent(new Event('logoutLocalStorage'))
}

export const handleUnprocessableEntityError = (error: unknown, setError: UseFormSetError<any>) => {
  if (isUnprocessableEntity<IEntityErrorResponse>(error)) {
    const formError = error.response?.data.message
    if (formError) {
      formError.forEach((err) => {
        setError(err.field, { message: err.message })
      })
    }
  }
}

export const generateYearList = (from: number) => {
  const currentYear = new Date().getFullYear()
  const years = []
  for (let year = from; year <= currentYear; year++) {
    years.push(year)
  }
  return years
}
