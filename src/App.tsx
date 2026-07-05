import { lazy } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import { Layout } from '@/components/layout/Layout'
import { Preloader } from '@/components/system/Preloader'

const Home = lazy(() => import('@/pages/Home'))
const About = lazy(() => import('@/pages/About'))
const Products = lazy(() => import('@/pages/Products'))
const Showcase = lazy(() => import('@/pages/Showcase'))
const Infrastructure = lazy(() => import('@/pages/Infrastructure'))
const Clients = lazy(() => import('@/pages/Clients'))
const Contact = lazy(() => import('@/pages/Contact'))
const NotFound = lazy(() => import('@/pages/NotFound'))
const Viewer = lazy(() => import('@/pages/Viewer'))

export default function App() {
  // reducedMotion="user" makes every Framer animation honor the OS preference.
  return (
    <MotionConfig reducedMotion="user">
      <Preloader />
      <BrowserRouter>
        <Routes>
          {/* Full-screen 3D prototype, outside the marketing chrome. */}
          <Route path="/lab" element={<Viewer />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products />} />
            <Route path="/showcase" element={<Showcase />} />
            <Route path="/infrastructure" element={<Infrastructure />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </MotionConfig>
  )
}
