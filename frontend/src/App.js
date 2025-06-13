import React, { useState } from 'react';
import './App.css';
import {
  Header,
  CashbackBanner,
  HeroSection,
  CountrySidebar,
  RightSidebar,
  Footer
} from './components';
import { MonthlyRewardsSection, TopDonatorsRewardsSection } from './components/RealTimeLeaderboards';
import { MainContent } from './components/RealMainContent';
import { LoginModal } from './components/LoginModal';
import AdminDashboard from './components/AdminDashboard';
import { LanguageProvider } from './translations';
import { AuthProvider } from './context/AuthContext';

function App() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginModalTab, setLoginModalTab] = useState('login');
  const [currentView, setCurrentView] = useState('home'); // 'home' or 'admin'

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setSelectedCity(null);
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
  };

  const openLoginModal = (tab = 'login') => {
    setLoginModalTab(tab);
    setShowLoginModal(true);
  };

  // Check if we're on admin route
  const isAdminRoute = window.location.pathname === '/admin';

  if (isAdminRoute) {
    return (
      <AuthProvider>
        <LanguageProvider>
          <AdminDashboard />
        </LanguageProvider>
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <LanguageProvider>
        <div className="App min-h-screen bg-gray-100">
          {/* Header */}
          <Header onLoginClick={openLoginModal} />
          
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
            
            {/* Main Content with Real Functionality */}
            <MainContent 
              selectedCountry={selectedCountry}
              selectedCity={selectedCity}
            />
            
            {/* Right Sidebar - Banners */}
            <RightSidebar />
          </div>
          
          {/* Footer */}
          <Footer />

          {/* Login/Register Modal */}
          <LoginModal
            isOpen={showLoginModal}
            onClose={() => setShowLoginModal(false)}
            defaultTab={loginModalTab}
          />
        </div>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;