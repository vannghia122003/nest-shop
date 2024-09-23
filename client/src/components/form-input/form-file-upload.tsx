import { useEffect, useState } from 'react'
import { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form'

import FileUpload from '@/components/file-upload'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

interface IProps<TFieldValues extends FieldValues> {
  form: UseFormReturn<TFieldValues>
  name: FieldPath<TFieldValues>
  value?: string[]
  label?: string
  className?: string
  multiple?: boolean
  onChange?: (files: File[], previews: string[]) => void
}

function FormFileUpload<TFieldValues extends FieldValues>(props: IProps<TFieldValues>) {
  const { name, form, label, className, multiple, value, onChange } = props
  const [, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])

  useEffect(() => {
    return () => {
      previews && previews.map((url) => URL.revokeObjectURL(url))
    }
  }, [previews])

  const handleFileChange = (fileList: FileList) => {
    const files = Array.from(fileList)
    setFiles(files)
    const previewImages = files.map((file) => URL.createObjectURL(file))
    setPreviews(previewImages)

    onChange && onChange(files, previewImages)
    form.clearErrors(name)
  }

  return (
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="flex flex-wrap gap-2">
              {previews.length > 0 &&
                previews.map((url, i) => (
                  <Avatar key={i} className="size-[100px] rounded-md border">
                    <AvatarImage src={url} className="object-cover" />
                    <AvatarFallback className="rounded-none">Image</AvatarFallback>
                  </Avatar>
                ))}
              {previews.length === 0 &&
                value &&
                value
                  .filter((url) => url)
                  .map((url, i) => (
                    <Avatar key={i} className="size-[100px] rounded-md border">
                      <AvatarImage src={url} className="object-cover" />
                      <AvatarFallback className="rounded-none">Image</AvatarFallback>
                    </Avatar>
                  ))}
              <FileUpload multiple={multiple} onChange={handleFileChange} />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default FormFileUpload
