import { useEffect, useRef } from 'react'
import { Container } from 'react-bootstrap'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import HomePage from './components/HomePage'
import ProductList from './components/ProductList'
import ProductDetails from './components/ProductDetails'
import AddProduct from './components/AddProduct'
import EditProduct from './components/EditProduct'
import DeleteProduct from './components/DeleteProduct'
import AdditionalFeatures from './components/AdditionalFeatures'
import NavBar from './components/NavBar'
import './App.css'

function App() {
  const location = useLocation()
  const mainContentRef = useRef(null)

  useEffect(() => {
    const path = location.pathname

    let title = 'The Fakest Store'

    if (path === '/') title = 'Home | The Fakest Store'
    else if (path === '/products') title = 'Product Listing | The Fakest Store'
    else if (path === '/add-product' || path === '/products/new') title = 'Add Product | The Fakest Store'
    else if (path === '/additional-features') title = 'Additional Features | The Fakest Store'
    else if (/^\/products\/[^/]+\/edit$/.test(path)) title = 'Edit Product | The Fakest Store'
    else if (/^\/products\/[^/]+\/delete$/.test(path)) title = 'Delete Product | The Fakest Store'
    else if (/^\/products\/[^/]+$/.test(path)) title = 'Product Details | The Fakest Store'

    document.title = title
  }, [location.pathname])

  useEffect(() => {
    if (!mainContentRef.current) {
      return
    }

    const frame = window.requestAnimationFrame(() => {
      mainContentRef.current?.focus()
    })

    return () => {
      window.cancelAnimationFrame(frame)
    }
  }, [location.pathname])

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <NavBar />
      <main id="main-content" className="app-shell pb-4 pb-lg-5" tabIndex="-1" ref={mainContentRef}>
        <Container>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/products/new" element={<Navigate to="/add-product" replace />} />
            <Route path="/products/:productId" element={<ProductDetails />} />
            <Route path="/products/:productId/edit" element={<EditProduct />} />
            <Route path="/products/:productId/delete" element={<DeleteProduct />} />
            <Route path="/additional-features" element={<AdditionalFeatures />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Container>
      </main>
    </>
  )
}

export default App
