import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function PaymentSuccess() {
  const { getCurrentUser } = useAuth()

  useEffect(() => {
    // Refresh user data to show updated credits/VIP status
    const refreshUserData = async () => {
      await getCurrentUser()
    }
    
    const timer = setTimeout(refreshUserData, 2000)
    return () => clearTimeout(timer)
  }, [getCurrentUser])

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-black bg-opacity-20 backdrop-blur-lg rounded-2xl p-8 border border-green-500/20 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-white text-4xl">✓</span>
          </div>

          <h1 className="text-3xl font-bold text-white mb-4">Payment Successful!</h1>
          
          <p className="text-gray-300 text-lg mb-8">
            Your payment has been processed successfully. Your account has been updated with your purchase.
          </p>

          <div className="space-y-4">
            <Link
              to="/dashboard"
              className="block w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              Go to Dashboard
            </Link>
            
            <Link
              to="/profile"
              className="block w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200"
            >
              View Profile
            </Link>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Thank you for your purchase! 🎉
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
