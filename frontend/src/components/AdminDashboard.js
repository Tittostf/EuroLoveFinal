import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ApiService from '../services/api';

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!isAdmin) return;
      
      try {
        setLoading(true);
        const adminStats = await ApiService.getAdminStats();
        setStats(adminStats);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 border-b border-yellow-400/20 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                EUROLOVE Admin Dashboard
              </h1>
              <p className="text-gray-300 mt-2">Platform Management & Analytics</p>
            </div>
            <div className="text-right">
              <p className="text-white font-semibold">Welcome, {user?.username}</p>
              <p className="text-gray-400 text-sm">Administrator</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-lg border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="text-3xl text-green-500 mr-4">💰</div>
              <div>
                <p className="text-2xl font-bold text-gray-900">€{stats?.total_revenue?.toFixed(2) || '0.00'}</p>
                <p className="text-gray-600 text-sm">Total Revenue</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg border-l-4 border-purple-500">
            <div className="flex items-center">
              <div className="text-3xl text-purple-500 mr-4">🎁</div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats?.total_gifts || 0}</p>
                <p className="text-gray-600 text-sm">Total Gifts</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg border-l-4 border-yellow-500">
            <div className="flex items-center">
              <div className="text-3xl text-yellow-500 mr-4">🚀</div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats?.total_reposts || 0}</p>
                <p className="text-gray-600 text-sm">Total Reposts</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="text-3xl text-blue-500 mr-4">👥</div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats?.total_clients || 0}</p>
                <p className="text-gray-600 text-sm">Total Clients</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg border-l-4 border-pink-500">
            <div className="flex items-center">
              <div className="text-3xl text-pink-500 mr-4">💎</div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats?.total_escorts || 0}</p>
                <p className="text-gray-600 text-sm">Total Escorts</p>
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Clients */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
              <h2 className="text-xl font-bold text-white flex items-center">
                <span className="mr-3">👑</span>
                Top 10 Clients
              </h2>
              <p className="text-blue-100 mt-1">Ranked by total gift spending</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {stats?.top_clients?.map((client, index) => (
                  <div key={client.user_id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className={`font-bold text-lg w-8 text-center ${
                        index < 3 ? 'text-yellow-500' : 'text-gray-500'
                      }`}>
                        #{client.rank}
                      </span>
                      <div>
                        <p className="font-semibold text-gray-900">{client.username}</p>
                        <p className="text-sm text-gray-600">{client.points} points</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">€{client.total_spent?.toFixed(2) || '0.00'}</p>
                      <p className="text-xs text-gray-500">Total Spent</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Escorts */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-pink-500 to-pink-600 p-6">
              <h2 className="text-xl font-bold text-white flex items-center">
                <span className="mr-3">💎</span>
                Top 10 Escorts
              </h2>
              <p className="text-pink-100 mt-1">Ranked by points (gifts + reposts)</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {stats?.top_escorts?.map((escort, index) => (
                  <div key={escort.user_id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className={`font-bold text-lg w-8 text-center ${
                        index < 3 ? 'text-yellow-500' : 'text-gray-500'
                      }`}>
                        #{escort.rank}
                      </span>
                      <div>
                        <p className="font-semibold text-gray-900">{escort.name || escort.username}</p>
                        <p className="text-sm text-gray-600">{escort.points} points</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">€{escort.total_earned?.toFixed(2) || '0.00'}</p>
                      <p className="text-xs text-gray-500">Total Earned</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Breakdown */}
        <div className="mt-8 bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6">
            <h2 className="text-xl font-bold text-white flex items-center">
              <span className="mr-3">📊</span>
              Platform Performance
            </h2>
            <p className="text-green-100 mt-1">Revenue breakdown and key metrics</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🎁</span>
                </div>
                <h3 className="font-semibold text-gray-900">Gift Revenue</h3>
                <p className="text-2xl font-bold text-yellow-600">
                  €{((stats?.total_revenue || 0) * 0.6).toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">~60% of total revenue</p>
              </div>
              
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🚀</span>
                </div>
                <h3 className="font-semibold text-gray-900">Repost Revenue</h3>
                <p className="text-2xl font-bold text-blue-600">
                  €{((stats?.total_revenue || 0) * 0.4).toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">~40% of total revenue</p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">📈</span>
                </div>
                <h3 className="font-semibold text-gray-900">Growth Rate</h3>
                <p className="text-2xl font-bold text-green-600">+15%</p>
                <p className="text-sm text-gray-600">Monthly growth</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Data refreshes automatically every 30 seconds • Last updated: {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;