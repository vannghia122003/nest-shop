import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import AppProvider from './contexts/app.context'
import './index.css'
import { HelmetProvider } from 'react-helmet-async'
import router from './routes'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0
    }
  }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <HelmetProvider>
          <RouterProvider router={router} />
        </HelmetProvider>
      </AppProvider>
    </QueryClientProvider>
  </React.StrictMode>
)
