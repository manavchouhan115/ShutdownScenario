import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import App from './App.tsx'
import { scenario } from './lib/useScenario.ts'

// The browser tab's title comes from scenario.json, like all other text.
document.title = scenario.meta.title

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
