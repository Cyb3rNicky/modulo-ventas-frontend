import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./routes/ProtectedRoute";

const Login = lazy(() => import("./pages/Login.jsx"));

// Productos
const Productos = lazy(() => import("./pages/Productos/Index.jsx"));
const CreateProducto = lazy(() => import("./pages/Productos/Create.jsx"));
const EditProducto = lazy(() => import("./pages/Productos/Edit.jsx"));

// Usuarios
const Usuarios = lazy(() => import("./pages/Usuarios/Index.jsx"));
const CreateUsuarios = lazy(() => import("./pages/Usuarios/Create.jsx"));
const EditUsuarios = lazy(() => import("./pages/Usuarios/Edit.jsx"));

// Ventas
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

  // Rutas protegidas
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      // Productos → solo requiere estar logueado
      {
        index: true,
        element: (
          <ProtectedRoute>
            <Suspense fallback={null}>
              <Productos />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "productos/create",
        element: (
          <ProtectedRoute>
            <Suspense fallback={null}>
              <CreateProducto />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "productos/edit/:id",
        element: (
          <ProtectedRoute>
            <Suspense fallback={null}>
              <EditProducto />
            </Suspense>
          </ProtectedRoute>
        ),
      },

      // Ventas → solo requiere estar logueado
      {
        path: "ventas",
        element: (
          <ProtectedRoute>
            <Suspense fallback={null}>
              <Ventas />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "ventas/create",
        element: (
          <ProtectedRoute>
            <Suspense fallback={null}>
              <CreateVentas />
            </Suspense>
          </ProtectedRoute>
        ),
      },

      // Usuarios → solo admins
      {
        path: "usuarios",
        element: (
          <ProtectedRoute admin>
            <Suspense fallback={null}>
              <Usuarios />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "usuarios/create",
        element: (
          <ProtectedRoute admin>
            <Suspense fallback={null}>
              <CreateUsuarios />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "usuarios/edit/:id",
        element: (
          <ProtectedRoute admin>
            <Suspense fallback={null}>
              <EditUsuarios />
            </Suspense>
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;
