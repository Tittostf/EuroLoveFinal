import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ProfileCard } from './FunctionalProfileCard';
import ApiService from '../services/api';

// Real MainContent Component with Database Integration
export const MainContent = ({ selectedCountry, selectedCity }) => {
  const { isAuthenticated } = useAuth();
  const [escorts, setEscorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getDisplayTitle = () => {
    if (selectedCity && selectedCountry) {
      return `Escorts in ${selectedCity}, ${selectedCountry}`;
    } else if (selectedCountry) {
      return `Escorts in ${selectedCountry}`;
    }
    return 'VIP Escorts';
  };

  const fetchEscorts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filters = {};
      if (selectedCity) filters.city = selectedCity;
      if (selectedCountry) filters.country = selectedCountry;
      
      const data = await ApiService.getEscorts(filters);
      setEscorts(data);
    } catch (error) {
      console.error('Failed to fetch escorts:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEscorts();
  }, [selectedCountry, selectedCity]);

  const handleProfileUpdate = () => {
    // Refresh escorts data when a profile is updated (repost, etc.)
    fetchEscorts();
  };

  return (
    <div className="flex-1 bg-gray-50">
      {/* Category Tabs */}
      <div className="bg-red-500 text-white px-6 py-3">
        <div className="flex space-x-8">
          <button className="bg-red-600 px-4 py-2 rounded font-semibold">{getDisplayTitle()}</button>
          <button className="hover:bg-red-600 px-4 py-2 rounded transition-colors">Sex Cams</button>
          <button className="hover:bg-red-600 px-4 py-2 rounded transition-colors">Meet & Fuck</button>
        </div>
      </div>

      {/* Profile Grid */}
      <div className="p-6">
        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading escorts...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <p className="text-red-600 text-lg font-semibold mb-2">Failed to load escorts</p>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={fetchEscorts}
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Escorts Grid */}
        {!loading && !error && (
          <>
            {/* Results Info */}
            <div className="mb-6">
              <p className="text-gray-600">
                {escorts.length} {escorts.length === 1 ? 'escort' : 'escorts'} found
                {selectedCity || selectedCountry ? ` in ${getDisplayTitle().replace('Escorts in ', '')}` : ''}
              </p>
            </div>

            {escorts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {escorts.map((escort) => (
                  <ProfileCard 
                    key={escort.id} 
                    profile={escort} 
                    onProfileUpdate={handleProfileUpdate}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No escorts found</h3>
                <p className="text-gray-600 mb-6">
                  {selectedCity || selectedCountry 
                    ? `No escorts available in ${getDisplayTitle().replace('Escorts in ', '')} at the moment.`
                    : 'No escorts are currently available. Please check back later.'
                  }
                </p>
                {(selectedCity || selectedCountry) && (
                  <button 
                    onClick={() => window.location.reload()}
                    className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    View All Escorts
                  </button>
                )}
              </div>
            )}
          </>
        )}

        {/* Authentication CTA */}
        {!isAuthenticated && escorts.length > 0 && (
          <div className="mt-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-4">Unlock Full Features</h3>
            <p className="text-lg mb-6">Register now to send gifts, repost ads, and join the leaderboards!</p>
            <div className="flex justify-center space-x-4">
              <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Register as Client
              </button>
              <button className="bg-yellow-400 text-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors">
                Register as Escort
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};