import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Editor } from '@tinymce/tinymce-react'
import clsx from 'clsx'
import { Modal } from 'flowbite-react'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import * as yup from 'yup'
import categoryApi from '~/apis/category.api'
import productApi from '~/apis/product.api'
import userApi from '~/apis/user.api'
import Button from '~/components/Button'
import Input from '~/components/Input'
import InputNumber from '~/components/InputNumber'
import Select from '~/components/Select'
import { ProductBody } from '~/types/product.type'
import { ErrorResponse } from '~/types/response.type'
import { isUnprocessableEntity } from '~/utils/errors'
import InputFile from '../../../components/InputFile'
import QUERY_KEYS from '~/constants/keys'

interface Props {
  openModal: boolean
  onCloseModal: () => void
  updatingProductId: string
}

const productSchema = yup.object({
  name: yup.string().required('Nhập tên sản phẩm'),
  category: yup
    .object()
    .shape({ label: yup.string(), value: yup.string().required('Chọn danh mục') }),
  price: yup.number().required('Nhập giá'),
  quantity: yup.number().required('Nhập số lượng'),
  sold: yup.number().required('Nhập số lượng đã bán'),
  view: yup.number().required('Nhập số lượt xem'),
  image: yup.string().required('Chọn ảnh của sản phẩm'),
  images: yup.array().of(yup.string().defined()).required('Chọn ảnh chi tiết của sản phẩm'),
  description: yup.string().required('Nhập mô tả sản phẩm')
})
type FormData = yup.InferType<typeof productSchema>
type FormDataError = {
  [key in keyof FormData]: string
}

