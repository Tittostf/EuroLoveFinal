import React, { useState } from 'react';
import './App.css';
import {
  Header,
  CashbackBanner,
  MonthlyRewardsSection,
  CountrySidebar,
  RightSidebar,
  HeroSection,
  MainContent,
  Footer,
  ProfileManagement
} from './components';

function App() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [showProfileManagement, setShowProfileManagement] = useState(false);

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setSelectedCity(null); // Reset city when country changes
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
  };

  // Mock profile for profile management demo
  const mockProfile = {
    name: 'Isabella',
    location: 'London, UK',
    repostCount: 12,
    lastRepost: '2 hours ago'
  };

  return (
    <div className="App min-h-screen bg-gray-100">
      {/* Header */}
      <Header />
      
      {/* Top Cashback Banner */}
      <CashbackBanner />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Monthly Rewards Program Section */}
      <MonthlyRewardsSection />
      
      {/* Profile Management Modal/Section */}
      {showProfileManagement && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold">Profile Management</h2>
              <button 
                onClick={() => setShowProfileManagement(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-4">
              <ProfileManagement profile={mockProfile} />
            </div>
          </div>
        </div>
      )}
      
      {/* Main Layout */}
      <div className="flex">
        {/* Left Sidebar - Countries */}
        <CountrySidebar 
          selectedCountry={selectedCountry}
          onCountrySelect={handleCountrySelect}
          selectedCity={selectedCity}
          onCitySelect={handleCitySelect}
        />
        
        {/* Main Content */}
        <MainContent 
          selectedCountry={selectedCountry}
          selectedCity={selectedCity}
          onProfileManagementClick={() => setShowProfileManagement(true)}
        />
        
        {/* Right Sidebar - Banners */}
        <RightSidebar />
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;