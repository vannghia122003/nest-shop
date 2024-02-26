import { yupResolver } from '@hookform/resolvers/yup'
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import {
  Button as ButtonFlowBite,
  Flowbite,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow
} from 'flowbite-react'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FaEdit, FaTrashAlt } from 'react-icons/fa'
import { toast } from 'react-toastify'
import * as yup from 'yup'
import categoryApi from '~/apis/category.api'
import userApi from '~/apis/user.api'
import Button from '~/components/Button'
import ConfirmModal from '~/components/ConfirmModal'
import Input from '~/components/Input'
import { customTheme } from '~/types/custom.type'
import InputFile from '../../components/InputFile'
import { isUnprocessableEntity } from '~/utils/errors'
import { ErrorResponse } from '~/types/response.type'

const categorySchema = yup.object({
  name: yup.string().required('Nhập tên danh mục'),
  image: yup.string().required('Chọn ảnh của danh mục')
})
type FormData = yup.InferType<typeof categorySchema>

function CategoryAdmin() {
  const [openModalConfirm, setOpenModalConfirm] = useState<boolean>(false)
  const [deletingCategoryId, setDeletingCategoryId] = useState('')
  const [updatingCategoryId, setUpdatingCategoryId] = useState('')
  const [image, setImage] = useState<File>()
  const form = useForm<FormData>({
    resolver: yupResolver(categorySchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur'
  })
  const [categoryListQuery, setCategoryListQuery] = useState<{ page: number; limit: number }>({
    page: 1,
    limit: 5
  })
  const { data: categoryListData, refetch } = useQuery({
    queryKey: ['categories', categoryListQuery],
    queryFn: () => categoryApi.getCategories(categoryListQuery),
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData
  })
  const { data: categoryData } = useQuery({
    queryKey: ['category'],
    queryFn: () => categoryApi.getCategory(updatingCategoryId),
    enabled: Boolean(updatingCategoryId)
  })
  const uploadImageMutation = useMutation({ mutationFn: userApi.uploadImage })
  const createCategoryMutation = useMutation({ mutationFn: categoryApi.createCategory })
  const updateCategoryMutation = useMutation({ mutationFn: categoryApi.updateCategory })
  const deleteCategoryMutation = useMutation({ mutationFn: categoryApi.deleteCategory })
  const isPending =
    uploadImageMutation.isPending ||
    createCategoryMutation.isPending ||
    updateCategoryMutation.isPending

  useEffect(() => {
    if (updatingCategoryId) {
      if (categoryData) {
        const { name, image } = categoryData.result
        form.setValue('name', name)
        form.setValue('image', image)
      }
    }
  }, [categoryData, form, updatingCategoryId])

  const handlePageChange = (page: number) => {
    setCategoryListQuery({ ...categoryListQuery, page })
  }

  const handleDeleteCategory = (categoryId: string) => {
    setOpenModalConfirm(true)
    setDeletingCategoryId(categoryId)
  }

  const handleConfirmDeleteCategory = () => {
    if (deletingCategoryId) {
      deleteCategoryMutation.mutate(deletingCategoryId, {
        onSuccess: () => {
          setOpenModalConfirm(false)
          setDeletingCategoryId('')
          refetch()
        }
      })
    }
  }

  const handleUpdateCategory = (categoryId: string) => setUpdatingCategoryId(categoryId)
  const handleCancelUpdate = () => {
    form.reset()
    setUpdatingCategoryId('')
  }

  const handleSubmit = form.handleSubmit(async (data: FormData) => {
    try {
      if (image) {
        const formData = new FormData()
        formData.append('image', image)
        const res = await uploadImageMutation.mutateAsync(formData)
        form.setValue('image', res.result[0])
      }
      if (!updatingCategoryId) {
        const res = await createCategoryMutation.mutateAsync(data)
        toast.success(res.message)
      } else {
        const res = await updateCategoryMutation.mutateAsync({
          category_id: updatingCategoryId,
          data
        })
        setUpdatingCategoryId('')
        toast.success(res.message)
      }
      form.reset()
      refetch()
    } catch (error) {
      if (isUnprocessableEntity<ErrorResponse<FormData>>(error)) {
        const formError = error.response?.data.errors
        if (formError) {
          Object.keys(formError).forEach((key) => {
            form.setError(key as keyof FormData, {
              message: formError[key as keyof FormData],
              type: 'Server'
            })
          })
        }
      }
    }
  })

  return (
    <div className="p-8 bg-white shadow">
      <h2 className="text-secondary text-3xl mb-4">
        {!updatingCategoryId ? 'Thêm' : 'Cập nhật'} danh mục
      </h2>
      <form
        className="text-secondary max-w-[400px] mb-4"
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <div className="flex gap-4 mb-1">
          <div className="mt-3 w-[30px]">Tên</div>
          <Input className="w-full" name="name" formObj={form} placeholder="Áo thun" />
        </div>
        <div className="flex gap-4 mb-1">
          <div className="mt-3 w-[30px]">Ảnh</div>
          <Controller
            control={form.control}
            name="image"
            render={({ field }) => (
              <InputFile
                value={field.value ? [field.value] : []}
                className="w-full"
                errorMessage={form.formState.errors.image?.message}
                onChange={(files, previewImages) => {
                  form.clearErrors('image')
                  field.onChange(previewImages[0])
                  setImage(files[0])
                }}
              />
            )}
          />
        </div>
        <div className="flex gap-4">
          <div className="w-[30px]"></div>
          <div className="flex gap-2">
            <Button
              isLoading={isPending}
              disabled={isPending}
              className="bg-secondary text-white px-4 py-3 rounded-md hover:opacity-80 font-bold"
            >
              {!updatingCategoryId ? 'Thêm' : 'Lưu'}
            </Button>
            {updatingCategoryId && (
              <button
                className="rounded-md bg-white py-3 font-bold text-secondary border border-gray-300 px-4 hover:bg-gray-200"
                type="button"
                onClick={handleCancelUpdate}
              >
                Huỷ
              </button>
            )}
          </div>
        </div>
      </form>
      <div className="overflow-x-auto mt-2">
        <div className="min-w-[600px]">
          <Flowbite theme={{ theme: customTheme }}>
            <Table hoverable className="border border-gray-300">
              <TableHead>
                <TableHeadCell>Tên danh mục</TableHeadCell>
                <TableHeadCell>Ảnh</TableHeadCell>
                <TableHeadCell>Thao tác</TableHeadCell>
              </TableHead>
              <TableBody className="divide-y">
                {categoryListData &&
                  categoryListData.result.map((category) => (
                    <TableRow className="bg-white" key={category._id}>
                      <TableCell>{category.name}</TableCell>
                      <TableCell className="py-0">
                        <img
                          className="w-[60px] h-[60px]"
                          src={category.image}
                          alt={category.name}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <ButtonFlowBite
                            color="cyan"
                            size="xs"
                            onClick={() => handleUpdateCategory(category._id)}
                            title="Chỉnh sửa"
                          >
                            <span className="text-lg">
                              <FaEdit />
                            </span>
                          </ButtonFlowBite>
                          <ButtonFlowBite
                            color="red"
                            size="xs"
                            onClick={() => handleDeleteCategory(category._id)}
                            title="Xoá"
                          >
                            <span className="text-lg">
                              <FaTrashAlt />
                            </span>
                          </ButtonFlowBite>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </Flowbite>
          <div className="bg-white border-t p-4 flex justify-center">
            <Pagination
              layout="pagination"
              currentPage={categoryListQuery.page as number}
              totalPages={categoryListData?.total_pages || 0}
              onPageChange={handlePageChange}
              previousLabel=""
              nextLabel=""
              showIcons
            />
          </div>
        </div>
        <ConfirmModal
          description="Bạn có chắc chắn muốn xóa danh mục này không?"
          openModal={openModalConfirm}
          onCloseModal={() => {
            setOpenModalConfirm(false)
            setDeletingCategoryId('')
          }}
          onConfirm={handleConfirmDeleteCategory}
          isLoading={deleteCategoryMutation.isPending}
        />
      </div>
    </div>
  )
}
export default CategoryAdmin
