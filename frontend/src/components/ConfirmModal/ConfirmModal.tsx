import { Modal } from 'flowbite-react'
import Button from '../Button'

interface Props {
  description: string
  openModal: boolean
  onCloseModal: () => void
  onConfirm: () => void
  isLoading?: boolean
}

function ConfirmModal({ description, openModal, onConfirm, onCloseModal, isLoading }: Props) {
  const handleCloseModal = () => {
    onCloseModal()
  }

  return (
    <Modal show={openModal} dismissible size="md" popup onClose={handleCloseModal}>
      <Modal.Header />
      <Modal.Body>
        <div className="text-center">
          <h3 className="mb-5 text-lg font-normal text-gray-500">{description}</h3>
          <div className="flex justify-center gap-4">
            <Button
              className="rounded-lg bg-white text-secondary border py-2 hover:bg-gray-100 border-gray-300 text-center text-base font-bold px-4"
              onClick={handleCloseModal}
            >
              Không
            </Button>
            <Button
              isLoading={isLoading}
              className="rounded-lg bg-red-700 py-2 text-center text-base font-bold text-white hover:bg-red-800 px-4"
              onClick={onConfirm}
            >
              Đồng ý
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}
export default ConfirmModal
