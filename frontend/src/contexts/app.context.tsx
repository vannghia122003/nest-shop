import { useQueryClient } from '@tanstack/react-query'
import { ReactNode, createContext, useState } from 'react'
import QUERY_KEYS from '~/constants/keys'
import { User } from '~/types/user.type'
import { getAccessTokenFromLocalStorage, getProfileFromLocalStorage } from '~/utils/auth'

interface AppContextType {
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  profile: User | null
  setProfile: React.Dispatch<React.SetStateAction<User | null>>
  reset: () => void
}

const defaultValue: AppContextType = {
  isAuthenticated: Boolean(getAccessTokenFromLocalStorage()),
  setIsAuthenticated: () => null,
  profile: getProfileFromLocalStorage(),
  setProfile: () => null,
  reset: () => null
}

export const AppContext = createContext<AppContextType>(defaultValue)

function AppProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(defaultValue.isAuthenticated)
  const [profile, setProfile] = useState<User | null>(defaultValue.profile)

  const reset = () => {
    setIsAuthenticated(false)
    setProfile(null)
    queryClient.removeQueries({ queryKey: [QUERY_KEYS.CART] })
    queryClient.removeQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS] })
  }

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        profile,
        setProfile,
        reset
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export default AppProvider
