import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { BrowserRouter, Route, Routes } from "react-router";

import './index.css'
import App from './App.tsx'
import Location from './Location.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/locations/:locationId" element={<Location />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
