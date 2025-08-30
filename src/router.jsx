import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/layout/Layout";

const Productos = lazy(() => import("./pages/Productos/Index.jsx"));
const CreateProducto = lazy(() => import("./pages/Productos/Create.jsx"));
const EditProducto = lazy(() => import("./pages/Productos/Edit.jsx"));

const Ventas = lazy(() => import("./pages/Ventas/Index.jsx"));
const CreateVentas = lazy(() => import("./pages/Ventas/Create.jsx"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={null}>
            <Productos />
          </Suspense>
        ),
      },
      {
        path: "productos/create",
        element: (
          <Suspense fallback={null}>
            <CreateProducto />
          </Suspense>
        ),
      },
      {
        path: "productos/edit/:id",
        element: (
          <Suspense fallback={null}>
            <EditProducto />
          </Suspense>
        ),
      },
      {
        path: "ventas",
        element: (
          <Suspense fallback={null}>
            <Ventas />
          </Suspense>
        ),
      },
      {
        path: "ventas/create",
        element: (
          <Suspense fallback={null}>
            <CreateVentas />
          </Suspense>
        ),
      },
    ],
  },
]);

export default router;
