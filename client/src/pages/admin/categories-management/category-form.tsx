import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { categoryApi, fileApi } from '@/api'
import { useTableContext } from '@/components/data-table/table-provider'
import FormDialog from '@/components/form-dialog'
import FormFileUpload from '@/components/form-input/form-file-upload'
import FormText from '@/components/form-input/form-text'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { handleUnprocessableEntityError } from '@/utils/helper'
import QUERY_KEY from '@/utils/query-key'

const schema = z.object({
  name: z.string().min(1, { message: 'Name is required' }).max(30),
  thumbnail: z.string().min(1, { message: 'Thumbnail is required' }).url()
})
type FormData = z.infer<typeof schema>

function CategoryForm() {
  const queryClient = useQueryClient()
  const { updatingRowId, setUpdatingRowId } = useTableContext()
  const [open, setOpen] = useState<boolean>(false)
  const [file, setFile] = useState<File | null>(null)
  const createCategoryMutation = useMutation({ mutationFn: categoryApi.createCategory })
  const updateCategoryMutation = useMutation({ mutationFn: categoryApi.updateCategory })
  const uploadImageMutation = useMutation({ mutationFn: fileApi.uploadImage })
  const { data: categoryData } = useQuery({
    queryKey: [QUERY_KEY.CATEGORY_DETAIL, updatingRowId],
    queryFn: () => categoryApi.getCategoryById(updatingRowId!),
    enabled: Boolean(updatingRowId)
  })
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    shouldFocusError: false,
    defaultValues: { name: '', thumbnail: '' }
  })
  const thumbnail = form.watch('thumbnail')
  const isPending =
    uploadImageMutation.isPending ||
    createCategoryMutation.isPending ||
    updateCategoryMutation.isPending

  useEffect(() => {
    form.clearErrors()
    if (categoryData) {
      form.setValue('name', categoryData.data.name)
      form.setValue('thumbnail', categoryData.data.thumbnail)
    }
  }, [categoryData, form])

  const handleOpenChangeDialog = (open: boolean) => {
    setOpen(open)
    form.reset()
    if (!open) {
      setFile(null)
      setUpdatingRowId(null)
    }
  }

  const handleFileChange = (files: File[], previews: string[]) => {
    setFile(files[0])
    form.setValue('thumbnail', previews[0])
  }

  const handleSubmit = form.handleSubmit(async (data) => {
    const body = { ...data }
    try {
      if (file) {
        const formData = new FormData()
        formData.append('images', file)
        const res = await uploadImageMutation.mutateAsync(formData)
        const imageUrl = res.data[0]
        body.thumbnail = imageUrl
      }
      if (updatingRowId) {
        const res = await updateCategoryMutation.mutateAsync({ categoryId: updatingRowId, body })
        toast.success(res.message)
        setUpdatingRowId(null)
      } else {
        const res = await createCategoryMutation.mutateAsync(body)
        toast.success(res.message)
        setOpen(false)
      }
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.CATEGORIES] })
      setFile(null)
      form.reset()
    } catch (error) {
      handleUnprocessableEntityError(error, form.setError)
    }
  })

  return (
    <FormDialog
      open={open || Boolean(updatingRowId)}
      title={updatingRowId ? 'Update category' : 'Create category'}
      description={
        updatingRowId
          ? "Update category here. Click save when you're done."
          : "Create new category here. Click create when you're done."
      }
      onOpenChange={handleOpenChangeDialog}
      btnTrigger={<Button>Add new</Button>}
    >
      <Form {...form}>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormText form={form} name="name" label="Name" placeholder="Enter your name" />
            <FormFileUpload
              form={form}
              name="thumbnail"
              label="Thumbnail"
              value={[thumbnail]}
              onChange={handleFileChange}
            />
          </div>
          <Button type="submit" className="mt-5" loading={isPending}>
            {updatingRowId ? 'Save' : 'Create'}
          </Button>
        </form>
      </Form>
    </FormDialog>
  )
}
export default CategoryForm
