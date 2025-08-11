import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { ToastContainer } from 'react-toastify';

import App from '@/app'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <ToastContainer />
  </StrictMode>,
)
