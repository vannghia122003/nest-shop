import { IconX } from '@tabler/icons-react'
import { Command as CommandPrimitive } from 'cmdk'
import isEqual from 'lodash/isEqual'
import { KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'

export interface Item {
  label: string
  value: number | string
}

interface IProps {
  value: Item[]
  options?: Item[]
  placeholder?: string
  onSelect?: (value: Item[]) => void
}

function MultipleSelect({ value, options = [], placeholder, onSelect }: IProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [selected, setSelected] = useState<Item[]>(value)

  useEffect(() => {
    if (!isEqual(value, selected)) {
      setSelected(value)
    }
  }, [selected, value])

  const handleUnselect = (item: Item) => {
    setSelected((prev) => {
      const newSelected = prev.filter((s) => s.value !== item.value)
      onSelect && onSelect(newSelected)
      return newSelected
    })
  }

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    const input = inputRef.current
    if (input) {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (input.value === '') {
          setSelected((prev) => {
            const newSelected = [...prev]
            newSelected.pop()
            return newSelected
          })
        }
      }
      if (e.key === 'Escape') {
        input.blur()
      }
    }
  }, [])

  const selectable = options.filter((item) => !selected.some((s) => s.value === item.value))

  return (
    <Command onKeyDown={handleKeyDown} className="overflow-visible bg-transparent">
      <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-1 focus-within:ring-ring">
        <div className="flex flex-wrap gap-1">
          {selected.map((item) => {
            return (
              <Badge key={item.value} variant="secondary">
                {item.label}
                <button
                  className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleUnselect(item)
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  onClick={() => handleUnselect(item)}
                >
                  <IconX className="size-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            )
          })}

          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <div className="relative mt-2">
        <CommandList>
          {open && selectable.length > 0 ? (
            <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
              <CommandGroup className="h-full overflow-auto">
                {selectable.map((item) => {
                  return (
                    <CommandItem
                      key={item.value}
                      onMouseDown={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                      }}
                      onSelect={() => {
                        setInputValue('')
                        setSelected((prev) => {
                          const newSelected = [...prev, item]
                          onSelect && onSelect(newSelected)
                          return newSelected
                        })
                      }}
                      className={'cursor-pointer'}
                    >
                      {item.label}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </div>
          ) : null}
        </CommandList>
      </div>
    </Command>
  )
}

export default MultipleSelect
