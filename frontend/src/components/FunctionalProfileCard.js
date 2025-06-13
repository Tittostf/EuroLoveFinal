import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ApiService from '../services/api';

// Enhanced Gift Catalog with more gift options
const GIFT_CATALOG = [
  { id: 1, name: 'Rose', value: 5, emoji: '🌹', description: 'A beautiful rose', category: 'basic' },
  { id: 2, name: 'Kiss', value: 10, emoji: '💋', description: 'A sweet kiss', category: 'basic' },
  { id: 3, name: 'Coffee', value: 15, emoji: '☕', description: 'Morning coffee', category: 'basic' },
  { id: 4, name: 'Heart', value: 25, emoji: '❤️', description: 'Show your love', category: 'premium' },
  { id: 5, name: 'Chocolate', value: 35, emoji: '🍫', description: 'Sweet chocolate', category: 'premium' },
  { id: 6, name: 'Diamond', value: 50, emoji: '💎', description: 'Precious diamond', category: 'premium' },
  { id: 7, name: 'Perfume', value: 75, emoji: '💐', description: 'Luxury perfume', category: 'luxury' },
  { id: 8, name: 'Champagne', value: 100, emoji: '🍾', description: 'Celebrate together', category: 'luxury' },
  { id: 9, name: 'Jewelry', value: 150, emoji: '💍', description: 'Beautiful jewelry', category: 'luxury' },
  { id: 10, name: 'Crown', value: 250, emoji: '👑', description: 'Royal treatment', category: 'vip' },
  { id: 11, name: 'Yacht', value: 500, emoji: '🛥️', description: 'Luxury experience', category: 'vip' },
  { id: 12, name: 'Gold Bar', value: 1000, emoji: '🏅', description: 'Ultimate gift', category: 'vip' }
];

