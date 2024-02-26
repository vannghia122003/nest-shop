import clsx from 'clsx'
import ReactSelect, { GroupBase, Props as PropsSelect } from 'react-select'

interface Props<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
> extends PropsSelect<Option, IsMulti, Group> {
  hasError?: boolean
  errorMessage?: string
  classNameError?: string
  menuHeight?: number
}

function Select<Option>({
  errorMessage,
  hasError,
  classNameError = 'mt-1 text-red-600 text-sm min-h-[1.25rem]',
  menuHeight = 200,
  ...rest
}: Props<Option>) {
  return (
    <>
      <ReactSelect
        className="text-secondary"
        classNames={{
          control: (state) =>
            clsx('!rounded-md !shadow', {
              '!shadow-none': state.isFocused,
              '!border-red-600 !bg-red-50': errorMessage
            }),
          input: () => '!m-0 !p-0',
          valueContainer: () => '!py-3 !pl-4',
          singleValue: () => '!m-0',
          menuList: () => `!max-h-[${menuHeight}px]`,
          placeholder: () => '!text-[#9CA3AF]'
        }}
        theme={(theme) => ({
          ...theme,
          colors: {
            ...theme.colors,
            primary: '#3BB77E',
            primary25: 'rgba(59, 181, 124, 0.25)',
            primary50: 'rgba(59, 181, 124, 0.25)',
            primary75: 'rgba(59, 181, 124, 0.25)'
          }
        })}
        {...rest}
      />
      {hasError && <div className={classNameError}>{errorMessage}</div>}
    </>
  )
}

export default Select
