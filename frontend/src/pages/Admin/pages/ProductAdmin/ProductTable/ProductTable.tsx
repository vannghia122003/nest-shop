import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Button,
  Flowbite,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow
} from 'flowbite-react'
import { useState } from 'react'
import { FaEdit, FaTrashAlt } from 'react-icons/fa'
import productApi from '~/apis/product.api'
import ConfirmModal from '~/components/ConfirmModal'
import QUERY_KEYS from '~/constants/keys'
import { customTheme } from '~/types/custom.type'
import { Product } from '~/types/product.type'
import { formatCurrency } from '~/utils/helpers'

interface Props {
  productList: Product[]
  handleUpdateProduct: (productId: string) => void
}

function ProductTable({ productList, handleUpdateProduct }: Props) {
  const [openModalConfirm, setOpenModalConfirm] = useState<boolean>(false)
  const [deletingProductId, setDeletingProductId] = useState('')
  const queryClient = useQueryClient()
  const deleteProductMutation = useMutation({ mutationFn: productApi.deleteProduct })

  const handleDeleteProduct = (productId: string) => {
    setOpenModalConfirm(true)
    setDeletingProductId(productId)
  }

  const handleCloseModalConfirm = () => {
    setOpenModalConfirm(false)
    setDeletingProductId('')
  }

  const handleConfirmDeleteProduct = () => {
    deleteProductMutation.mutate(deletingProductId, {
      onSuccess: () => {
        setOpenModalConfirm(false)
        setDeletingProductId('')
        queryClient.refetchQueries({ queryKey: [QUERY_KEYS.PRODUCTS] })
      }
    })
  }

  return (
    <>
      <Flowbite theme={{ theme: customTheme }}>
        <Table hoverable className="border border-gray-300">
          <TableHead>
            <TableHeadCell>Tên sản phẩm</TableHeadCell>
            <TableHeadCell>Danh mục</TableHeadCell>
            <TableHeadCell>Số lượng</TableHeadCell>
            <TableHeadCell>Giá</TableHeadCell>
            <TableHeadCell>Đã bán</TableHeadCell>
            <TableHeadCell>Lượt xem</TableHeadCell>
            <TableHeadCell>Thao tác</TableHeadCell>
          </TableHead>
          <TableBody className="divide-y">
            {productList.map((product) => (
              <TableRow className="bg-white" key={product._id}>
                <TableCell className="w-[450px]">{product.name}</TableCell>
                <TableCell>{product.category?.name}</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>{formatCurrency(product.price)}₫</TableCell>
                <TableCell>{product.sold}</TableCell>
                <TableCell>{product.view}</TableCell>
                <TableCell className="flex gap-2">
                  <Button
                    color="cyan"
                    size="xs"
                    onClick={() => handleUpdateProduct(product._id)}
                    title="Chỉnh sửa"
                  >
                    <span className="text-lg">
                      <FaEdit />
                    </span>
                  </Button>
                  <Button
                    color="red"
                    size="xs"
                    onClick={() => handleDeleteProduct(product._id)}
                    title="Xoá"
                  >
                    <span className="text-lg">
                      <FaTrashAlt />
                    </span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Flowbite>
      <ConfirmModal
        description="Bạn có chắc chắn muốn xóa sản phẩm này không?"
        openModal={openModalConfirm}
        onCloseModal={handleCloseModalConfirm}
        onConfirm={handleConfirmDeleteProduct}
        isLoading={deleteProductMutation.isPending}
      />
    </>
  )
}
export default ProductTable
