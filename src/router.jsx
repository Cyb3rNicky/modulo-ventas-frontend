import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./routes/ProtectedRoute";

const Login = lazy(() => import("./pages/Login.jsx"));

// Vehiculos
const Vehiculos = lazy(() => import("./pages/Vehiculos/Index.jsx"));
const CreateVehiculo = lazy(() => import("./pages/Vehiculos/Create.jsx"));
const EditVehiculo = lazy(() => import("./pages/Vehiculos/Edit.jsx"));

// Usuarios
const Usuarios = lazy(() => import("./pages/Usuarios/Index.jsx"));
const CreateUsuarios = lazy(() => import("./pages/Usuarios/Create.jsx"));
const EditUsuarios = lazy(() => import("./pages/Usuarios/Edit.jsx"));

// Clientes
const Clientes = lazy(() => import("./pages/Clientes/Index.jsx"));
const CreateCliente = lazy(() => import("./pages/Clientes/Create.jsx"));
const EditCliente = lazy(() => import("./pages/Clientes/Edit.jsx"));


const Etapas = lazy(() => import("./pages/Etapas/Index.jsx"));

// Oportunidades
const OportunidadesKanban = lazy(() => import("./pages/Oportunidades/Kanban.jsx"));
const CreateOportunidad = lazy(() => import("./pages/Oportunidades/Create.jsx"));
const ShowOportunidad = lazy(() => import("./pages/Oportunidades/Show.jsx"));

// Cotizaciones
const Cotizaciones = lazy(() => import("./pages/Cotizaciones/Index.jsx"));
const CreateCotizacion = lazy(() => import("./pages/Cotizaciones/Create.jsx"));
const EditCotizacion = lazy(() => import("./pages/Cotizaciones/Edit.jsx"));
const ShowCotizacion = lazy(() => import("./pages/Cotizaciones/Show.jsx"));

const Facturas = lazy(() => import("./pages/Facturas/Index.jsx"));
// const CreateFactura = lazy(() => import("./pages/Facturas/Create.jsx"));
// const ShowFactura = lazy(() => import("./pages/Facturas/Show.jsx"));

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
              <Vehiculos />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "vehiculos/create",
        element: (
          <ProtectedRoute>
            <Suspense fallback={null}>
              <CreateVehiculo />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "vehiculos/edit/:id",
        element: (
          <ProtectedRoute>
            <Suspense fallback={null}>
              <EditVehiculo />
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
      // Dentro de children de "/"
      {
        path: "clientes",
        element: (
          <ProtectedRoute>
            <Suspense fallback={null}>
              <Clientes />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "clientes/create",
        element: (
          <ProtectedRoute>
            <Suspense fallback={null}>
              <CreateCliente />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "clientes/edit/:id",
        element: (
          <ProtectedRoute>
            <Suspense fallback={null}>
              <EditCliente />
            </Suspense>
          </ProtectedRoute>
        ),
      },

      {
        path: "etapas",
        element: (
          <ProtectedRoute admin>
            <Suspense fallback={null}>
              <Etapas />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "oportunidades/kanban",
        element: (
          <ProtectedRoute>
            <Suspense fallback={null}>
              <OportunidadesKanban />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "oportunidades/create",
        element: (
          <ProtectedRoute>
            <Suspense fallback={null}>
              <CreateOportunidad />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "oportunidades/:id",
        element: (
          <ProtectedRoute>
            <Suspense fallback={null}>
              <ShowOportunidad />
            </Suspense>
          </ProtectedRoute>
        ),
      },

      {
        path: "cotizaciones",
        element: (
          <ProtectedRoute>
            <Suspense fallback={null}>
              <Cotizaciones />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "cotizaciones/create/:oportunidadId?",
        element: (
          <ProtectedRoute>
            <Suspense fallback={null}>
              <CreateCotizacion />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "cotizaciones/edit/:id",
        element: (
          <ProtectedRoute>
            <Suspense fallback={null}>
              <EditCotizacion />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "cotizaciones/:id",
        element: (
          <ProtectedRoute>
            <Suspense fallback={null}>
              <ShowCotizacion />
            </Suspense>
          </ProtectedRoute>
        ),
      },

      {
        path: "facturas",
        element: (
          <ProtectedRoute>
            <Suspense fallback={null}>
              <Facturas />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      // {
      //   path: "facturas/create/:cotizacionId?",
      //   element: (
      //     <ProtectedRoute>
      //       <Suspense fallback={null}>
      //         <CreateFactura />
      //       </Suspense>
      //     </ProtectedRoute>
      //   ),
      // },
      // {
      //   path: "facturas/:id",
      //   element: (
      //     <ProtectedRoute>
      //       <Suspense fallback={null}>
      //         <ShowFactura />
      //       </Suspense>
      //     </ProtectedRoute>
      //   ),
      // },
    ],
  },
]);

export default router;
