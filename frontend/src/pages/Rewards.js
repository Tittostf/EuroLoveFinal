import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../components/Toast'
import axios from 'axios'

export default function Rewards() {
  const { currentUser } = useAuth()
  const { addToast } = useToast()
  const [rewardPools, setRewardPools] = useState(null)
  const [clientLeaderboard, setClientLeaderboard] = useState([])
  const [escortLeaderboard, setEscortLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)

  const API_BASE = process.env.REACT_APP_BACKEND_URL + '/api'

  useEffect(() => {
    fetchRewardsData()
  }, [])

  const fetchRewardsData = async () => {
    try {
      const [poolsResponse, clientsResponse, escortsResponse] = await Promise.all([
        axios.get(`${API_BASE}/rewards/pools`),
        axios.get(`${API_BASE}/rewards/client-leaderboard`),
        axios.get(`${API_BASE}/rewards/escort-leaderboard`)
      ])

      setRewardPools(poolsResponse.data)
      setClientLeaderboard(clientsResponse.data.leaderboard || [])
      setEscortLeaderboard(escortsResponse.data.leaderboard || [])
    } catch (error) {
      console.error('Error fetching rewards data:', error)
      addToast('Error loading rewards data', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading rewards...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Premium Rewards Program
          </h1>
          <p className="text-gray-300 text-lg">
            Compete for monthly rewards and earn real money!
          </p>
        </div>

        {/* Reward Pools */}
        {rewardPools && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-black bg-opacity-20 backdrop-blur-lg rounded-2xl p-6 border border-pink-500/20">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">👑</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Client Rewards</h3>
                <p className="text-3xl font-bold text-blue-400">€{rewardPools.client_reward_pool}</p>
                <p className="text-gray-400 text-sm">Monthly pool for top 10 clients</p>
              </div>
            </div>

            <div className="bg-black bg-opacity-20 backdrop-blur-lg rounded-2xl p-6 border border-pink-500/20">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">💎</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Escort Rewards</h3>
                <p className="text-3xl font-bold text-pink-400">€{rewardPools.escort_reward_pool}</p>
                <p className="text-gray-400 text-sm">Monthly pool for top 5 escorts</p>
              </div>
            </div>

            <div className="bg-black bg-opacity-20 backdrop-blur-lg rounded-2xl p-6 border border-pink-500/20">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">🏆</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Total Rewards</h3>
                <p className="text-3xl font-bold text-yellow-400">€{rewardPools.total_rewards}</p>
                <p className="text-gray-400 text-sm">Combined monthly rewards</p>
              </div>
            </div>
          </div>
        )}

        {/* Leaderboards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Client Leaderboard */}
          <div className="bg-black bg-opacity-20 backdrop-blur-lg rounded-2xl p-6 border border-pink-500/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Top Clients</h2>
              <div className="text-blue-400 font-medium">50% Gift Cashback + 20% Sub Revenue</div>
            </div>

            <div className="space-y-4">
              {clientLeaderboard.map((entry, index) => (
                <LeaderboardEntry
                  key={entry.user.id}
                  rank={entry.rank}
                  user={entry.user}
                  reward={entry.estimated_reward}
                  isCurrentUser={entry.user.id === currentUser?.id}
                  rankColor={index < 3 ? ['text-yellow-400', 'text-gray-300', 'text-orange-400'][index] : 'text-gray-500'}
                />
              ))}
            </div>
          </div>

          {/* Escort Leaderboard */}
          <div className="bg-black bg-opacity-20 backdrop-blur-lg rounded-2xl p-6 border border-pink-500/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Top Escorts</h2>
              <div className="text-pink-400 font-medium">50% Gift Earnings + 30% Repost Revenue</div>
            </div>

            <div className="space-y-4">
              {escortLeaderboard.map((entry, index) => (
                <LeaderboardEntry
                  key={entry.user.id}
                  rank={entry.rank}
                  user={entry.user}
                  reward={entry.estimated_reward}
                  isCurrentUser={entry.user.id === currentUser?.id}
                  rankColor={index < 3 ? ['text-yellow-400', 'text-gray-300', 'text-orange-400'][index] : 'text-gray-500'}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Rewards Info */}
        <div className="mt-8 bg-black bg-opacity-20 backdrop-blur-lg rounded-2xl p-6 border border-pink-500/20">
          <h3 className="text-xl font-bold text-white mb-4">How Rewards Work</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-blue-400 mb-2">Client Rewards</h4>
              <ul className="text-gray-300 space-y-2">
                <li>• Top 10 clients by gift spending get monthly rewards</li>
                <li>• 50% cashback on all gifts sent</li>
                <li>• 20% revenue share from VIP subscriptions</li>
                <li>• Higher ranking = higher reward percentage</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-pink-400 mb-2">Escort Rewards</h4>
              <ul className="text-gray-300 space-y-2">
                <li>• Top 5 escorts by gift earnings get monthly rewards</li>
                <li>• 50% of gift earnings go to rewards pool</li>
                <li>• 30% revenue share from repost engagement</li>
                <li>• Elite rankings yield premium rewards</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function LeaderboardEntry({ rank, user, reward, isCurrentUser, rankColor }) {
  const defaultAvatar = "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"

  return (
    <div className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${
      isCurrentUser 
        ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-pink-500' 
        : 'bg-white bg-opacity-5 border-gray-700 hover:bg-opacity-10'
    }`}>
      <div className="flex items-center space-x-4">
        <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${rankColor}`}>
          #{rank}
        </div>
        <img
          src={user.profile_image || defaultAvatar}
          alt={user.full_name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <p className="text-white font-medium">
            {user.full_name}
            {isCurrentUser && <span className="text-pink-400 ml-2">(You)</span>}
          </p>
          <p className="text-gray-400 text-sm">
            {user.role === 'client' ? `${user.credits} credits` : `€${user.earnings} earned`}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-green-400 font-bold">€{reward}</p>
        <p className="text-gray-400 text-sm">Monthly reward</p>
      </div>
    </div>
  )
}
