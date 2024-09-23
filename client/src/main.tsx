import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'sonner'

import { AppProvider } from '@/contexts/app-provider'
import { ThemeProvider } from '@/contexts/theme-provider'
import router from '@/routes/router'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0
    }
  }
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <AppProvider>
          <ThemeProvider defaultTheme="light" storageKey="theme">
            <RouterProvider router={router} />
            <Toaster closeButton richColors position="top-center" />
          </ThemeProvider>
        </AppProvider>
      </HelmetProvider>
    </QueryClientProvider>
  </StrictMode>
)
