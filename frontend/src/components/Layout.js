import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Layout({ children }) {
  const { currentUser, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  if (!currentUser) {
    return <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900">{children}</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900">
      {/* Navigation Header */}
      <nav className="bg-black bg-opacity-20 backdrop-blur-lg border-b border-pink-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">EL</span>
              </div>
              <span className="text-white font-bold text-xl">EuroLove</span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/dashboard"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/dashboard')
                    ? 'text-pink-400 bg-pink-400/20'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/rewards"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/rewards')
                    ? 'text-pink-400 bg-pink-400/20'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                Rewards
              </Link>
              <Link
                to="/profiles"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/profiles')
                    ? 'text-pink-400 bg-pink-400/20'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                Browse
              </Link>
              <Link
                to="/gifts"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/gifts')
                    ? 'text-pink-400 bg-pink-400/20'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                My Gifts
              </Link>
              <Link
                to="/profile"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/profile')
                    ? 'text-pink-400 bg-pink-400/20'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                Profile
              </Link>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <span className="font-medium">{currentUser?.credits || 0} credits</span>
                {currentUser?.vip_status && (
                  <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-2 py-1 rounded-full text-xs font-bold">
                    VIP
                  </span>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="min-h-screen">
        {children}
      </main>
    </div>
  )
}
