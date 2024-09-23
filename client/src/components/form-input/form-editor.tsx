import { Editor } from '@tinymce/tinymce-react'
import { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form'

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useTheme } from '@/contexts/theme-provider'

interface IProps<TFieldValues extends FieldValues> {
  form: UseFormReturn<TFieldValues>
  name: FieldPath<TFieldValues>
  placeholder?: string
  label?: string
  className?: string
  disabled?: boolean
}

function FormEditor<TFieldValues extends FieldValues>(props: IProps<TFieldValues>) {
  const { name, form, placeholder, label, className, disabled } = props
  const { theme } = useTheme()

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Editor
              tinymceScriptSrc="/tinymce/tinymce.min.js"
              licenseKey="gpl"
              disabled={disabled}
              onInit={(_evt, editor) => field.ref(editor)}
              init={{
                min_height: 500,
                statusbar: false,
                placeholder: placeholder,
                plugins: [
                  'advlist',
                  'autolink',
                  'lists',
                  'link',
                  'image',
                  'charmap',
                  'anchor',
                  'searchreplace',
                  'visualblocks',
                  'code',
                  'fullscreen',
                  'insertdatetime',
                  'media',
                  'table',
                  'preview',
                  'help',
                  'emoticons'
                ],
                toolbar:
                  'blocks fontsize | ' +
                  'bold italic forecolor | alignleft aligncenter ' +
                  'alignright alignjustify | bullist numlist outdent indent | ' +
                  'removeformat preview',
                skin: theme === 'dark' ? 'oxide-dark' : 'oxide',
                content_css: theme === 'dark' ? 'dark' : 'default'
              }}
              value={field.value}
              onEditorChange={(value) => {
                field.onChange(value)
                form.clearErrors(name)
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
export default FormEditor