// Credits Top-up Modal
export const CreditsModal = ({ isOpen, onClose, onCreditsAdded }) => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(null);

  const creditPackages = [
    { amount: 50, bonus: 0, popular: false },
    { amount: 100, bonus: 10, popular: false },
    { amount: 250, bonus: 35, popular: true },
    { amount: 500, bonus: 100, popular: false },
    { amount: 1000, bonus: 250, popular: false }
  ];

  const handleTopUp = async () => {
    if (!selectedAmount) return;

    try {
      setLoading(true);
      const response = await ApiService.request('/add-credits', {
        method: 'POST',
        body: JSON.stringify(selectedAmount.amount + selectedAmount.bonus)
      });

      updateUser({ credits: response.new_balance });
      onCreditsAdded && onCreditsAdded(response.new_balance);
      alert(`€${(selectedAmount.amount + selectedAmount.bonus).toFixed(2)} credits added successfully!`);
      onClose();
    } catch (error) {
      alert(`Failed to add credits: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Top Up Credits</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <span className="text-2xl">×</span>
            </button>
          </div>

          <div className="mb-4">
            <p className="text-gray-600 mb-2">Current Balance: €{user?.credits?.toFixed(2) || '0.00'}</p>
          </div>

          <div className="space-y-3 mb-6">
            {creditPackages.map((pkg, index) => (
              <div
                key={index}
                onClick={() => setSelectedAmount(pkg)}
                className={`p-4 border rounded-lg cursor-pointer transition-all relative ${
                  selectedAmount === pkg
                    ? 'border-yellow-500 bg-yellow-50'
                    : 'border-gray-200 hover:border-yellow-300'
                } ${pkg.popular ? 'border-2 border-green-500' : ''}`}
              >
                {pkg.popular && (
                  <div className="absolute -top-2 left-4 bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">
                    POPULAR
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-900">€{pkg.amount}</p>
                    {pkg.bonus > 0 && (
                      <p className="text-sm text-green-600">+€{pkg.bonus} bonus</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-yellow-600">
                      €{(pkg.amount + pkg.bonus).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">Total Credits</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleTopUp}
              disabled={!selectedAmount || loading}
              className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Processing...' : 'Purchase Credits'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Gift Modal with categories
export const GiftModal = ({ isOpen, onClose, escort, onGiftSent }) => {
  const { user, updateUser } = useAuth();
  const [selectedGift, setSelectedGift] = useState(null);
  const [sending, setSending] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showCreditsModal, setShowCreditsModal] = useState(false);

  const categories = [
    { id: 'all', name: 'All Gifts', icon: '🎁' },
    { id: 'basic', name: 'Basic', icon: '🌸' },
    { id: 'premium', name: 'Premium', icon: '💖' },
    { id: 'luxury', name: 'Luxury', icon: '💎' },
    { id: 'vip', name: 'VIP', icon: '👑' }
  ];

  const filteredGifts = activeCategory === 'all' 
    ? GIFT_CATALOG 
    : GIFT_CATALOG.filter(gift => gift.category === activeCategory);

  const handleSendGift = async () => {
    if (!selectedGift || !user) return;

    if (user.credits < selectedGift.value) {
      alert('Insufficient credits! Please top up your account.');
      setShowCreditsModal(true);
      return;
    }

    try {
      setSending(true);
      const response = await ApiService.sendGift({
        recipient_id: escort.id,
        gift_name: selectedGift.name,
        gift_value: selectedGift.value
      });

      // Update user credits in context
      updateUser({ credits: response.remaining_credits });

      // Show success and close modal
      alert(`${selectedGift.name} sent successfully to ${escort.name || escort.username}! 🎉`);
      onGiftSent && onGiftSent();
      onClose();
    } catch (error) {
      alert(`Failed to send gift: ${error.message}`);
    } finally {
      setSending(false);
    }
  };

  const handleCreditsAdded = (newBalance) => {
    setShowCreditsModal(false);
    // User can now proceed with gift
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Send Gift to {escort.name || escort.username}</h2>
                <p className="text-gray-600">Show your appreciation with a special gift</p>
              </div>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <span className="text-2xl">×</span>
              </button>
            </div>

            <div className="mb-6 flex justify-between items-center">
              <p className="text-gray-600">Your Credits: €{user?.credits?.toFixed(2) || '0.00'}</p>
              <button 
                onClick={() => setShowCreditsModal(true)}
                className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
              >
                Top Up Credits
              </button>
            </div>

            {/* Category Tabs */}
            <div className="flex space-x-2 mb-6 overflow-x-auto">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap flex items-center space-x-2 transition-colors ${
                    activeCategory === category.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span>{category.icon}</span>
                  <span className="text-sm font-medium">{category.name}</span>
                </button>
              ))}
            </div>

            {/* Gift Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 max-h-96 overflow-y-auto">
              {filteredGifts.map((gift) => (
                <div
                  key={gift.id}
                  onClick={() => setSelectedGift(gift)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedGift?.id === gift.id
                      ? 'border-purple-500 bg-purple-50 transform scale-105'
                      : 'border-gray-200 hover:border-purple-300 hover:shadow-md'
                  } ${user?.credits < gift.value ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-2">{gift.emoji}</div>
                    <div className="font-semibold text-gray-900">{gift.name}</div>
                    <div className="text-purple-600 font-bold text-lg">€{gift.value}</div>
                    <div className="text-xs text-gray-500 mt-1">{gift.description}</div>
                    {user?.credits < gift.value && (
                      <div className="text-xs text-red-500 mt-1">Insufficient credits</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {selectedGift && (
              <div className="bg-purple-50 p-4 rounded-lg mb-6">
                <h3 className="font-semibold text-purple-800 mb-2">Gift Summary:</h3>
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-2xl">{selectedGift.emoji}</span>
                  <div>
                    <p className="font-medium text-purple-700">{selectedGift.name} - €{selectedGift.value}</p>
                    <p className="text-sm text-purple-600">{selectedGift.description}</p>
                  </div>
                </div>
                <div className="text-xs text-purple-500 bg-purple-100 p-2 rounded">
                  <p><strong>Revenue Split:</strong></p>
                  <p>• Platform fee: €{(selectedGift.value * 0.3).toFixed(2)} (30%)</p>
                  <p>• {escort.name || escort.username} receives: €{(selectedGift.value * 0.7).toFixed(2)} (70%)</p>
                </div>
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSendGift}
                disabled={!selectedGift || sending || (user?.credits < selectedGift?.value)}
                className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center font-medium"
              >
                {sending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Sending Gift...
                  </>
                ) : (
                  `Send ${selectedGift ? `${selectedGift.name} (€${selectedGift.value})` : 'Gift'}`
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Credits Top-up Modal */}
      <CreditsModal
        isOpen={showCreditsModal}
        onClose={() => setShowCreditsModal(false)}
        onCreditsAdded={handleCreditsAdded}
      />
    </>
  );
};

// Real ProfileCard Component with functional Gift and Repost
export const ProfileCard = ({ profile, onProfileUpdate }) => {
  const { user, isAuthenticated, isClient, isEscort, updateUser } = useAuth();
  const [isReposting, setIsReposting] = useState(false);
  const [showRepostSuccess, setShowRepostSuccess] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [repostCount, setRepostCount] = useState(profile.repost_count || 0);

  const handleRepost = async () => {
    if (!isEscort || !user) {
      alert('Only escorts can repost their profiles');
      return;
    }

    if (user.id !== profile.id) {
      alert('You can only repost your own profile');
      return;
    }

    if (user.credits < 2) {
      alert('Insufficient credits! You need 2 credits to repost.');
      return;
    }

    try {
      setIsReposting(true);
      const response = await ApiService.repostAd(profile.id);

      // Update user data
      updateUser({ 
        credits: response.remaining_credits,
        points: response.total_points 
      });

      // Update local state
      setRepostCount(prev => prev + 1);
      setShowRepostSuccess(true);
      setTimeout(() => setShowRepostSuccess(false), 3000);

      // Notify parent component
      onProfileUpdate && onProfileUpdate();
    } catch (error) {
      alert(`Failed to repost: ${error.message}`);
    } finally {
      setIsReposting(false);
    }
  };

  const handleGiftSent = () => {
    // Refresh profile data or update points
    onProfileUpdate && onProfileUpdate();
  };

  const formatLastRepost = (lastRepost) => {
    if (!lastRepost) return 'Never';
    const date = new Date(lastRepost);
    const now = new Date();
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours === 1) return '1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow relative">
        {/* Repost Success Message */}
        {showRepostSuccess && (
          <div className="absolute top-0 left-0 right-0 bg-green-500 text-white text-center py-2 z-10 rounded-t-lg">
            ✅ Ad reposted successfully! Now appears on top to attract more clients!
          </div>
        )}
        
        <div className="relative">
          <img 
            src={profile.image_url || profile.image || 'https://images.pexels.com/photos/18906155/pexels-photo-18906155.jpeg'} 
            alt={profile.name || profile.username}
            className="w-full h-64 object-cover"
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {profile.vip && (
              <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">VIP</span>
            )}
            {profile.verified && (
              <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">VERIFIED</span>
            )}
          </div>

          {/* Repost Info */}
          <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
            Last repost: {formatLastRepost(profile.last_repost)}
          </div>
        </div>

        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-gray-900">{profile.name || profile.username}</h3>
            <div className="flex items-center">
              <span className="text-yellow-400">★</span>
              <span className="text-sm text-gray-600 ml-1">{profile.rating || '5.0'} ({profile.reviews || '0'})</span>
            </div>
          </div>
          
          <p className="text-gray-600 text-sm mb-2">{profile.location || 'Location not specified'}</p>
          <p className="text-gray-600 text-sm mb-3">Age: {profile.age || 'N/A'}</p>
          
          <div className="flex flex-wrap gap-1 mb-3">
            {(profile.services || []).map((service, index) => (
              <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                {service}
              </span>
            ))}
          </div>
          
          <p className="text-sm text-green-600 mb-2">
            {profile.profile_active ? 'Available' : 'Unavailable'}
          </p>
          
          {/* Stats */}
          <div className="flex justify-between items-center mb-3 text-xs text-gray-500">
            <span>Reposts: {repostCount}</span>
            <span>Points: {profile.points?.toFixed(0) || 0}</span>
          </div>
          
          {/* Action Buttons */}
          <div className="space-y-2">
            <button className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-2 rounded-lg font-semibold hover:from-pink-600 hover:to-pink-700 transition-all">
              View Details
            </button>
            
            {/* Gift Button - Only for authenticated clients */}
            {isAuthenticated && isClient && (
              <button 
                onClick={() => setShowGiftModal(true)}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-2 rounded-lg font-semibold hover:from-purple-600 hover:to-purple-700 transition-all flex items-center justify-center space-x-2"
              >
                <span>🎁</span>
                <span>Send Gift</span>
              </button>
            )}
            
            {/* Repost Button - Only for profile owner */}
            {isAuthenticated && isEscort && user?.id === profile.id && (
              <button 
                onClick={handleRepost}
                disabled={isReposting}
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black py-2 rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isReposting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    <span>Reposting...</span>
                  </>
                ) : (
                  <>
                    <span>🚀</span>
                    <span>Repost Ad (2 Credits)</span>
                  </>
                )}
              </button>
            )}
            
            {/* Credits info for escort */}
            {isAuthenticated && isEscort && user?.id === profile.id && (
              <p className="text-xs text-center text-gray-500">
                Your credits: €{user?.credits?.toFixed(2) || '0.00'}
              </p>
            )}
            
            {!isAuthenticated && (
              <p className="text-xs text-center text-gray-500 italic">
                Login to send gifts or repost ads
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Gift Modal */}
      <GiftModal
        isOpen={showGiftModal}
        onClose={() => setShowGiftModal(false)}
        escort={profile}
        onGiftSent={handleGiftSent}
      />
    </>
  );
};