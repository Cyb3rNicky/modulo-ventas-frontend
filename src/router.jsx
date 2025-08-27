import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import Layout from './components/layout/Layout'

const Productos = lazy(() => import('./pages/Productos/Index.jsx'))
const CreateProducto = lazy(() => import('./pages/Productos/Create.jsx'))

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { 
        index: true, 
        element: (
          <Suspense fallback={null}>
            <Productos />
          </Suspense>
        ) 
      },
      {
        path: 'productos/create',
        element: (
          <Suspense fallback={null}>
            <CreateProducto />
          </Suspense>
        )
      },
    ],
  },
])

export default router
