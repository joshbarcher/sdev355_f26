import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import Home from './pages/Home.jsx'
import Shelf from './pages/Shelf.jsx'
import About from './pages/About.jsx'
import Layout from './layout/Layout.jsx'
import Finished from './pages/Finished.jsx'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="home" element={<Home />} />
                    <Route path="books" element={<Shelf />} />
                    <Route path="about" element={<About />} />
                    <Route path="books/finished" element={<Finished />} />
                </Route>
            </Routes>
        </BrowserRouter>
    </StrictMode>, 
)
