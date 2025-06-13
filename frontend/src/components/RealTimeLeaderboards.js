import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ApiService from '../services/api';

// Real-time Escort Leaderboard Component
export const MonthlyRewardsSection = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await ApiService.getEscortLeaderboard();
        setLeaderboard(data);
      } catch (error) {
        console.error('Failed to fetch escort leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(interval);
  }, []);

  const getCashbackPercentage = (rank) => {
    if (rank === 1) return '7%';
    if (rank === 2) return '2%';
    if (rank === 3) return '1%';
    return '0%';
  };

  const getEarnings = (points, rank) => {
    const percentage = rank === 1 ? 0.07 : rank === 2 ? 0.02 : rank === 3 ? 0.01 : 0;
    return (points * percentage).toFixed(2);
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 py-20 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-400/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-xl">
              <span className="text-black font-bold text-2xl">💎</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent tracking-tight">
              EUROLOVE Monthly Rewards Program
            </h2>
          </div>
          <p className="text-2xl md:text-3xl text-yellow-400 font-bold mb-4 tracking-wide">
            Earn Every Month!
          </p>
          <p className="text-white text-lg md:text-xl max-w-5xl mx-auto leading-relaxed">
            Turn your activity on EUROLOVE into real cash with our Official Monthly Rewards Program.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
          {/* How it works */}
          <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur rounded-2xl p-8 border border-yellow-400/20 shadow-2xl">
            <h3 className="text-2xl md:text-3xl font-bold text-yellow-400 mb-8 flex items-center space-x-3">
              <span>⚡</span>
              <span>How it works:</span>
            </h3>
            <div className="space-y-6">
              <div className="flex items-start space-x-4 p-4 bg-gray-700/30 rounded-xl border border-green-400/20">
                <span className="text-green-400 font-bold text-xl">✅</span>
                <p className="text-white text-lg">
                  <span className="font-bold text-yellow-400">Activate your account monthly</span> (€25 activation)
                </p>
              </div>
              <div className="flex items-start space-x-4 p-4 bg-gray-700/30 rounded-xl border border-green-400/20">
                <span className="text-green-400 font-bold text-xl">✅</span>
                <p className="text-white text-lg">
                  <span className="font-bold text-yellow-400">Top up at least €5</span> in reposting credits
                </p>
              </div>
              <div className="flex items-start space-x-4 p-4 bg-gray-700/30 rounded-xl border border-green-400/20">
                <span className="text-green-400 font-bold text-xl">✅</span>
                <p className="text-white text-lg">
                  <span className="font-bold text-yellow-400">Compete for the Top 3</span> every month
                </p>
              </div>
            </div>

            {/* Prizes */}
            <div className="mt-10 space-y-4">
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-xl p-6 flex items-center space-x-6 shadow-lg">
                <span className="text-4xl">🥇</span>
                <div>
                  <p className="text-black font-bold text-xl">1st Place</p>
                  <p className="text-black font-bold text-lg">7% CASH-BACK on total invested</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-gray-300 to-gray-200 rounded-xl p-6 flex items-center space-x-6 shadow-lg">
                <span className="text-4xl">🥈</span>
                <div>
                  <p className="text-black font-bold text-xl">2nd Place</p>
                  <p className="text-black font-bold text-lg">2% CASH-BACK</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-amber-500 to-amber-400 rounded-xl p-6 flex items-center space-x-6 shadow-lg">
                <span className="text-4xl">🥉</span>
                <div>
                  <p className="text-black font-bold text-xl">3rd Place</p>
                  <p className="text-black font-bold text-lg">1% CASH-BACK</p>
                </div>
              </div>
            </div>
          </div>

          {/* Live Leaderboard */}
          <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur rounded-2xl p-8 border border-yellow-400/20 shadow-2xl">
            <h3 className="text-2xl md:text-3xl font-bold text-yellow-400 mb-8 flex items-center space-x-3">
              <span>🏆</span>
              <span>Live Leaderboard - ESCORTS</span>
            </h3>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-white">Loading leaderboard...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {leaderboard.map((user) => (
                  <div 
                    key={user.user_id}
                    className={`flex items-center justify-between p-4 rounded-xl transition-all hover:scale-105 ${
                      user.rank <= 3 
                        ? 'bg-gradient-to-r from-yellow-600/20 to-yellow-400/20 border-2 border-yellow-400/40 shadow-lg' 
                        : 'bg-gray-700/40 border border-gray-600/30'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <span className={`font-bold text-xl w-8 text-center ${
                        user.rank === 1 ? 'text-yellow-400' : 
                        user.rank === 2 ? 'text-gray-300' : 
                        user.rank === 3 ? 'text-amber-500' : 'text-gray-400'
                      }`}>
                        #{user.rank}
                      </span>
                      <div>
                        <p className="text-white font-bold text-lg">{user.name || user.username}</p>
                        <p className="text-gray-400 text-sm">{typeof user.points === 'number' ? user.points : 0} points • €{user.total_earned?.toFixed(2) || '0.00'} earned</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold text-lg ${user.rank <= 3 ? 'text-green-400' : 'text-gray-400'}`}>
                        €{getEarnings(user.points, user.rank)}
                      </p>
                      <p className={`text-sm font-medium ${user.rank <= 3 ? 'text-yellow-400' : 'text-gray-500'}`}>
                        {getCashbackPercentage(user.rank)}
                      </p>
                    </div>
                  </div>
                ))}
                
                {leaderboard.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No escorts in leaderboard yet</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Real-time Client Leaderboard Component
export const TopDonatorsRewardsSection = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await ApiService.getClientLeaderboard();
        setLeaderboard(data);
      } catch (error) {
        console.error('Failed to fetch client leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(interval);
  }, []);

  const getRewardPercentage = (rank) => {
    const percentages = { 1: 20, 2: 15, 3: 10, 4: 8, 5: 7, 6: 5, 7: 4, 8: 3, 9: 2, 10: 1 };
    return percentages[rank] || 0;
  };

  return (
    <div className="bg-gradient-to-br from-purple-900 via-black to-blue-900 py-20 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-purple-400/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center shadow-xl">
              <span className="text-white font-bold text-2xl">🏆</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent tracking-tight">
              Top Donators Rewards Program
            </h2>
          </div>
          <p className="text-2xl md:text-3xl text-purple-300 font-bold mb-4 tracking-wide">
            Loyalty Program for Premium Clients
          </p>
          <p className="text-white text-lg md:text-xl max-w-5xl mx-auto leading-relaxed mb-6">
            Every month, 50% of platform's total Gift revenue goes to our Top 10 Clients as rewards!
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-16">
          {/* Live Leaderboard */}
          <div className="xl:col-span-2 bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur rounded-2xl p-8 border border-purple-400/20 shadow-2xl">
            <h3 className="text-2xl md:text-3xl font-bold text-purple-400 flex items-center space-x-3 mb-8">
              <span>👑</span>
              <span>Top 10 Clients - LEADERBOARD</span>
            </h3>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-white">Loading leaderboard...</p>
              </div>
            ) : (
              <div className="space-y-3">
                {leaderboard.slice(0, 10).map((client) => (
                  <div 
                    key={client.user_id}
                    className={`flex items-center justify-between p-4 rounded-xl transition-all hover:scale-105 ${
                      client.rank <= 3 
                        ? 'bg-gradient-to-r from-yellow-600/20 to-purple-600/20 border-2 border-yellow-400/40 shadow-lg' 
                        : 'bg-gray-700/40 border border-gray-600/30'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <span className={`font-bold text-xl w-8 text-center ${
                          client.rank === 1 ? 'text-yellow-400' : 
                          client.rank === 2 ? 'text-gray-300' : 
                          client.rank === 3 ? 'text-amber-500' : 'text-gray-400'
                        }`}>
                          #{client.rank}
                        </span>
                        <span className="text-2xl">
                          {client.rank === 1 ? '👑' : client.rank === 2 ? '💎' : client.rank === 3 ? '🥇' : '👤'}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-bold text-lg">{client.username}</p>
                        <p className="text-gray-400 text-sm">{typeof client.points === 'number' ? client.points : 0} points • €{client.total_spent?.toFixed(2) || '0.00'} spent</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold text-lg ${client.rank <= 10 ? 'text-green-400' : 'text-gray-400'}`}>
                        €{((client.total_spent || 0) * getRewardPercentage(client.rank) / 100).toFixed(2)}
                      </p>
                      <p className={`text-sm font-medium ${client.rank <= 10 ? 'text-purple-400' : 'text-gray-500'}`}>
                        {getRewardPercentage(client.rank)}% rewards pool
                      </p>
                    </div>
                  </div>
                ))}
                
                {leaderboard.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No clients in leaderboard yet</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Reward Distribution */}
          <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur rounded-2xl p-8 border border-purple-400/20 shadow-2xl">
            <h3 className="text-2xl font-bold text-purple-400 mb-8 flex items-center space-x-3">
              <span>💰</span>
              <span>Reward Distribution</span>
            </h3>
            
            <div className="mb-8">
              <div className="bg-purple-500/20 backdrop-blur rounded-xl p-6 border border-purple-400/30">
                <h4 className="text-lg font-bold text-white mb-2">Monthly Rewards Pool</h4>
                <p className="text-3xl font-bold text-yellow-400">50%</p>
                <p className="text-purple-300 text-sm">of Gift Revenue</p>
              </div>
            </div>

            <div className="space-y-3">
              {[1,2,3,4,5,6,7,8,9,10].map((rank) => (
                <div 
                  key={rank}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    rank <= 3 
                      ? 'bg-gradient-to-r from-yellow-600/20 to-purple-600/20 border border-yellow-400/30' 
                      : 'bg-gray-700/30'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className={`font-bold text-lg ${
                      rank === 1 ? 'text-yellow-400' : 
                      rank === 2 ? 'text-gray-300' : 
                      rank === 3 ? 'text-amber-500' : 'text-gray-400'
                    }`}>
                      #{rank}
                    </span>
                  </div>
                  <span className={`font-bold text-lg ${rank <= 3 ? 'text-green-400' : 'text-gray-400'}`}>
                    {getRewardPercentage(rank)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};