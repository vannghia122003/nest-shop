import { ChangeEvent, useRef } from 'react'
import { toast } from 'react-toastify'
import config from '~/constants/config'

interface Props {
  onChange?: (file?: File) => void
}

function InputFile({ onChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && (file.size > config.max_size_upload_image || !file.type.includes('image'))) {
      toast.error('File không đúng quy định')
    } else {
      onChange && onChange(file)
    }
    event.target.value = ''
  }

  return (
    <div>
      <input
        type="file"
        accept=".jpg,.jpeg,.png"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <button
        className="h-10 rounded-sm border border-gray-300 bg-white px-6 text-sm text-secondary shadow-sm"
        type="button"
        onClick={handleUpload}
      >
        Chọn ảnh
      </button>
    </div>
  )
}

export default InputFile
