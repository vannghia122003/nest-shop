import clsx from 'clsx'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import config from '~/constants/config'

interface Props {
  value?: string[]
  onChange?: (files: File[], previewImages: string[]) => void
  multiple?: boolean
  errorMessage?: string
  maxLength?: number
  className?: string
}

function InputFile({ onChange, multiple, errorMessage, maxLength, value, className }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [_, setFiles] = useState<File[]>()
  const [preview, setPreview] = useState<string[]>([])

  useEffect(() => {
    if (value) {
      setPreview(value)
    }
  }, [value])

  useEffect(() => {
    return () => {
      preview.map((url) => URL.revokeObjectURL(url))
    }
  }, [preview])

  const handleUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files
    if (fileList) {
      const files: File[] = Array.from(fileList)
      let isValid = true
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        if (file && (file.size > config.max_size_upload_image || !file.type.includes('image'))) {
          isValid = false
          break
        }
      }

      if (!isValid) {
        toast.error('File phải là ảnh và bé hơn 500KB')
      } else if (files.length > (maxLength || 1)) {
        toast.error(`Chỉ được chọn ${maxLength} file`)
      } else {
        preview.map((url) => URL.revokeObjectURL(url))
        const previewImages = files.map((file) => URL.createObjectURL(file))
        setPreview(previewImages)
        setFiles(files)
        onChange && onChange(files, previewImages)
      }
    }
    event.target.value = ''
  }

  return (
    <div className={className}>
      <input
        type="file"
        accept=".jpg,.jpeg,.png"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple={multiple}
      />
      <div
        aria-hidden
        className="h-[45px] rounded-md  flex items-center overflow-hidden cursor-pointer focus:border-primary shadow w-full"
        onClick={handleUpload}
      >
        <button
          type="button"
          className="px-4 bg-secondary text-white h-full whitespace-nowrap hover:opacity-80 border-secondary border"
        >
          Chọn ảnh
        </button>
        <div
          className={clsx('w-full rounded-r-md h-full border-y border-r border-gray-300', {
            'border-red-600 bg-red-50': errorMessage
          })}
        >
          <div className="flex items-center h-full">
            <p className="px-3 text-gray-400">
              {preview.length > 0 ? `${preview.length} file` : 'Không có file nào'}{' '}
            </p>
          </div>
        </div>
      </div>
      {preview.length > 0 && (
        <div className="grid grid-cols-6 gap-2 mt-2">
          {preview.map((url, index) => (
            <div key={index} className="relative pt-[100%]">
              <img className="absolute top-0 h-full w-full" src={url} alt={url} />
              <div className="absolute border border-gray-300 inset-0 shadow"></div>
            </div>
          ))}
        </div>
      )}

      <p className="mt-1 text-red-600 text-sm min-h-[1.25rem]">{errorMessage}</p>
    </div>
  )
}
export default InputFile
