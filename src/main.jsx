import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import LoadingScreen from './components/LoadingScreen.jsx'
import lazyWithRetry from './utils/lazyWithRetry.js'
const RootLayout = lazyWithRetry(() => import('./layout/RootLayout.jsx'))
const Home = lazyWithRetry(() => import('./pages/Home.jsx'))
const CreditoCarbono = lazyWithRetry(() => import('./pages/CreditoCarbono.jsx'))
const Sobre = lazyWithRetry(() => import('./pages/Sobre.jsx'))
const Contato = lazyWithRetry(() => import('./pages/Contato.jsx'))
const Apresentacao = lazyWithRetry(() => import('./pages/Apresentacao.jsx'))
const Projetos = lazyWithRetry(() => import('./pages/Projetos.jsx'))
const Registros = lazyWithRetry(() => import('./pages/Registro.jsx'))

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
