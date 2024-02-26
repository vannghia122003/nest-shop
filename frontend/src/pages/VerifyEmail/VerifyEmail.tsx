import { useMutation } from '@tanstack/react-query'
import clsx from 'clsx'
import { useContext, useEffect, useState } from 'react'
import { FaCheck, FaTimes } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import authApi from '~/apis/auth.api'
import userApi from '~/apis/user.api'
import { AppContext } from '~/contexts/app.context'
import { useQueryParams } from '~/hooks'
import {
  setAccessTokenToLocalStorage,
  setProfileToLocalStorage,
  setRefreshTokenToLocalStorage
} from '~/utils/auth'
import { socket } from '~/utils/socket'
import { jwtDecode } from 'jwt-decode'
import { TokenPayload } from '~/types/auth.type'

function VerifyEmail() {
  const { setProfile } = useContext(AppContext)
  const { token } = useQueryParams()
  const navigate = useNavigate()
  const [waitingTime, setWaitingTime] = useState(0)
  const [message, setMessage] = useState('')
  const { mutate, isPending, isError, isSuccess } = useMutation({ mutationFn: authApi.verifyEmail })

  useEffect(() => {
    const decoded = jwtDecode<TokenPayload>(token as string)
    socket.emit('join_user_room', decoded.user_id)
  }, [token])

  useEffect(() => {
    if (token) {
      mutate(token, {
        onSuccess: async (data) => {
          setWaitingTime(6)
          setMessage(data.message)
          const { access_token, refresh_token } = data.result
          setAccessTokenToLocalStorage(access_token)
          setRefreshTokenToLocalStorage(refresh_token)
          const user = await userApi.getMe()
          setProfile(user.result)
          setProfileToLocalStorage(user.result)
          socket.emit('user_verify_email_success')
        },
        onError: async () => {
          setWaitingTime(6)
        }
      })
    } else {
      navigate('/')
    }
  }, [mutate, navigate, setProfile, token])

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    if (waitingTime > 0) {
      timer = setTimeout(() => {
        setWaitingTime((prev) => prev - 1)
      }, 1000)
    }
    if (waitingTime === 1) {
      // navigate('/')
      window.close()
    }
    return () => {
      clearTimeout(timer)
    }
  }, [navigate, waitingTime])

  return (
    <div className="container">
      <div className="flex justify-center items-center relative mt-6">
        <div
          className={clsx('w-52 h-52 border-4 rounded-full', {
            'animate-spin border-t-primary': isPending,
            'border-primary': isSuccess,
            'border-red-500': isError
          })}
        ></div>
        <span
          className={clsx('text-9xl absolute', {
            'text-primary': !isError,
            'text-red-500': isError
          })}
        >
          {!isError && <FaCheck />}
          {isError && <FaTimes />}
        </span>
      </div>
      <div className="text-center text-2xl pt-4">
        {isPending && <p>Đang xác thực</p>}
        {isSuccess && <p>{message}</p>}
        {isError && <p>Xác thực email thất bại, vui lòng thử lại sau</p>}
        {waitingTime > 0 && <p>Bạn sẽ chuyển hướng trong {waitingTime} giây</p>}
      </div>
    </div>
  )
}

export default VerifyEmail