const ProductModal = forwardRef<{ reset: () => void }, Props>(function ProductModalInner(
  { openModal, onCloseModal, updatingProductId },
  ref
) {
  const queryClient = useQueryClient()
  const form = useForm<FormData>({
    resolver: yupResolver(productSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur'
  })
  const formErrors = form.formState.errors
  const { data: categoriesData } = useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES],
    queryFn: () => categoryApi.getCategories(),
    staleTime: 5 * 60 * 1000,
    enabled: openModal
  })
  const { data: productData } = useQuery({
    queryKey: [QUERY_KEYS.PRODUCT_DETAIL],
    queryFn: () => productApi.getProductDetail(updatingProductId),
    enabled: Boolean(updatingProductId)
  })
  const [image, setImage] = useState<File>()
  const [images, setImages] = useState<File[]>()
  const uploadImageMutation = useMutation({ mutationFn: userApi.uploadImage })
  const createProductMutation = useMutation({ mutationFn: productApi.createProduct })
  const updateProductMutation = useMutation({ mutationFn: productApi.updateProduct })
  const isPending =
    uploadImageMutation.isPending ||
    createProductMutation.isPending ||
    updateProductMutation.isPending

  useEffect(() => {
    if (updatingProductId) {
      if (productData) {
        const { name, category, price, quantity, sold, view, image, images, description } =
          productData.result
        form.setValue('name', name)
        form.setValue('category', { value: category?._id as string, label: category?.name })
        form.setValue('price', price)
        form.setValue('quantity', quantity)
        form.setValue('sold', sold)
        form.setValue('view', view)
        form.setValue('image', image)
        form.setValue('images', images)
        form.setValue('description', description)
      }
    }
  }, [form, productData, updatingProductId])

  const handleSubmit = form.handleSubmit(async (data: FormData) => {
    const dataUpdate: ProductBody = { ...data, category_id: data.category.value }
    try {
      if (image) {
        const formData = new FormData()
        formData.append('image', image)
        const res = await uploadImageMutation.mutateAsync(formData)
        dataUpdate.image = res.result[0]
      }
      if (images) {
        const formData = new FormData()
        images.forEach((image) => {
          formData.append('image', image)
        })
        const res = await uploadImageMutation.mutateAsync(formData)
        dataUpdate.images = res.result
      }

      if (!updatingProductId) {
        const res = await createProductMutation.mutateAsync(dataUpdate)
        toast.success(res.message)
      } else {
        const res = await updateProductMutation.mutateAsync({
          product_id: updatingProductId,
          data: dataUpdate
        })
        toast.success(res.message)
      }
      form.reset()
      onCloseModal()
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS] })
    } catch (error) {
      if (isUnprocessableEntity<ErrorResponse<FormDataError>>(error)) {
        const formError = error.response?.data.errors
        if (formError) {
          Object.keys(formError).forEach((key) => {
            form.setError(key as keyof FormDataError, {
              message: formError[key as keyof FormDataError],
              type: 'Server'
            })
          })
        }
      }
    }
  })

  useImperativeHandle(ref, () => {
    return { reset: form.reset }
  })

  return (
    <Modal dismissible show={openModal} onClose={onCloseModal} size="3xl" className="z-999">
      <Modal.Header>{updatingProductId ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}</Modal.Header>
      <Modal.Body>
        <form
          className="text-secondary flex gap-2 flex-col"
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
            <div>
              <div className="mb-1">Tên sản phẩm</div>
              <Input name="name" placeholder="Áo thun nam nữ cotton..." formObj={form} />
            </div>
            <div>
              <div className="mb-1">Danh mục</div>
              <Controller
                control={form.control}
                name="category"
                render={({ field }) => (
                  <Select
                    hasError
                    placeholder="Áo thun"
                    errorMessage={formErrors.category?.value?.message}
                    options={categoriesData?.result.map((category) => ({
                      value: category._id,
                      label: category.name
                    }))}
                    value={field.value}
                    onChange={(option) => {
                      field.onChange(option)
                      form.clearErrors('category')
                    }}
                  />
                )}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
            <div>
              <div className="mb-1">Giá</div>
              <Controller
                control={form.control}
                name="price"
                render={({ field }) => (
                  <InputNumber
                    placeholder="1000000"
                    hasError
                    errorMessage={formErrors.price?.message}
                    {...field}
                    onChange={(event) => {
                      form.clearErrors('price')
                      field.onChange(event)
                    }}
                  />
                )}
              />
            </div>
            <div>
              <div className="mb-1">Số lượng</div>
              <Controller
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <InputNumber
                    placeholder="10"
                    hasError
                    errorMessage={formErrors.quantity?.message}
                    {...field}
                    onChange={(event) => {
                      form.clearErrors('quantity')
                      field.onChange(event)
                    }}
                  />
                )}
              />
            </div>
            <div>
              <div className="mb-1">Đã bán</div>
              <Controller
                control={form.control}
                name="sold"
                render={({ field }) => (
                  <InputNumber
                    placeholder="100"
                    hasError
                    errorMessage={formErrors.sold?.message}
                    {...field}
                    onChange={(event) => {
                      form.clearErrors('sold')
                      field.onChange(event)
                    }}
                  />
                )}
              />
            </div>
            <div>
              <div className="mb-1">Lượt xem</div>
              <Controller
                control={form.control}
                name="view"
                render={({ field }) => (
                  <InputNumber
                    placeholder="100"
                    hasError
                    errorMessage={formErrors.view?.message}
                    {...field}
                    onChange={(event) => {
                      form.clearErrors('view')
                      field.onChange(event)
                    }}
                  />
                )}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
            <div>
              <div className="mb-1">Ảnh sản phẩm</div>
              <Controller
                control={form.control}
                name="image"
                render={({ field }) => (
                  <InputFile
                    value={field.value ? [field.value] : []}
                    onChange={(files, previewImages) => {
                      form.clearErrors('image')
                      field.onChange(previewImages[0])
                      setImage(files[0])
                    }}
                    errorMessage={formErrors.image?.message}
                  />
                )}
              />
            </div>
            <div>
              <div className="mb-1">Ảnh chi tiết (tối đa 6 ảnh)</div>
              <Controller
                control={form.control}
                name="images"
                render={({ field }) => (
                  <InputFile
                    maxLength={6}
                    multiple
                    errorMessage={formErrors.images?.message}
                    value={field.value}
                    onChange={(files, previewImages) => {
                      form.clearErrors('images')
                      field.onChange(previewImages)
                      setImages(files)
                    }}
                  />
                )}
              />
            </div>
          </div>
          <div>
            <div className="mb-1">Mô tả sản phẩm</div>
            <Controller
              control={form.control}
              name="description"
              render={({ field }) => (
                <div className={clsx({ error: formErrors.description?.message })}>
                  <Editor
                    apiKey="t40ljeswlp7ye88sch375sx9nyf878xw2s1bpm5soodorq4t"
                    init={{
                      height: 300,
                      menubar: false,
                      placeholder: 'Mô tả...',
                      plugins:
                        'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
                      toolbar:
                        'undo redo | formatselect | ' +
                        'bold italic forecolor backcolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat',
                      statusbar: false
                    }}
                    value={field.value}
                    onEditorChange={(value) => {
                      form.clearErrors('description')
                      field.onChange(value)
                    }}
                  />
                </div>
              )}
            />
            <p className="mt-1 text-red-600 text-sm min-h-[1.25rem]">
              {formErrors.description?.message}
            </p>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          disabled={isPending}
          isLoading={isPending}
          className="bg-secondary text-white py-3 px-4 rounded-md hover:opacity-80"
          onClick={handleSubmit}
        >
          {updatingProductId ? 'Lưu' : 'Thêm'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
})
export default ProductModal
