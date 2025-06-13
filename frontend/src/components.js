import React, { useState } from 'react';
import { useLanguage, useTranslation } from './translations';

// Mock data for countries and cities
const countriesData = {
  'Albania': { count: 2371, cities: ['Tirana', 'Durres', 'Vlore', 'Shkoder', 'Korce'] },
  'Andorra': { count: 8, cities: ['Andorra la Vella', 'Escaldes-Engordany'] },
  'Armenia': { count: 928, cities: ['Yerevan', 'Gyumri', 'Vanadzor'] },
  'Austria': { count: 1289, cities: ['Vienna', 'Salzburg', 'Innsbruck', 'Graz', 'Linz'] },
  'Belarus': { count: 571, cities: ['Minsk', 'Gomel', 'Mogilev', 'Vitebsk'] },
  'Belgium': { count: 1103, cities: ['Brussels', 'Antwerp', 'Ghent', 'Bruges', 'Leuven'] },
  'Bosnia Herzegovina': { count: 110, cities: ['Sarajevo', 'Banja Luka', 'Tuzla', 'Mostar'] },
  'Bulgaria': { count: 750, cities: ['Sofia', 'Plovdiv', 'Varna', 'Burgas', 'Ruse'] },
  'Croatia': { count: 1856, cities: ['Zagreb', 'Split', 'Rijeka', 'Osijek', 'Zadar'] },
  'Cyprus': { count: 794, cities: ['Nicosia', 'Limassol', 'Larnaca', 'Paphos'] },
  'Czech Republic': { count: 973, cities: ['Prague', 'Brno', 'Ostrava', 'Plzen', 'Liberec'] },
  'Denmark': { count: 329, cities: ['Copenhagen', 'Aarhus', 'Odense', 'Aalborg'] },
  'Estonia': { count: 250, cities: ['Tallinn', 'Tartu', 'Narva', 'Parnu'] },
  'Finland': { count: 359, cities: ['Helsinki', 'Espoo', 'Tampere', 'Vantaa', 'Turku'] },
  'France': { count: 4680, cities: ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille'] },
  'Georgia': { count: 1473, cities: ['Tbilisi', 'Kutaisi', 'Batumi', 'Rustavi'] },
  'Germany': { count: 10707, cities: ['Berlin', 'Munich', 'Hamburg', 'Cologne', 'Frankfurt', 'Stuttgart', 'Dusseldorf', 'Dortmund', 'Essen', 'Leipzig'] },
  'Greece': { count: 1367, cities: ['Athens', 'Thessaloniki', 'Patras', 'Heraklion', 'Larissa'] },
  'Hungary': { count: 839, cities: ['Budapest', 'Debrecen', 'Szeged', 'Miskolc', 'Pecs'] }
};

// Mock profile data
const mockProfiles = [
  {
    id: 1,
    name: 'Isabella',
    age: 24,
    location: 'London, UK',
    rating: 4.9,
    reviews: 142,
    image: 'https://images.pexels.com/photos/18906155/pexels-photo-18906155.jpeg',
    services: ['Companion', 'Dinner Date', 'City Tour'],
    availability: 'Available Today',
    vip: true,
    verified: true,
    hasVideos: false,
    lastRepost: '2 hours ago',
    repostCount: 12
  },
  {
    id: 2,
    name: 'Sophia',
    age: 26,
    location: 'Paris, France',
    rating: 5.0,
    reviews: 98,
    image: 'https://images.unsplash.com/photo-1635358154434-5254df331548',
    services: ['Companion', 'Travel', 'Events'],
    availability: 'Available Tomorrow',
    vip: true,
    verified: true,
    hasVideos: true,
    lastRepost: '1 hour ago',
    repostCount: 8
  },
  {
    id: 3,
    name: 'Emma',
    age: 23,
    location: 'Berlin, Germany',
    rating: 4.7,
    reviews: 76,
    image: 'https://images.pexels.com/photos/11797869/pexels-photo-11797869.jpeg',
    services: ['Companion', 'Massage', 'Social Events'],
    availability: 'Available This Week',
    vip: false,
    verified: true,
    hasVideos: false,
    lastRepost: '4 hours ago',
    repostCount: 15
  }
];

// Mock leaderboard data
const mockLeaderboard = [
  { rank: 1, name: 'Sofia_VIP', points: 2847, invested: 2847, cashback: '7%', earnings: '€199.29' },
  { rank: 2, name: 'Isabella_Elite', points: 2234, invested: 2234, cashback: '2%', earnings: '€44.68' },
  { rank: 3, name: 'Emma_Berlin', points: 1956, invested: 1956, cashback: '1%', earnings: '€19.56' },
  { rank: 4, name: 'Anastasia_Vienna', points: 1743, invested: 1743, cashback: '0%', earnings: '€0.00' },
  { rank: 5, name: 'Victoria_BCN', points: 1598, invested: 1598, cashback: '0%', earnings: '€0.00' }
];

// Mock Top Donators
const mockTopDonators = [
  { rank: 1, username: 'LuxuryLover_VIP', creditsSpent: 15847, percentage: 20, potentialCashback: '€3,169.40', avatar: '👑' },
  { rank: 2, username: 'DiamondClient_Elite', creditsSpent: 12456, percentage: 15, potentialCashback: '€2,374.05', avatar: '💎' },
  { rank: 3, username: 'GoldMember_Premium', creditsSpent: 9823, percentage: 10, potentialCashback: '€1,574.68', avatar: '🥇' }
];

// Header Component
export const Header = () => {
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();
  
  return (
    <header className="bg-gradient-to-r from-gray-900 via-black to-gray-900 border-b border-yellow-400/20 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              {/* EUROLOVE Logo */}
              <div className="relative group">
                <img 
                  src="/eurolove-logo.svg" 
                  alt="EUROLOVE - Intimacy, Sculpted in Luxury"
                  className="w-16 h-16 rounded-full object-cover border-3 border-yellow-400 shadow-lg group-hover:shadow-yellow-400/30 transition-all duration-300"
                />
                <div className="absolute inset-0 w-16 h-16 rounded-full bg-yellow-400/10 animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent tracking-wide">
                  EUROLOVE
                </h1>
                <p className="text-xs text-gray-300 tracking-[0.2em] font-light uppercase">
                  Intimacy, Sculpted in Luxury
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <a href="#" className="text-gray-300 hover:text-yellow-400 transition-all duration-300 font-medium tracking-wide uppercase text-sm">
              {t('vipEscorts')}
            </a>
            <a href="#" className="text-gray-300 hover:text-yellow-400 transition-all duration-300 font-medium tracking-wide uppercase text-sm">
              {t('girls')}
            </a>
            <a href="#" className="text-gray-300 hover:text-yellow-400 transition-all duration-300 font-medium tracking-wide uppercase text-sm">
              {t('videos')}
            </a>
          </nav>

          {/* Language Switcher & User Actions */}
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <div className="flex items-center bg-gray-800/50 rounded-lg p-1">
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                  language === 'en' 
                    ? 'bg-yellow-400 text-black' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('ro')}
                className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                  language === 'ro' 
                    ? 'bg-yellow-400 text-black' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                RO
              </button>
            </div>
            
            <button className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-6 py-2.5 rounded-lg font-bold hover:from-yellow-500 hover:to-yellow-600 transition-all transform hover:scale-105 shadow-lg hover:shadow-yellow-400/25 uppercase tracking-wide text-sm">
              {t('login')}
            </button>
            <button className="border-2 border-yellow-400 text-yellow-400 px-6 py-2.5 rounded-lg font-bold hover:bg-yellow-400 hover:text-black transition-all transform hover:scale-105 uppercase tracking-wide text-sm">
              {t('register')}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

// Simple Banner Component
export const CashbackBanner = () => {
  const { t } = useTranslation();
  
  return (
    <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center text-center">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
              <span className="text-yellow-400 text-sm font-bold">€</span>
            </div>
            <div>
              <span className="text-black font-bold text-lg">Monthly Cash-Back System</span>
              <span className="text-black/80 ml-2">Get up to 15% back on all bookings!</span>
            </div>
            <button className="bg-black text-yellow-400 px-4 py-1 rounded-full text-sm font-semibold hover:bg-gray-900 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Hero Section Component
export const HeroSection = () => {
  const { t } = useTranslation();
  
  return (
    <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-purple-700 py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-400/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative max-w-6xl mx-auto text-center px-4">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
          {t('heroTitle')}
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed">
          {t('heroSubtitle')}
        </p>
        
        <div className="bg-white/95 backdrop-blur rounded-2xl p-8 shadow-2xl max-w-4xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-lg font-medium"
              />
            </div>
            <div className="lg:w-64">
              <select className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-lg font-medium">
                <option>{t('allLocations')}</option>
                <option>London</option>
                <option>Paris</option>
                <option>Berlin</option>
                <option>Vienna</option>
                <option>Barcelona</option>
              </select>
            </div>
            <button className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-10 py-4 rounded-xl font-bold text-lg hover:from-yellow-500 hover:to-yellow-600 transition-all transform hover:scale-105 shadow-lg uppercase tracking-wide">
              {t('searchNow')}
            </button>
          </div>
        </div>

        <div className="mt-12">
          <p className="text-white/90 mb-6 text-lg font-medium">{t('popularDestinations')}</p>
          <div className="flex flex-wrap justify-center gap-4">
            {['London', 'Paris', 'Berlin', 'Milan', 'Amsterdam', 'Barcelona'].map((city) => (
              <button
                key={city}
                className="bg-white/20 backdrop-blur text-white px-6 py-3 rounded-full hover:bg-white/30 transition-all transform hover:scale-105 font-medium border border-white/20"
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Country Sidebar Component
export const CountrySidebar = ({ selectedCountry, onCountrySelect, selectedCity, onCitySelect }) => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen overflow-y-auto">
      <div className="p-4">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
          />
        </div>
        
        <h3 className="font-semibold text-gray-900 mb-4">
          {selectedCountry ? `Cities in ${selectedCountry}` : 'EUROPE'}
        </h3>
        
        {selectedCountry ? (
          <div>
            <button
              onClick={() => onCountrySelect(null)}
              className="text-yellow-600 hover:text-yellow-700 mb-4 text-sm flex items-center"
            >
              ← Back to Countries
            </button>
            {countriesData[selectedCountry]?.cities.map((city, index) => (
              <div
                key={city}
                onClick={() => onCitySelect(city)}
                className={`flex justify-between items-center py-2 px-2 rounded hover:bg-gray-100 cursor-pointer ${
                  selectedCity === city ? 'bg-yellow-50 border-l-4 border-yellow-400' : ''
                }`}
              >
                <span className="text-sm text-gray-700">{city}</span>
                <span className="text-xs text-gray-500">{Math.floor(Math.random() * 500) + 10}</span>
              </div>
            ))}
          </div>
        ) : (
          Object.entries(countriesData).map(([country, data]) => (
            <div
              key={country}
              onClick={() => onCountrySelect(country)}
              className="flex justify-between items-center py-2 px-2 rounded hover:bg-gray-100 cursor-pointer"
            >
              <span className="text-sm text-gray-700">{country}</span>
              <span className="text-xs text-gray-500">({data.count})</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Right Sidebar Component
export const RightSidebar = () => {
  const banners = [
    {
      image: 'https://images.pexels.com/photos/9436715/pexels-photo-9436715.jpeg',
      title: 'PLAYGIRL',
      subtitle: 'Premium Companions'
    },
    {
      image: 'https://images.unsplash.com/photo-1598132521173-9023a3357da7',
      title: 'GOLDEN MODELS',
      subtitle: 'Luxury Experiences'
    }
  ];

  return (
    <div className="w-80 bg-gray-50 p-4 space-y-4">
      {banners.map((banner, index) => (
        <div key={index} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
          <div className="relative h-32 overflow-hidden">
            <img 
              src={banner.image} 
              alt={banner.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-2 left-2 text-white">
              <h3 className="font-bold text-lg">{banner.title}</h3>
              <p className="text-sm text-gray-200">{banner.subtitle}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Main Content Component
export const MainContent = ({ selectedCountry, selectedCity }) => {
  const { t } = useTranslation();
  
  const getDisplayTitle = () => {
    if (selectedCity && selectedCountry) {
      return `Escorts in ${selectedCity}, ${selectedCountry}`;
    } else if (selectedCountry) {
      return `Escorts in ${selectedCountry}`;
    }
    return 'VIP Escorts';
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockProfiles.map((profile) => (
            <div key={profile.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative">
                <img 
                  src={profile.image} 
                  alt={profile.name}
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
              </div>

              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{profile.name}</h3>
                  <div className="flex items-center">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm text-gray-600 ml-1">{profile.rating} ({profile.reviews})</span>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-2">{profile.location}</p>
                <p className="text-gray-600 text-sm mb-3">Age: {profile.age}</p>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {profile.services.map((service, index) => (
                    <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                      {service}
                    </span>
                  ))}
                </div>
                
                <p className="text-sm text-green-600 mb-3">{profile.availability}</p>
                
                {/* Action Buttons */}
                <div className="space-y-2">
                  <button className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-2 rounded-lg font-semibold hover:from-pink-600 hover:to-pink-700 transition-all">
                    View Details
                  </button>
                  
                  <button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-2 rounded-lg font-semibold hover:from-purple-600 hover:to-purple-700 transition-all flex items-center justify-center space-x-2">
                    <span>🎁</span>
                    <span>Send Gift</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Footer Component
export const Footer = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="/eurolove-logo.svg" 
                alt="EUROLOVE Logo"
                className="w-10 h-10 rounded-full object-cover border-2 border-yellow-400"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                EUROLOVE
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-2 font-light tracking-wide">
              INTIMACY, SCULPTED IN LUXURY
            </p>
            <p className="text-gray-400 text-sm">
              Europe's premier escort directory connecting sophisticated companions with discerning clients.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">{t('quickLinks')}</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-yellow-400 transition-colors">{t('browseCompanions')}</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">{t('featuredProfiles')}</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">{t('rewardsProgram')}</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">{t('support')}</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-yellow-400 transition-colors">{t('helpCenter')}</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">{t('safetyGuidelines')}</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">{t('privacyPolicy')}</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">{t('contact')}</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 EUROLOVE. {t('allRightsReserved')}
          </p>
        </div>
      </div>
    </footer>
  );
};