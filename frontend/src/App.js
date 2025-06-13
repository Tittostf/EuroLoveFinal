import React, { useState } from 'react';
import './App.css';
import {
  Header,
  CashbackBanner,
  HeroSection,
  MonthlyRewardsSection,
  TopDonatorsRewardsSection,
  CountrySidebar,
  RightSidebar,
  MainContent,
  Footer
} from './components';
import { LanguageProvider } from './translations';

function App() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setSelectedCity(null);
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
  };

  return (
    <LanguageProvider>
      <div className="App min-h-screen bg-gray-100">
        {/* Header */}
        <Header />
        
        {/* Top Cashback Banner */}
        <CashbackBanner />
        
        {/* Hero Section */}
        <HeroSection />
        
        {/* Monthly Rewards Program Section (ESCORT LEADERBOARD) */}
        <MonthlyRewardsSection />
        
        {/* Top Donators Rewards Program Section (CLIENT LEADERBOARD) */}
        <TopDonatorsRewardsSection />
        
        {/* Main Layout */}
        <div className="flex">
          {/* Left Sidebar - Countries */}
          <CountrySidebar 
            selectedCountry={selectedCountry}
            onCountrySelect={handleCountrySelect}
            selectedCity={selectedCity}
            onCitySelect={handleCitySelect}
          />
          
          {/* Main Content with REPOST functionality */}
          <MainContent 
            selectedCountry={selectedCountry}
            selectedCity={selectedCity}
          />
          
          {/* Right Sidebar - Banners */}
          <RightSidebar />
        </div>
        
        {/* Footer */}
        <Footer />
      </div>
    </LanguageProvider>
  );
}

export default App;