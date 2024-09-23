import { useQueryClient } from '@tanstack/react-query'
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from 'react'

import { IUser } from '@/types/user'
import { getItemLocalStorage } from '@/utils/helper'
import QUERY_KEY from '@/utils/query-key'

interface AppProviderState {
  isAuthenticated: boolean
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>
  profile: IUser | null
  setProfile: Dispatch<SetStateAction<IUser | null>>
  logout: () => void
}

const initialState: AppProviderState = {
  isAuthenticated: Boolean(getItemLocalStorage<string>('accessToken')),
  setIsAuthenticated: () => {},
  profile: getItemLocalStorage<IUser>('profile', true),
  setProfile: () => {},
  logout: () => {}
}

const AppProviderContext = createContext<AppProviderState>(initialState)

export function AppProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialState.isAuthenticated)
  const [profile, setProfile] = useState<IUser | null>(initialState.profile)

  const logout = () => {
    setIsAuthenticated(false)
    setProfile(null)
    queryClient.removeQueries({ queryKey: [QUERY_KEY.CART] })
    // queryClient.removeQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS] })
  }
  return (
    <AppProviderContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, profile, setProfile, logout }}
    >
      {children}
    </AppProviderContext.Provider>
  )
}

export const useAppContext = () => {
  return useContext(AppProviderContext)
}
