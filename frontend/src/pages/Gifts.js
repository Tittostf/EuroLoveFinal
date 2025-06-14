import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../components/Toast'
import axios from 'axios'

export default function Gifts() {
  const { currentUser } = useAuth()
  const { addToast } = useToast()
  const [activeTab, setActiveTab] = useState('received')
  const [sentGifts, setSentGifts] = useState([])
  const [receivedGifts, setReceivedGifts] = useState([])
  const [loading, setLoading] = useState(true)

  const API_BASE = process.env.REACT_APP_BACKEND_URL + '/api'

  useEffect(() => {
    fetchGifts()
  }, [])

  const fetchGifts = async () => {
    try {
      const [sentResponse, receivedResponse] = await Promise.all([
        axios.get(`${API_BASE}/gifts/sent`),
        axios.get(`${API_BASE}/gifts/received`)
      ])

      setSentGifts(sentResponse.data.gifts || [])
      setReceivedGifts(receivedResponse.data.gifts || [])
    } catch (error) {
      console.error('Error fetching gifts:', error)
      addToast('Error loading gifts', 'error')
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

  const getGiftName = (giftType) => {
    const names = {
      heart: 'Heart',
      rose: 'Rose',
      diamond: 'Diamond',
      crown: 'Crown',
      luxury_car: 'Luxury Car'
    }
    return names[giftType] || 'Gift'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading gifts...</div>
      </div>
    )
  }

  const currentGifts = activeTab === 'sent' ? sentGifts : receivedGifts
  const totalValue = currentGifts.reduce((sum, gift) => sum + gift.money_value, 0)

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">My Gifts</h1>
          <p className="text-gray-300 text-lg">
            Track your gift history and transactions
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-black bg-opacity-20 backdrop-blur-lg rounded-2xl p-6 border border-pink-500/20">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-xl">📤</span>
              </div>
              <p className="text-2xl font-bold text-white">{sentGifts.length}</p>
              <p className="text-gray-400">Gifts Sent</p>
            </div>
          </div>

          <div className="bg-black bg-opacity-20 backdrop-blur-lg rounded-2xl p-6 border border-pink-500/20">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-xl">📥</span>
              </div>
              <p className="text-2xl font-bold text-white">{receivedGifts.length}</p>
              <p className="text-gray-400">Gifts Received</p>
            </div>
          </div>

          <div className="bg-black bg-opacity-20 backdrop-blur-lg rounded-2xl p-6 border border-pink-500/20">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-xl">💰</span>
              </div>
              <p className="text-2xl font-bold text-white">€{totalValue.toFixed(2)}</p>
              <p className="text-gray-400">
                {activeTab === 'sent' ? 'Total Spent' : 'Total Earned'}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-black bg-opacity-20 backdrop-blur-lg rounded-2xl border border-pink-500/20 overflow-hidden">
          <div className="flex">
            <button
              onClick={() => setActiveTab('received')}
              className={`flex-1 py-4 px-6 font-medium transition-all duration-200 ${
                activeTab === 'received'
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Received Gifts ({receivedGifts.length})
            </button>
            <button
              onClick={() => setActiveTab('sent')}
              className={`flex-1 py-4 px-6 font-medium transition-all duration-200 ${
                activeTab === 'sent'
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Sent Gifts ({sentGifts.length})
            </button>
          </div>

          {/* Gift List */}
          <div className="p-6">
            {currentGifts.length > 0 ? (
              <div className="space-y-4">
                {currentGifts.map((gift) => (
                  <GiftCard
                    key={gift.id}
                    gift={gift}
                    type={activeTab}
                    currentUserId={currentUser?.id}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">🎁</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No gifts yet</h3>
                <p className="text-gray-400">
                  {activeTab === 'sent' 
                    ? 'Start sending gifts to connect with amazing people!'
                    : 'Gifts you receive will appear here.'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function GiftCard({ gift, type, currentUserId }) {
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

  const getGiftName = (giftType) => {
    const names = {
      heart: 'Heart',
      rose: 'Rose',
      diamond: 'Diamond',
      crown: 'Crown',
      luxury_car: 'Luxury Car'
    }
    return names[giftType] || 'Gift'
  }

  return (
    <div className="bg-white bg-opacity-5 rounded-lg p-4 border border-gray-700 hover:bg-opacity-10 transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-2xl">{getGiftIcon(gift.gift_type)}</span>
          </div>
          <div>
            <h3 className="text-white font-semibold">
              {type === 'sent' ? 'Sent' : 'Received'} {getGiftName(gift.gift_type)}
            </h3>
            <p className="text-gray-400 text-sm">
              {type === 'sent' ? `To: ${gift.receiver_id}` : `From: ${gift.sender_id}`}
            </p>
            <p className="text-gray-500 text-xs">
              {new Date(gift.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-white font-bold">€{gift.money_value.toFixed(2)}</p>
          <p className="text-gray-400 text-sm">{gift.credits_cost} credits</p>
        </div>
      </div>

      {gift.message && (
        <div className="mt-3 p-3 bg-white bg-opacity-5 rounded-lg border-l-4 border-pink-500">
          <p className="text-gray-300 text-sm italic">"{gift.message}"</p>
        </div>
      )}
    </div>
  )
}
