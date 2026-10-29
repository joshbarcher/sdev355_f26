import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import Home from './pages/Home.jsx'
import App from './App.jsx'
import About from './pages/About.jsx'
import Header from './layout/Header.jsx'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <div className="app">
                <Header />

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/books" element={<App />} />
                    <Route path="/about" element={<About />} />
                </Routes>
            </div>
        </BrowserRouter>
    </StrictMode>,
)
