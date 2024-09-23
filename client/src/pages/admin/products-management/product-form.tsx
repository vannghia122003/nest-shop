import { zodResolver } from '@hookform/resolvers/zod'
import { IconPlus, IconTrash } from '@tabler/icons-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

import { categoryApi, fileApi, productApi } from '@/api'
import FormEditor from '@/components/form-input/form-editor'
import FormFileUpload from '@/components/form-input/form-file-upload'
import FormSelect from '@/components/form-input/form-select'
import FormText from '@/components/form-input/form-text'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { ICreateProductBody } from '@/types/product'
import { handleUnprocessableEntityError } from '@/utils/helper'
import PATH from '@/utils/path'
import QUERY_KEY from '@/utils/query-key'

const schema = z.object({
  name: z.string().min(1, { message: 'Name is required' }).min(10),
  thumbnail: z.string().min(1, { message: 'Thumbnail is required' }).url(),
  categoryId: z.coerce.number({ message: 'Category is required' }),
  stock: z.coerce.number({ message: 'Stock is required' }).transform((v) => +v.toPrecision()),
  price: z.coerce
    .number({ message: 'Price is required' })
    .int()
    .positive()
    .transform((v) => +v.toPrecision()),
  discount: z.coerce.number({ message: 'Discount is required' }).transform((v) => +v.toPrecision()),
  description: z.string().min(1, { message: 'Description is required' }),
  photos: z.array(z.string().url()),
  specifications: z.array(
    z.object({
      key: z.string().trim().min(1, { message: 'Key is required' }),
      value: z.string().trim().min(1, { message: 'Value is required' })
    })
  )
})
type FormData = z.infer<typeof schema>

function ProductForm() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const params = useParams()
  const updatingProductId = params.productId
  const [fileThumbnail, setFileThumbnail] = useState<File | null>(null)
  const [filePhotos, setFilePhotos] = useState<File[] | null>(null)
  const uploadImageMutation = useMutation({ mutationFn: fileApi.uploadImage })
  const createProductMutation = useMutation({ mutationFn: productApi.createProduct })
  const updateProductMutation = useMutation({ mutationFn: productApi.updateProduct })
  const { data: productData } = useQuery({
    queryKey: [QUERY_KEY.PRODUCT_DETAIL, updatingProductId],
    queryFn: () => productApi.getProductById(+updatingProductId!),
    enabled: Boolean(updatingProductId)
  })
  const { data: categoriesData } = useQuery({
    queryKey: [QUERY_KEY.CATEGORIES],
    queryFn: () => categoryApi.getAllCategories({ limit: '-1' }),
    staleTime: 5 * 60 * 1000
  })
  const isPending =
    uploadImageMutation.isPending ||
    createProductMutation.isPending ||
    updateProductMutation.isPending
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    shouldFocusError: false,
    defaultValues: {
      name: '',
      thumbnail: '',
      stock: 0,
      price: 0,
      discount: 0,
      description: '',
      photos: [],
      specifications: []
    }
  })
  const { fields, append, remove } = useFieldArray({
    name: 'specifications',
    control: form.control
  })
  const thumbnail = form.watch('thumbnail')
  const photos = form.watch('photos')

  useEffect(() => {
    if (productData) {
      form.setValue('name', productData.data.name)
      form.setValue('categoryId', productData.data.category.id)
      form.setValue('thumbnail', productData.data.thumbnail)
      form.setValue(
        'photos',
        productData.data.photos.map((p) => p.url)
      )
      form.setValue('stock', productData.data.stock)
      form.setValue('price', productData.data.price)
      form.setValue('discount', productData.data.discount)
      form.setValue('description', productData.data.description)
      form.setValue('specifications', productData.data.specifications)
    }
  }, [form, productData])

  const handleChangeThumbnail = (files: File[], previews: string[]) => {
    setFileThumbnail(files[0])
    form.setValue('thumbnail', previews[0])
  }

  const handleChangePhotos = (files: File[], previews: string[]) => {
    setFilePhotos(files)
    form.setValue('photos', previews)
  }

  const handleSubmit = form.handleSubmit(async (data) => {
    const body: ICreateProductBody = { ...data }
    try {
      if (fileThumbnail) {
        const formData = new FormData()
        formData.append('images', fileThumbnail)
        const res = await uploadImageMutation.mutateAsync(formData)
        body.thumbnail = res.data[0]
      }
      if (filePhotos) {
        const formData = new FormData()
        filePhotos.forEach((file) => {
          formData.append('images', file)
        })
        const res = await uploadImageMutation.mutateAsync(formData)
        body.photos = res.data
      }
      if (updatingProductId) {
        const res = await updateProductMutation.mutateAsync({ productId: +updatingProductId, body })
        toast.success(res.message)
      } else {
        const res = await createProductMutation.mutateAsync(body)
        toast.success(res.message)
      }
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.PRODUCTS] })
      navigate(PATH.DASHBOARD_PRODUCT)
    } catch (error) {
      handleUnprocessableEntityError(error, form.setError)
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>{updatingProductId ? 'Update product' : 'Create product'}</CardTitle>
        <CardDescription>
          {updatingProductId
            ? "Update product here. Click save when you're done."
            : "Create new product here. Click create when you're done."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormText form={form} name="name" label="Name" placeholder="Enter product name" />
              <FormSelect
                form={form}
                name="categoryId"
                label="Category"
                placeholder="Select category"
                data={categoriesData?.data.data}
              />
              <FormFileUpload
                form={form}
                name="thumbnail"
                label="Thumbnail (Single)"
                value={[thumbnail]}
                onChange={handleChangeThumbnail}
              />
              <FormFileUpload
                multiple
                form={form}
                name="photos"
                label="Photos (Multiple)"
                value={photos}
                onChange={handleChangePhotos}
              />
              <FormText
                form={form}
                name="stock"
                label="Stock"
                placeholder="Enter stock"
                type="number"
              />
              <FormText
                form={form}
                name="price"
                label="Price"
                placeholder="Enter price"
                type="number"
              />
              <FormText
                form={form}
                name="discount"
                label="Discount"
                placeholder="Enter discount"
                type="number"
              />
              <div className="col-span-full space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Specifications</Label>
                  <Button
                    size="sm"
                    type="button"
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary/10 hover:text-primary"
                    leftSection={<IconPlus />}
                    onClick={() => append({ key: '', value: '' })}
                  >
                    Add item
                  </Button>
                </div>
                {fields.map((item, index) => (
                  <div key={item.id}>
                    <div className="flex items-center gap-4">
                      <FormText
                        form={form}
                        name={`specifications.${index}.key`}
                        placeholder="Key..."
                        className="grow"
                      />
                      <FormText
                        form={form}
                        name={`specifications.${index}.value`}
                        placeholder="Value..."
                        className="grow"
                      />
                    </div>
                    <div className="text-end">
                      <Button
                        size="sm"
                        type="button"
                        variant="outline"
                        className="ml-auto mt-2 border-red-500 text-red-500 hover:bg-red-50 hover:text-red-500"
                        leftSection={<IconTrash />}
                        onClick={() => remove(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <FormEditor
                className="col-span-full"
                form={form}
                name="description"
                label="Description"
                placeholder="Enter product description"
              />
            </div>
            <Button type="submit" className="mt-5" loading={isPending} disabled={isPending}>
              {updatingProductId ? 'Save' : 'Create'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default ProductForm
