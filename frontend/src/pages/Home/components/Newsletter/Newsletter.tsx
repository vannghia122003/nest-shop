import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { FaRegPaperPlane } from 'react-icons/fa'
import { toast } from 'react-toastify'
import * as yup from 'yup'

const schema = yup.object({
  email: yup.string().required('Vui lòng nhập email').email('Email không đúng định dạng')
})
type FormData = yup.InferType<typeof schema>

function Newsletter() {
  const form = useForm<FormData>({
    resolver: yupResolver(schema)
  })

  const handleSubmit = form.handleSubmit(
    () => {
      toast.success('Đăng ký nhận chương trình khuyến mãi thành công')
      form.reset()
    },
    (error) => {
      toast.error(error.email?.message)
    }
  )

  return (
    <div className="mt-10">
      <div className="rounded-2xl bg-gradient-to-l from-[#4CB8C4] to-[rgba(60,211,173,0.3)] p-4 sm:p-16">
        <h2 className="mb-5 text-3xl font-bold text-secondary sm:text-4xl">
          Đừng bỏ lỡ các ưu đãi tuyệt vời
        </h2>
        <p className="mb-11 text-lg text-gray-600">
          Đăng ký để nhận chương trình khuyến mãi từ <span className="text-primary">Nest Shop</span>
        </p>
        <form
          className="flex max-w-[450px] items-center justify-between overflow-hidden rounded-[50px] bg-white"
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <span className="ml-3 text-xl">
            <FaRegPaperPlane />
          </span>
          <input
            type="text"
            placeholder="Nhập email của bạn"
            className="w-full px-3 py-5 text-secondary focus:outline-none"
            {...form.register('email')}
          />
          <button className="whitespace-nowrap rounded-[50px] bg-primary px-10 py-5 font-bold text-white hover:bg-[#29A56C]">
            Đăng ký
          </button>
        </form>
      </div>
    </div>
  )
}

export default Newsletter
