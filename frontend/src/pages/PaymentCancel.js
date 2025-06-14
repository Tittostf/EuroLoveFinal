import React from 'react'
import { Link } from 'react-router-dom'

export default function PaymentCancel() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-black bg-opacity-20 backdrop-blur-lg rounded-2xl p-8 border border-red-500/20 text-center">
          {/* Cancel Icon */}
          <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-white text-4xl">✕</span>
          </div>

          <h1 className="text-3xl font-bold text-white mb-4">Payment Cancelled</h1>
          
          <p className="text-gray-300 text-lg mb-8">
            Your payment was cancelled. No charges have been made to your account.
          </p>

          <div className="space-y-4">
            <Link
              to="/profile"
              className="block w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              Try Again
            </Link>
            
            <Link
              to="/dashboard"
              className="block w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200"
            >
              Back to Dashboard
            </Link>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              You can always purchase credits or VIP membership later from your profile.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
