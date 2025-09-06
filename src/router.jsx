import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./routes/ProtectedRoute";

const Login = lazy(() => import("./pages/Login.jsx"));

const Productos = lazy(() => import("./pages/Productos/Index.jsx"));
const CreateProducto = lazy(() => import("./pages/Productos/Create.jsx"));
const EditProducto = lazy(() => import("./pages/Productos/Edit.jsx"));

const Usuarios = lazy(() => import("./pages/Usuarios/Index.jsx"));
const CreateUsuarios = lazy(() => import("./pages/Usuarios/Create.jsx"));
const EditUsuarios = lazy(() => import("./pages/Usuarios/Edit.jsx"));

const Ventas = lazy(() => import("./pages/Ventas/Index.jsx"));
const CreateVentas = lazy(() => import("./pages/Ventas/Create.jsx"));

const router = createBrowserRouter([
  // Login público
  {
    path: "/login",
    element: (
      <Suspense fallback={null}>
        <Login />
      </Suspense>
    ),
  },

  // Todo lo demás protegido
  {
    path: "/",
    element: <ProtectedRoute />,   // <-- Protege este grupo
    children: [
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
            path: "usuarios",
            element: (
              <Suspense fallback={null}>
                <Usuarios />
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
          {
            path: "usuarios/create",
            element: (
              <Suspense fallback={null}>
                <CreateUsuarios />
              </Suspense>
            ),
          },
          {
            path: "usuarios/edit/:id",
            element: (
              <Suspense fallback={null}>
                <EditUsuarios />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
]);

export default router;
