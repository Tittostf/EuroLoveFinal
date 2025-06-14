import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../components/Toast'
import axios from 'axios'

export default function Profiles() {
  const { currentUser } = useAuth()
  const { addToast } = useToast()
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedProfile, setSelectedProfile] = useState(null)
  const [showGiftModal, setShowGiftModal] = useState(false)

  const API_BASE = process.env.REACT_APP_BACKEND_URL + '/api'

  useEffect(() => {
    fetchProfiles()
  }, [])

  const fetchProfiles = async () => {
    try {
      // Fetch profiles of opposite role
      const targetRole = currentUser?.role === 'client' ? 'escort' : 'client'
      const response = await axios.get(`${API_BASE}/profiles?role=${targetRole}&limit=20`)
      setProfiles(response.data.profiles || [])
    } catch (error) {
      console.error('Error fetching profiles:', error)
      addToast('Error loading profiles', 'error')
    } finally {
      setLoading(false)
    }
  }

  const openGiftModal = (profile) => {
    setSelectedProfile(profile)
    setShowGiftModal(true)
  }

  const closeGiftModal = () => {
    setShowGiftModal(false)
    setSelectedProfile(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading profiles...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            {currentUser?.role === 'client' ? 'Browse Companions' : 'Browse Clients'}
          </h1>
          <p className="text-gray-300 text-lg">
            Discover amazing people and start connecting
          </p>
        </div>

        {/* Profiles Grid */}
        {profiles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {profiles.map((profile) => (
              <ProfileCard
                key={profile.id}
                profile={profile}
                currentUser={currentUser}
                onSendGift={() => openGiftModal(profile)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-4xl">👥</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">No Profiles Found</h2>
            <p className="text-gray-400 text-lg">
              Check back later for new profiles!
            </p>
          </div>
        )}

        {/* Gift Modal */}
        {showGiftModal && selectedProfile && (
          <GiftModal
            profile={selectedProfile}
            currentUser={currentUser}
            onClose={closeGiftModal}
            onGiftSent={() => {
              closeGiftModal()
              // Refresh current user data to update credits
              window.location.reload()
            }}
          />
        )}
      </div>
    </div>
  )
}

function ProfileCard({ profile, currentUser, onSendGift }) {
  const defaultAvatar = "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face"

  return (
    <div className="bg-black bg-opacity-20 backdrop-blur-lg rounded-2xl overflow-hidden border border-pink-500/20 hover:border-pink-500/40 transition-all duration-300 transform hover:scale-105 group">
      {/* Profile Image */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={profile.profile_image || defaultAvatar}
          alt={profile.full_name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* VIP Badge */}
        {profile.vip_status && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-3 py-1 rounded-full text-xs font-bold">
            VIP
          </div>
        )}
      </div>

      {/* Profile Info */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-white">{profile.full_name}</h3>
          <span className="text-pink-400 text-sm font-medium">{profile.age} years</span>
        </div>

        {profile.location && (
          <p className="text-gray-400 text-sm mb-3 flex items-center">
            <span className="mr-1">📍</span>
            {profile.location}
          </p>
        )}

        {profile.bio && (
          <p className="text-gray-300 text-sm mb-4 line-clamp-2">
            {profile.bio}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200">
            View Profile
          </button>
          
          {currentUser?.role === 'client' && (
            <button
              onClick={onSendGift}
              className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              Send Gift
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function GiftModal({ profile, currentUser, onClose, onGiftSent }) {
  const [selectedGift, setSelectedGift] = useState(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [giftTypes, setGiftTypes] = useState([])
  const { addToast } = useToast()

  const API_BASE = process.env.REACT_APP_BACKEND_URL + '/api'

  useEffect(() => {
    fetchGiftTypes()
  }, [])

  const fetchGiftTypes = async () => {
    try {
      const response = await axios.get(`${API_BASE}/gifts/types`)
      setGiftTypes(response.data.gift_types || [])
    } catch (error) {
      console.error('Error fetching gift types:', error)
    }
  }

  const handleSendGift = async () => {
    if (!selectedGift) {
      addToast('Please select a gift', 'warning')
      return
    }

    if (currentUser.credits < selectedGift.credits) {
      addToast('Insufficient credits', 'error')
      return
    }

    setLoading(true)
    try {
      await axios.post(`${API_BASE}/gifts/send`, {
        receiver_id: profile.id,
        gift_type: selectedGift.type,
        message
      })

      addToast('Gift sent successfully!', 'success')
      onGiftSent()
    } catch (error) {
      console.error('Error sending gift:', error)
      addToast(error.response?.data?.detail || 'Error sending gift', 'error')
    } finally {
      setLoading(false)
    }
  }

  const getGiftIcon = (giftType) => {
    const icons = {
      heart: '❤️',
      rose: '🌹',
      diamond: '💎',
      crown: '👑',
      luxury_car: '🚗'
    }
    return icons[giftType] || '🎁'
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-black bg-opacity-20 backdrop-blur-lg rounded-2xl p-6 border border-pink-500/20 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Send Gift to {profile.full_name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Gift Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Choose a Gift</h3>
          <div className="grid grid-cols-2 gap-3">
            {giftTypes.map((gift) => (
              <button
                key={gift.type}
                onClick={() => setSelectedGift(gift)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  selectedGift?.type === gift.type
                    ? 'border-pink-500 bg-pink-500/20'
                    : 'border-gray-600 bg-gray-600/20 hover:border-pink-400'
                }`}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">{getGiftIcon(gift.type)}</div>
                  <div className="text-white font-medium capitalize">
                    {gift.type.replace('_', ' ')}
                  </div>
                  <div className="text-sm text-gray-400">{gift.credits} credits</div>
                  <div className="text-sm text-pink-400">€{gift.value.toFixed(2)}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Message */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Personal Message (Optional)
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-4 py-3 bg-white bg-opacity-10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 resize-none"
            rows="3"
            placeholder="Write a sweet message..."
          />
        </div>

        {/* Current Credits */}
        <div className="mb-6 text-center">
          <p className="text-gray-400">Your current credits: <span className="text-white font-semibold">{currentUser.credits}</span></p>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSendGift}
            disabled={loading || !selectedGift}
            className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending...' : 'Send Gift'}
          </button>
        </div>
      </div>
    </div>
  )
}
