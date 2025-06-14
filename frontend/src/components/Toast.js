import React, { useState, useEffect } from 'react'

export function useToast() {
  const [toasts, setToasts] = useState([])

  const addToast = (message, type = 'info', duration = 4000) => {
    const id = Date.now()
    const newToast = { id, message, type, duration }
    
    setToasts(prev => [...prev, newToast])
    
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id))
    }, duration)
  }

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  return { toasts, addToast, removeToast }
}

export function ToastContainer({ toasts, removeToast }) {
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

  useEffect(() => {
    const timer = setTimeout(() => {
      handleRemove()
    }, toast.duration)

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
