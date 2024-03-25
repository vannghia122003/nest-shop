import clsx from 'clsx'
import { ChangeEvent, InputHTMLAttributes, useState } from 'react'
import { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

interface Props<TFieldValues extends FieldValues> extends InputHTMLAttributes<HTMLInputElement> {
  formObj?: UseFormReturn<TFieldValues>
  name: FieldPath<TFieldValues>
  classNameInput?: string
  classNameError?: string
  classNameEye?: string
  errorMessageField?: string
}

function Input<TFieldValues extends FieldValues = FieldValues>({
  formObj,
  name,
  type,
  className,
  classNameInput,
  disabled,
  onChange,
  errorMessageField,
  classNameError = 'mt-1 text-red-600 text-sm min-h-[1.25rem]',
  classNameEye = 'absolute right-3 top-1/2 -translate-y-1/2 text-lg cursor-pointer',
  ...rest
}: Props<TFieldValues>) {
  const [openEye, setOpenEye] = useState(false)
  const registerResult = formObj ? formObj.register(name) : null
  const errorMessage = (errorMessageField ??
    formObj?.formState.errors[name]?.message ??
    '') as string

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    formObj?.clearErrors(name)
    registerResult?.onChange(event)
    onChange && onChange(event)
  }

  const toggleEye = () => setOpenEye(!openEye)

  const handleType = () => {
    if (type === 'password') {
      return openEye ? 'text' : 'password'
    }
    return type
  }

  return (
    <div className={className}>
      <div className="relative">
        <input
          className={clsx(
            `${
              classNameInput
                ? classNameInput
                : 'py-3 pl-4 pr-8 w-full outline-none border rounded-md'
            } `,
            {
              'border-red-600 bg-red-50': errorMessage,
              'border-gray-300 focus:border-primary shadow bg-white': !errorMessage,
              '!bg-gray-200': disabled
            }
          )}
          {...rest}
          {...registerResult}
          disabled={disabled}
          onChange={handleChange}
          type={handleType()}
        />
        {type === 'password' && openEye && (
          <span className={classNameEye} onClick={toggleEye} role="presentation">
            <FaEye />
          </span>
        )}{' '}
        {type === 'password' && !openEye && (
          <span className={classNameEye} onClick={toggleEye} role="presentation">
            <FaEyeSlash />
          </span>
        )}
      </div>

      {formObj && <p className={classNameError}>{errorMessage}</p>}
    </div>
  )
}

export default Input
