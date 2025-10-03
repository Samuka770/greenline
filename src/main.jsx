import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import RootLayout from './layout/RootLayout.jsx'
import Home from './pages/Home.jsx'
import CreditoCarbono from './pages/CreditoCarbono.jsx'
import Sobre from './pages/Sobre.jsx'
import Contato from './pages/Contato.jsx'
import Apresentacao from './pages/Apresentacao.jsx'
import Projetos from './pages/Projetos.jsx'
import Registros from './pages/Registro.jsx'

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
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
