import React, { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/Layout'
import PrivateRoute from './components/PrivateRoute'

// Pages
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Profiles from './pages/Profiles'
import Rewards from './pages/Rewards'
import Gifts from './pages/Gifts'
import Profile from './pages/Profile'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentCancel from './pages/PaymentCancel'

// Toast Component
function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  )
}

function Toast({ toast, onRemove }) {
  const [isLeaving, setIsLeaving] = useState(false)

  const handleRemove = () => {
    setIsLeaving(true)
    setTimeout(() => onRemove(toast.id), 300)
  }

  React.useEffect(() => {
    const timer = setTimeout(() => {
      handleRemove()
    }, toast.duration || 4000)

    return () => clearTimeout(timer)
  }, [])

  const getToastStyles = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-500 border-green-400'
      case 'error':
        return 'bg-red-500 border-red-400'
      case 'warning':
        return 'bg-yellow-500 border-yellow-400'
      default:
        return 'bg-blue-500 border-blue-400'
    }
  }

  return (
    <div
      className={`${getToastStyles()} text-white px-6 py-3 rounded-lg shadow-lg border-l-4 max-w-sm transform transition-all duration-300 ${
        isLeaving ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
      }`}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{toast.message}</p>
        <button
          onClick={handleRemove}
          className="ml-4 text-white hover:text-gray-200 focus:outline-none"
        >
          ×
        </button>
      </div>
    </div>
  )
}

function AppContent() {
  const [toasts, setToasts] = useState([])

  const addToast = (message, type = 'info', duration = 4000) => {
    const id = Date.now()
    const newToast = { id, message, type, duration }
    
    setToasts(prev => [...prev, newToast])
  }

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/cancel" element={<PaymentCancel />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/profiles" element={
            <PrivateRoute>
              <Layout>
                <Profiles />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/rewards" element={
            <PrivateRoute>
              <Layout>
                <Rewards />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/gifts" element={
            <PrivateRoute>
              <Layout>
                <Gifts />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute>
              <Layout>
                <Profile />
              </Layout>
            </PrivateRoute>
          } />
          
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
      
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  )
}

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </div>
  );
}

export default App;
