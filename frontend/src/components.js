import React, { useState } from 'react';

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
    hasVideos: false
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
    hasVideos: true
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
    hasVideos: false
  },
  {
    id: 4,
    name: 'Anastasia',
    age: 25,
    location: 'Vienna, Austria',
    rating: 4.8,
    reviews: 124,
    image: 'https://images.unsplash.com/photo-1710023177946-94b99710b271',
    services: ['Companion', 'Travel', 'Dinner Date'],
    availability: 'Available Today',
    vip: true,
    verified: true,
    hasVideos: true
  },
  {
    id: 5,
    name: 'Victoria',
    age: 27,
    location: 'Barcelona, Spain',
    rating: 4.9,
    reviews: 187,
    image: 'https://images.pexels.com/photos/18906155/pexels-photo-18906155.jpeg',
    services: ['Companion', 'Events', 'City Tour'],
    availability: 'Available Tomorrow',
    vip: true,
    verified: true,
    hasVideos: false
  },
  {
    id: 6,
    name: 'Olivia',
    age: 22,
    location: 'Amsterdam, Netherlands',
    rating: 4.6,
    reviews: 93,
    image: 'https://images.unsplash.com/photo-1635358154434-5254df331548',
    services: ['Companion', 'Social Events'],
    availability: 'Available This Week',
    vip: false,
    verified: true,
    hasVideos: true
  }
];

