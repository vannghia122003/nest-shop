import { IconUpload } from '@tabler/icons-react'
import { ChangeEvent, useRef } from 'react'

interface IProps {
  onChange?: (files: FileList) => void
  multiple?: boolean
}

function FileUpload({ multiple, onChange }: IProps) {
  const fileRef = useRef<HTMLInputElement | null>(null)

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files
    if (fileList) {
      onChange && onChange(fileList)
    }
    event.target.value = ''
  }

  return (
    <>
      <input
        type="file"
        multiple={multiple}
        accept="image/*"
        ref={fileRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        className="flex aspect-square w-[100px] items-center justify-center rounded-md border"
        type="button"
        onClick={() => fileRef.current?.click()}
      >
        <IconUpload className="h-4 w-4 text-muted-foreground" />
        <span className="sr-only">Upload</span>
      </button>
    </>
  )
}
export default FileUpload
