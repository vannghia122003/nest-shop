import { IconCheck, IconX } from '@tabler/icons-react'
import { useMutation } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import accountApi from '@/api/account-api'
import { IErrorResponse } from '@/types/response'
import { isUnauthorizedError } from '@/utils/error'
import { cn } from '@/utils/helper'

function VerifyAccount() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [message, setMessage] = useState('')
  const [waitingTime, setWaitingTime] = useState(0)
  const verificationToken = searchParams.get('verificationToken')
  const { mutateAsync, isPending, isError, isSuccess } = useMutation({
    mutationFn: accountApi.verifyAccount
  })

  useEffect(() => {
    const handleVerifyAccount = async () => {
      if (verificationToken) {
        try {
          const res = await mutateAsync({ verificationToken })
          setWaitingTime(6)
          setMessage(res.message)
        } catch (error) {
          if (isUnauthorizedError<IErrorResponse>(error)) {
            error.response && setMessage(error.response.data.message)
          }
          setWaitingTime(6)
        }
      } else {
        navigate('/')
      }
    }
    handleVerifyAccount()
  }, [navigate, verificationToken, mutateAsync])

  useEffect(() => {
    let timer: number
    if (waitingTime > 0) {
      timer = setTimeout(() => {
        setWaitingTime((prev) => prev - 1)
      }, 1000)
    }
    if (waitingTime === 1) {
      navigate('/')
    }
    return () => {
      clearTimeout(timer)
    }
  }, [navigate, waitingTime])

  return (
    <div className="container">
      <div className="relative mt-6 flex items-center justify-center">
        <div
          className={cn('size-52 rounded-full border-4', {
            'animate-spin border-t-primary': isPending,
            'border-primary': isSuccess,
            'border-red-500': isError
          })}
        ></div>
        <span className={cn('absolute', isError ? 'text-red-500' : 'text-primary')}>
          {!isError && <IconCheck size={150} />}
          {isError && <IconX size={150} />}
        </span>
      </div>
      <div className="pt-4 text-center text-2xl">
        {isPending && <p>Verifying</p>}
        {isSuccess && <p>{message}</p>}
        {isError && <p>{message}</p>}
        {waitingTime > 0 && <p>You will be redirected in {waitingTime} seconds</p>}
      </div>
    </div>
  )
}

export default VerifyAccount