// Header Component
export const Header = () => {
  return (
    <header className="bg-black border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-xl">♥</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                  EUROLOVE
                </h1>
                <p className="text-xs text-gray-400 tracking-wider">INTIMACY, SCULPTED IN LUXURY</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-white hover:text-yellow-400 transition-colors">VIP Escorts</a>
            <a href="#" className="text-white hover:text-yellow-400 transition-colors">Girls</a>
            <a href="#" className="text-white hover:text-yellow-400 transition-colors">Pornstars</a>
            <a href="#" className="text-white hover:text-yellow-400 transition-colors">City Tour</a>
            <a href="#" className="text-white hover:text-yellow-400 transition-colors">Agencies</a>
            <a href="#" className="text-white hover:text-yellow-400 transition-colors">Videos</a>
            <a href="#" className="text-white hover:text-yellow-400 transition-colors">Reviews</a>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <button className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-4 py-2 rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-700 transition-all">
              Login
            </button>
            <button className="border border-yellow-400 text-yellow-400 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-400 hover:text-black transition-all">
              Register
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

// Top Cashback Banner
export const CashbackBanner = () => {
  return (
    <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 py-3">
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

// Right Sidebar Banners
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
    },
    {
      image: 'https://images.pexels.com/photos/7180230/pexels-photo-7180230.jpeg',
      title: 'VIP ESCORTS',
      subtitle: 'Exclusive Services'
    },
    {
      image: 'https://images.unsplash.com/photo-1663739314425-4b0d05a8a068',
      title: 'DOLLS N ROSES',
      subtitle: 'Elite Companions'
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
      
      {/* Additional promotional banner */}
      <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg p-4 text-center text-black">
        <h3 className="font-bold text-lg mb-2">Premium Membership</h3>
        <p className="text-sm mb-3">Unlock exclusive profiles and premium features</p>
        <button className="bg-black text-yellow-400 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-900 transition-colors">
          Upgrade Now
        </button>
      </div>
    </div>
  );
};

// Hero Section
export const HeroSection = () => {
  return (
    <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-pink-600 py-16">
      <div className="max-w-4xl mx-auto text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Premium Escort Directory
        </h1>
        <p className="text-xl text-white/90 mb-8">
          Discover sophisticated companions across Europe's finest cities
        </p>
        
        <div className="bg-white rounded-lg p-6 shadow-xl">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search for escorts or services..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
            </div>
            <div className="md:w-48">
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent">
                <option>All Locations</option>
                <option>London</option>
                <option>Paris</option>
                <option>Berlin</option>
                <option>Vienna</option>
                <option>Barcelona</option>
              </select>
            </div>
            <button className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-8 py-3 rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-700 transition-all">
              Search Now
            </button>
          </div>
        </div>

        {/* Popular Destinations */}
        <div className="mt-8">
          <p className="text-white/90 mb-4">Popular Destinations</p>
          <div className="flex flex-wrap justify-center gap-3">
            {['London', 'Paris', 'Berlin', 'Milan', 'Amsterdam', 'Barcelona'].map((city) => (
              <button
                key={city}
                className="bg-white/20 text-white px-4 py-2 rounded-full hover:bg-white/30 transition-colors"
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

// Filter Bar
export const FilterBar = () => {
  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex flex-wrap gap-4 items-center">
        <span className="text-gray-600 font-medium">6 companions found</span>
        
        <div className="flex gap-2">
          <select className="border border-gray-300 rounded px-3 py-1 text-sm">
            <option>All Locations</option>
          </select>
          <select className="border border-gray-300 rounded px-3 py-1 text-sm">
            <option>All Services</option>
          </select>
          <select className="border border-gray-300 rounded px-3 py-1 text-sm">
            <option>Age</option>
          </select>
          <select className="border border-gray-300 rounded px-3 py-1 text-sm">
            <option>Hair</option>
          </select>
          <select className="border border-gray-300 rounded px-3 py-1 text-sm">
            <option>Rates</option>
          </select>
          <select className="border border-gray-300 rounded px-3 py-1 text-sm">
            <option>Height</option>
          </select>
        </div>

        <div className="flex gap-2 ml-auto">
          <button className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded text-sm">Recently Reviewed</button>
          <button className="text-gray-600 px-3 py-1 rounded text-sm hover:bg-gray-100">Clear All</button>
        </div>
      </div>
      
      <div className="flex gap-2 mt-3">
        <button className="bg-purple-100 text-purple-800 px-3 py-1 rounded text-sm">WITH REVIEWS (206902)</button>
        <button className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm">VERIFIED (45747)</button>
        <button className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm">NEWCOMERS (73211)</button>
        <button className="bg-pink-100 text-pink-800 px-3 py-1 rounded text-sm">WITH VIDEOS (26008)</button>
        <button className="bg-orange-100 text-orange-800 px-3 py-1 rounded text-sm">PORNSTAR (5617)</button>
        <button className="bg-red-100 text-red-800 px-3 py-1 rounded text-sm">INDEPENDENT (50827)</button>
      </div>
    </div>
  );
};

// Profile Card Component
export const ProfileCard = ({ profile }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
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
          {profile.hasVideos && (
            <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold">VIDEO</span>
          )}
        </div>

        {/* NEW badge */}
        <div className="absolute top-2 right-2">
          <span className="bg-yellow-400 text-black px-2 py-1 rounded text-xs font-bold">NEW</span>
        </div>

        {/* Featured badge */}
        <div className="absolute bottom-2 left-2">
          <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">FEATURED</span>
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
        
        <p className="text-sm text-gray-700 mb-4">
          Intellectual companion who loves art, history and meaningful conversations. Perfect for dinner and city exploration.
        </p>
        
        <button className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-2 rounded-lg font-semibold hover:from-pink-600 hover:to-pink-700 transition-all">
          View Details
        </button>
      </div>
    </div>
  );
};

// Main Content Area
export const MainContent = ({ selectedCountry, selectedCity }) => {
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
          <button className="hover:bg-red-600 px-4 py-2 rounded transition-colors">Fuck Now</button>
          <button className="hover:bg-red-600 px-4 py-2 rounded transition-colors">Escorts Now</button>
          <button className="hover:bg-red-600 px-4 py-2 rounded transition-colors">Live Sex</button>
          <button className="hover:bg-red-600 px-4 py-2 rounded transition-colors">Live Escorts</button>
        </div>
      </div>

      {/* Top Banners */}
      <div className="flex gap-4 p-4">
        <div className="flex-1 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
          TOP COMPANIONS - Premium Directory
        </div>
        <div className="flex-1 h-24 bg-gradient-to-r from-pink-500 to-red-600 rounded-lg flex items-center justify-center text-white font-bold">
          SWEET PASSION - Elite Services
        </div>
        <div className="flex-1 h-24 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center text-white font-bold">
          FEELINGS - Luxury Experiences
        </div>
      </div>

      <FilterBar />

      {/* Profile Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockProfiles.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} />
          ))}
        </div>
      </div>
    </div>
  );
};

// Footer Component
export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                <span className="text-black font-bold">♥</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                EUROLOVE
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              Europe's premier escort directory connecting sophisticated companions with discerning clients across major cities.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Browse Companions</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Featured Profiles</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Rewards Program</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">VIP Memberships</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Safety Guidelines</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.618 5.367 11.986 11.988 11.986s11.987-5.368 11.987-11.986C24.014 5.367 18.635.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.5 13.559 3.5 12.017s.698-2.878 1.626-3.674c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.796 1.626 2.132 1.626 3.674s-.698 2.878-1.626 3.674c-.875.808-2.026 1.298-3.323 1.298z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 EUROLOVE. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};