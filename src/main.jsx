import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import LoadingScreen from './components/LoadingScreen.jsx'
const RootLayout = lazy(() => import('./layout/RootLayout.jsx'))
const Home = lazy(() => import('./pages/Home.jsx'))
const CreditoCarbono = lazy(() => import('./pages/CreditoCarbono.jsx'))
const Sobre = lazy(() => import('./pages/Sobre.jsx'))
const Contato = lazy(() => import('./pages/Contato.jsx'))
const Apresentacao = lazy(() => import('./pages/Apresentacao.jsx'))
const Projetos = lazy(() => import('./pages/Projetos.jsx'))
const Registros = lazy(() => import('./pages/Registro.jsx'))

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'registros', element: <Registros /> },
      { path: 'projetos', element: <Projetos /> },
      { path: 'credito-de-carbono', element: <CreditoCarbono /> },
      { path: 'sobre', element: <Sobre /> },
      { path: 'contato', element: <Contato /> },
      { path: 'apresentacao', element: <Apresentacao /> },
    ],
  },
], { basename: import.meta.env.BASE_URL })

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Suspense fallback={<LoadingScreen fullscreen label="" /> }>
      <RouterProvider router={router} />
    </Suspense>
  </StrictMode>,
)
