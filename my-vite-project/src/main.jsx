import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Music from './Music.jsx'
//import MyName from './MyName.jsx'
import Dice from './Dice.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Dice />
  </StrictMode>,
)
