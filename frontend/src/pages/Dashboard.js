import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'

export default function Dashboard() {
  const { currentUser } = useAuth()
  const [stats, setStats] = useState({
    giftsSent: 0,
    giftsReceived: 0,
    totalEarnings: 0,
    totalSpent: 0
  })
  const [recentGifts, setRecentGifts] = useState([])
  const [loading, setLoading] = useState(true)

  const API_BASE = process.env.REACT_APP_BACKEND_URL + '/api'

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch recent gifts
      const [sentGifts, receivedGifts] = await Promise.all([
        axios.get(`${API_BASE}/gifts/sent`),
        axios.get(`${API_BASE}/gifts/received`)
      ])

      const sent = sentGifts.data.gifts || []
      const received = receivedGifts.data.gifts || []

      // Calculate stats
      const totalSpent = sent.reduce((sum, gift) => sum + gift.money_value, 0)
      const totalEarnings = received.reduce((sum, gift) => sum + gift.money_value, 0)

      setStats({
        giftsSent: sent.length,
        giftsReceived: received.length,
        totalEarnings,
        totalSpent
      })

      // Get recent gifts (last 5)
      const allGifts = [...sent, ...received]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5)
      
      setRecentGifts(allGifts)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
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
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {currentUser?.full_name}!
          </h1>
          <p className="text-gray-300 text-lg">
            {currentUser?.role === 'client' ? 'Ready to connect with amazing people?' : 'Your companions await!'}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-black bg-opacity-20 backdrop-blur-lg rounded-2xl p-6 border border-pink-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Credits</p>
                <p className="text-3xl font-bold text-white">{currentUser?.credits || 0}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">💎</span>
              </div>
            </div>
          </div>

          <div className="bg-black bg-opacity-20 backdrop-blur-lg rounded-2xl p-6 border border-pink-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">
                  {currentUser?.role === 'client' ? 'Gifts Sent' : 'Gifts Received'}
                </p>
                <p className="text-3xl font-bold text-white">
                  {currentUser?.role === 'client' ? stats.giftsSent : stats.giftsReceived}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">🎁</span>
              </div>
            </div>
          </div>

          <div className="bg-black bg-opacity-20 backdrop-blur-lg rounded-2xl p-6 border border-pink-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">
                  {currentUser?.role === 'client' ? 'Total Spent' : 'Total Earned'}
                </p>
                <p className="text-3xl font-bold text-white">
                  €{(currentUser?.role === 'client' ? stats.totalSpent : stats.totalEarnings).toFixed(2)}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">💰</span>
              </div>
            </div>
          </div>

          <div className="bg-black bg-opacity-20 backdrop-blur-lg rounded-2xl p-6 border border-pink-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Status</p>
                <p className="text-xl font-bold text-white">
                  {currentUser?.vip_status ? (
                    <span className="text-yellow-400">VIP Member</span>
                  ) : (
                    <span className="text-gray-300">Standard</span>
                  )}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">👑</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-black bg-opacity-20 backdrop-blur-lg rounded-2xl p-6 border border-pink-500/20">
          <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
          
          {recentGifts.length > 0 ? (
            <div className="space-y-4">
              {recentGifts.map((gift, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-white bg-opacity-5 rounded-lg border border-gray-700 hover:bg-opacity-10 transition-all duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-xl">{getGiftIcon(gift.gift_type)}</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {gift.sender_id === currentUser?.id ? 'Sent' : 'Received'} {getGiftName(gift.gift_type)}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {new Date(gift.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">€{gift.money_value.toFixed(2)}</p>
                    <p className="text-gray-400 text-sm">{gift.credits_cost} credits</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🎁</span>
              </div>
              <p className="text-gray-400 text-lg">No recent activity</p>
              <p className="text-gray-500 text-sm">
                {currentUser?.role === 'client' 
                  ? 'Start sending gifts to connect with companions!'
                  : 'Gifts from clients will appear here.'
                }
              </p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-black bg-opacity-20 backdrop-blur-lg rounded-2xl p-6 border border-pink-500/20 hover:bg-opacity-30 transition-all duration-200 cursor-pointer group">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <span className="text-white text-xl">👥</span>
              </div>
              <div>
                <h3 className="text-white font-bold">Browse Profiles</h3>
                <p className="text-gray-400 text-sm">Discover amazing people</p>
              </div>
            </div>
          </div>

          <div className="bg-black bg-opacity-20 backdrop-blur-lg rounded-2xl p-6 border border-pink-500/20 hover:bg-opacity-30 transition-all duration-200 cursor-pointer group">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <span className="text-white text-xl">💎</span>
              </div>
              <div>
                <h3 className="text-white font-bold">Buy Credits</h3>
                <p className="text-gray-400 text-sm">Get more credits to send gifts</p>
              </div>
            </div>
          </div>

          <div className="bg-black bg-opacity-20 backdrop-blur-lg rounded-2xl p-6 border border-pink-500/20 hover:bg-opacity-30 transition-all duration-200 cursor-pointer group">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <span className="text-white text-xl">🏆</span>
              </div>
              <div>
                <h3 className="text-white font-bold">View Rewards</h3>
                <p className="text-gray-400 text-sm">Check leaderboards & rewards</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
