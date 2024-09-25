import { useEffect, useState } from 'react'

interface IProps<T> {
  key: string
  defaultValue: T
}

export default function useLocalStorage<T>({ key, defaultValue }: IProps<T>) {
  const [value, setValue] = useState<T>(() => {
    const storedValue = localStorage.getItem(key)
    return storedValue !== null ? (JSON.parse(storedValue) as T) : defaultValue
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [value, key])

  return [value, setValue] as const
}
