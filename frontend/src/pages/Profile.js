import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../components/Toast'
import { loadStripe } from '@stripe/stripe-js'
import axios from 'axios'

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY)

export default function Profile() {
  const { currentUser, updateProfile } = useAuth()
  const { addToast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    full_name: currentUser?.full_name || '',
    bio: currentUser?.bio || '',
    location: currentUser?.location || '',
    age: currentUser?.age || '',
    profile_image: currentUser?.profile_image || ''
  })

  const API_BASE = process.env.REACT_APP_BACKEND_URL + '/api'

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const updateData = {
        ...formData,
        age: parseInt(formData.age)
      }
      
      const result = await updateProfile(updateData)
      if (result.success) {
        addToast('Profile updated successfully!', 'success')
        setIsEditing(false)
      } else {
        addToast(result.error, 'error')
      }
    } catch (error) {
      addToast('Error updating profile', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleBuyCredits = async (packageId) => {
    try {
      const stripe = await stripePromise
      const response = await axios.post(`${API_BASE}/payments/checkout/session`, {
        product_type: 'credits',
        package_id: packageId,
        success_url: `${window.location.origin}/payment/success`,
        cancel_url: `${window.location.origin}/payment/cancel`
      })

      const { error } = await stripe.redirectToCheckout({
        sessionId: response.data.session_id
      })

      if (error) {
        addToast('Payment error: ' + error.message, 'error')
      }
    } catch (error) {
      console.error('Payment error:', error)
      addToast('Error initiating payment', 'error')
    }
  }

  const handleBuyVIP = async (packageId) => {
    try {
      const stripe = await stripePromise
      const response = await axios.post(`${API_BASE}/payments/checkout/session`, {
        product_type: 'vip',
        package_id: packageId,
        success_url: `${window.location.origin}/payment/success`,
        cancel_url: `${window.location.origin}/payment/cancel`
      })

      const { error } = await stripe.redirectToCheckout({
        sessionId: response.data.session_id
      })

      if (error) {
        addToast('Payment error: ' + error.message, 'error')
      }
    } catch (error) {
      console.error('Payment error:', error)
      addToast('Error initiating payment', 'error')
    }
  }

  const defaultAvatar = "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face"

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">My Profile</h1>
          <p className="text-gray-300 text-lg">
            Manage your account and settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2">
            <div className="bg-black bg-opacity-20 backdrop-blur-lg rounded-2xl p-6 border border-pink-500/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Profile Information</h2>
                <button
                  onClick={() => {
                    if (isEditing) {
                      setFormData({
                        full_name: currentUser?.full_name || '',
                        bio: currentUser?.bio || '',
                        location: currentUser?.location || '',
                        age: currentUser?.age || '',
                        profile_image: currentUser?.profile_image || ''
                      })
                    }
                    setIsEditing(!isEditing)
                  }}
                  className="text-pink-400 hover:text-pink-300 font-medium transition-colors"
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white bg-opacity-10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Age
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white bg-opacity-10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white bg-opacity-10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows="4"
                      className="w-full px-4 py-3 bg-white bg-opacity-10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Profile Image URL
                    </label>
                    <input
                      type="url"
                      name="profile_image"
                      value={formData.profile_image}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white bg-opacity-10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50"
                  >
                    {loading ? 'Updating...' : 'Update Profile'}
                  </button>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center space-x-6">
                    <img
                      src={currentUser?.profile_image || defaultAvatar}
                      alt={currentUser?.full_name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-pink-500"
                    />
                    <div>
                      <h3 className="text-2xl font-bold text-white">{currentUser?.full_name}</h3>
                      <p className="text-gray-300">{currentUser?.email}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-pink-400 font-medium capitalize">{currentUser?.role}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-400">{currentUser?.age} years old</span>
                        {currentUser?.vip_status && (
                          <>
                            <span className="text-gray-400">•</span>
                            <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-2 py-1 rounded-full text-xs font-bold">
                              VIP
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {currentUser?.location && (
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">Location</h4>
                      <p className="text-gray-300">{currentUser.location}</p>
                    </div>
                  )}

                  {currentUser?.bio && (
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">About Me</h4>
                      <p className="text-gray-300">{currentUser.bio}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Account Stats & Actions */}
          <div className="space-y-6">
            {/* Account Stats */}
            <div className="bg-black bg-opacity-20 backdrop-blur-lg rounded-2xl p-6 border border-pink-500/20">
              <h3 className="text-xl font-bold text-white mb-4">Account Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Credits</span>
                  <span className="text-white font-bold">{currentUser?.credits || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Earnings</span>
                  <span className="text-green-400 font-bold">€{(currentUser?.earnings || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Member Since</span>
                  <span className="text-white">
                    {new Date(currentUser?.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Buy Credits */}
            <div className="bg-black bg-opacity-20 backdrop-blur-lg rounded-2xl p-6 border border-pink-500/20">
              <h3 className="text-xl font-bold text-white mb-4">Buy Credits</h3>
              <div className="space-y-3">
                <button
                  onClick={() => handleBuyCredits('starter')}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-3 rounded-lg transition-all duration-200"
                >
                  <div className="flex justify-between items-center">
                    <span>Starter Pack</span>
                    <span>100 credits - €5</span>
                  </div>
                </button>
                <button
                  onClick={() => handleBuyCredits('popular')}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white p-3 rounded-lg transition-all duration-200"
                >
                  <div className="flex justify-between items-center">
                    <span>Popular Pack</span>
                    <span>500 credits - €20</span>
                  </div>
                </button>
                <button
                  onClick={() => handleBuyCredits('premium')}
                  className="w-full bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white p-3 rounded-lg transition-all duration-200"
                >
                  <div className="flex justify-between items-center">
                    <span>Premium Pack</span>
                    <span>1000 credits - €35</span>
                  </div>
                </button>
              </div>
            </div>

            {/* VIP Subscription */}
            <div className="bg-black bg-opacity-20 backdrop-blur-lg rounded-2xl p-6 border border-pink-500/20">
              <h3 className="text-xl font-bold text-white mb-4">VIP Membership</h3>
              {currentUser?.vip_status ? (
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-black text-2xl">👑</span>
                  </div>
                  <p className="text-yellow-400 font-bold mb-2">VIP Active</p>
                  <p className="text-gray-400 text-sm">
                    Expires: {new Date(currentUser.vip_expires_at).toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={() => handleBuyVIP('monthly')}
                    className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white p-3 rounded-lg transition-all duration-200"
                  >
                    <div className="flex justify-between items-center">
                      <span>Monthly VIP</span>
                      <span>€9.99</span>
                    </div>
                  </button>
                  <button
                    onClick={() => handleBuyVIP('yearly')}
                    className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white p-3 rounded-lg transition-all duration-200"
                  >
                    <div className="flex justify-between items-center">
                      <span>Yearly VIP</span>
                      <span>€99.99 (Save 17%)</span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
