import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import Layout from './components/layout/Layout'

const Productos = lazy(() => import('./pages/Productos'))

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Suspense fallback={null}><Productos /></Suspense> },
    //   { path: 'reports', element: <Suspense fallback={null}><Reports /></Suspense> },
    ],
  },
])

export default router
