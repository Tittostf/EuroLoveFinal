import React, { useState } from 'react';
import { useLanguage, useTranslation } from './translations';

// Language context
const useLanguage = () => {
  const [language, setLanguage] = useState('en'); // 'en' or 'ro'
  
  const translations = {
    en: {
      // Header
      vipEscorts: "VIP Escorts",
      girls: "Girls", 
      pornstars: "Pornstars",
      cityTour: "City Tour",
      agencies: "Agencies",
      videos: "Videos",
      reviews: "Reviews",
      login: "Login",
      register: "Register",
      
      // Hero Section
      heroTitle: "Premium Escort Directory",
      heroSubtitle: "Discover sophisticated companions across Europe's finest cities",
      searchPlaceholder: "Search for escorts or services...",
      allLocations: "All Locations",
      searchNow: "Search Now",
      popularDestinations: "Popular Destinations",
      
      // Monthly Rewards
      lunarContest: "LUNAR UNIQUE CONTEST",
      euroloveBrand: "EUROLOVE",
      contestText1: "EARN 10% CASH-BACK FROM TOTAL ESCORT SUBSCRIPTIONS!",
      contestText2: "EVERY MONTH, 3 PEOPLE RECEIVE THE REWARD.",
      contestText3: "ACTIVATE YOUR PROFILE AND JOIN THE RACE TODAY!",
      contestText4: "THE MORE SUBSCRIPTIONS IN TOTAL, THE HIGHER THE CASH-BACK AMOUNT GRANTED.",
      participateNow: "PARTICIPATE NOW!",
      
      rewardsTitle: "EUROLOVE Monthly Rewards Program",
      earnMonthly: "Earn Every Month!",
      rewardsSubtitle: "Turn your activity on EUROLOVE into real cash with our Official Monthly Rewards Program.",
      moreActive: "The more active you are, the more you can earn — simple, transparent, and profitable.",
      
      // Profile Management
      profileManagement: "Profile Management",
      creditsBalance: "Credits Balance",
      monthlyPoints: "Monthly Points", 
      thisMonth: "This Month",
      repostAd: "Repost Your Ad",
      repostNow: "Repost Now",
      repostHistory: "Repost History",
      
      // Footer
      quickLinks: "Quick Links",
      browseCompanions: "Browse Companions",
      featuredProfiles: "Featured Profiles",
      rewardsProgram: "Rewards Program",
      vipMemberships: "VIP Memberships",
      support: "Support",
      helpCenter: "Help Center",
      safetyGuidelines: "Safety Guidelines",
      privacyPolicy: "Privacy Policy",
      termsOfService: "Terms of Service",
      allRightsReserved: "All rights reserved."
    },
    ro: {
      // Header
      vipEscorts: "Escorte VIP",
      girls: "Fete",
      pornstars: "Vedete Porno", 
      cityTour: "Tur Oraș",
      agencies: "Agenții",
      videos: "Videouri",
      reviews: "Recenzii",
      login: "Conectare",
      register: "Înregistrare",
      
      // Hero Section
      heroTitle: "Director Premium de Escorte",
      heroSubtitle: "Descoperă companioni sofisticați în cele mai rafinate orașe din Europa",
      searchPlaceholder: "Caută escorte sau servicii...",
      allLocations: "Toate Locațiile",
      searchNow: "Caută Acum",
      popularDestinations: "Destinații Populare",
      
      // Monthly Rewards  
      lunarContest: "CONCURS LUNAR UNIC",
      euroloveBrand: "EUROLOVE",
      contestText1: "CÂȘTIGĂ 10% CASH-BACK DIN TOTALUL ABONAMENTELOR ESCORTELOR!",
      contestText2: "ÎN FIECARE LUNĂ, 3 PERSOANE PRIMESC RECOMPENSA.",
      contestText3: "ACTIVEAZĂ-ȚI PROFILUL ȘI INTRĂ ÎN CURSĂ CHIAR AZI!",
      contestText4: "CU CÂT MAI MULTE ABONAMENTE PER TOTAL CU ATÂT MAI MARE ESTE SUMA CASH-BACK ACORDATĂ.",
      participateNow: "PARTICIPĂ ACUM!",
      
      rewardsTitle: "Programul de Recompense Lunare EUROLOVE",
      earnMonthly: "Câștigă În Fiecare Lună!",
      rewardsSubtitle: "Transformă activitatea ta pe EUROLOVE în bani reali cu Programul nostru Oficial de Recompense Lunare.",
      moreActive: "Cu cât ești mai activ, cu atât poți câștiga mai mult — simplu, transparent și profitabil.",
      
      // Profile Management
      profileManagement: "Gestionare Profil",
      creditsBalance: "Sold Credite",
      monthlyPoints: "Puncte Lunare",
      thisMonth: "Luna Aceasta", 
      repostAd: "Republicare Anunț",
      repostNow: "Republică Acum",
      repostHistory: "Istoric Republicări",
      
      // Footer
      quickLinks: "Link-uri Rapide",
      browseCompanions: "Răsfoiește Companioni",
      featuredProfiles: "Profiluri Recomandate", 
      rewardsProgram: "Program Recompense",
      vipMemberships: "Abonamente VIP",
      support: "Suport",
      helpCenter: "Centru de Ajutor",
      safetyGuidelines: "Ghid de Siguranță",
      privacyPolicy: "Politica de Confidențialitate",
      termsOfService: "Termeni și Condiții",
      allRightsReserved: "Toate drepturile rezervate."
    }
  };
  
  const t = (key) => translations[language][key] || key;
  
  return { language, setLanguage, t };
};

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
    hasVideos: true,
    lastRepost: '30 minutes ago',
    repostCount: 22
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
    hasVideos: false,
    lastRepost: '6 hours ago',
    repostCount: 9
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
    hasVideos: true,
    lastRepost: '3 hours ago',
    repostCount: 11
  }
];

// Mock data for Top Donators
const mockTopDonators = [
  { rank: 1, username: 'LuxuryLover_VIP', creditsSpent: 15847, percentage: 20, potentialCashback: '€3,169.40', avatar: '👑' },
  { rank: 2, username: 'DiamondClient_Elite', creditsSpent: 12456, percentage: 15, potentialCashback: '€2,374.05', avatar: '💎' },
  { rank: 3, username: 'GoldMember_Premium', creditsSpent: 9823, percentage: 10, potentialCashback: '€1,574.68', avatar: '🥇' },
  { rank: 4, username: 'PlatinumUser_VIP', creditsSpent: 8745, percentage: 8, potentialCashback: '€1,119.36', avatar: '🏆' },
  { rank: 5, username: 'RoyalClient_Exclusive', creditsSpent: 7234, percentage: 7, potentialCashback: '€811.13', avatar: '👨‍💼' },
  { rank: 6, username: 'EliteSpender_Pro', creditsSpent: 6892, percentage: 6, potentialCashback: '€662.45', avatar: '💼' },
  { rank: 7, username: 'PremiumDonator_VIP', creditsSpent: 5967, percentage: 5, potentialCashback: '€477.36', avatar: '🎩' },
  { rank: 8, username: 'LuxurySupporter', creditsSpent: 5234, percentage: 4, potentialCashback: '€335.78', avatar: '🌟' },
  { rank: 9, username: 'VIPContributor_Gold', creditsSpent: 4567, percentage: 3, potentialCashback: '€219.21', avatar: '⭐' },
  { rank: 10, username: 'ExclusivePatron', creditsSpent: 3892, percentage: 2, potentialCashback: '€124.54', avatar: '🎖️' }
];

// Mock past winners data
const mockPastWinners = {
  'November 2024': [
    { rank: 1, username: 'DiamondKing_VIP', reward: '€4,234.50', creditsSpent: 18234 },
    { rank: 2, username: 'LuxuryLegend_Elite', reward: '€3,175.88', creditsSpent: 15467 },
    { rank: 3, username: 'GoldEmperor_Premium', reward: '€2,117.25', creditsSpent: 12890 }
  ],
  'October 2024': [
    { rank: 1, username: 'PlatinumPrince_VIP', reward: '€3,892.40', creditsSpent: 16723 },
    { rank: 2, username: 'RoyalSupporter_Elite', reward: '€2,919.30', creditsSpent: 14234 },
    { rank: 3, username: 'EliteBacker_Premium', reward: '€1,946.20', creditsSpent: 11567 }
  ],
  'September 2024': [
    { rank: 1, username: 'VIPMagnate_Exclusive', reward: '€5,123.75', creditsSpent: 20145 },
    { rank: 2, username: 'LuxuryTycoon_Elite', reward: '€3,842.81', creditsSpent: 17892 },
    { rank: 3, username: 'DiamondBaron_Premium', reward: '€2,561.88', creditsSpent: 15234 }
  ]
};

// Header Component
export const Header = () => {
  const { language, setLanguage, t } = useLanguage();
  
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
              {t('pornstars')}
            </a>
            <a href="#" className="text-gray-300 hover:text-yellow-400 transition-all duration-300 font-medium tracking-wide uppercase text-sm">
              {t('cityTour')}
            </a>
            <a href="#" className="text-gray-300 hover:text-yellow-400 transition-all duration-300 font-medium tracking-wide uppercase text-sm">
              {t('agencies')}
            </a>
            <a href="#" className="text-gray-300 hover:text-yellow-400 transition-all duration-300 font-medium tracking-wide uppercase text-sm">
              {t('videos')}
            </a>
            <a href="#" className="text-gray-300 hover:text-yellow-400 transition-all duration-300 font-medium tracking-wide uppercase text-sm">
              {t('reviews')}
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

// Top Professional Romanian/English Banner
export const CashbackBanner = () => {
  const { language, t } = useLanguage();
  
  return (
    <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-black py-6 border-b border-yellow-400/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-8 bg-gradient-to-r from-gray-700/40 to-gray-800/40 rounded-2xl px-8 py-6 backdrop-blur border border-yellow-400/20 shadow-2xl">
            {/* EUROLOVE Logo */}
            <div className="flex-shrink-0 relative">
              <img 
                src="/eurolove-logo.svg" 
                alt="EUROLOVE Logo"
                className="w-20 h-20 rounded-full object-cover border-3 border-yellow-400 shadow-lg"
              />
              <div className="absolute inset-0 w-20 h-20 rounded-full bg-yellow-400/10 animate-pulse"></div>
            </div>
            
            {/* Contest Content */}
            <div className="text-left max-w-4xl">
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-3xl">🏆</span>
                <span className="text-yellow-400 font-bold text-xl tracking-wide uppercase">
                  {t('lunarContest')}
                </span>
              </div>
              
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-2xl">💎</span>
                <span className="text-cyan-400 font-bold text-2xl tracking-widest">
                  {t('euroloveBrand')}
                </span>
                <span className="text-2xl">💎</span>
              </div>
              
              <div className="space-y-2">
                <p className="text-white font-bold text-sm tracking-wide">
                  {t('contestText1')}
                </p>
                <p className="text-gray-300 text-sm font-medium">
                  {t('contestText2')}
                </p>
                <p className="text-yellow-300 text-sm font-semibold">
                  {t('contestText3')}
                </p>
                <p className="text-gray-400 text-xs leading-relaxed">
                  {t('contestText4')}
                </p>
              </div>
            </div>
            
            <button className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-8 py-3 rounded-lg font-bold hover:from-yellow-500 hover:to-yellow-600 transition-all transform hover:scale-105 shadow-lg hover:shadow-yellow-400/25 uppercase tracking-wide whitespace-nowrap">
              {t('participateNow')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Top Donators Rewards Program Section
export const TopDonatorsRewardsSection = () => {
  const { language, setLanguage, t } = useLanguage();
  const [selectedMonth, setSelectedMonth] = useState('December 2024');
  
  const rewardPercentages = [
    { rank: 1, percentage: 20 },
    { rank: 2, percentage: 15 },
    { rank: 3, percentage: 10 },
    { rank: 4, percentage: 8 },
    { rank: 5, percentage: 7 },
    { rank: 6, percentage: 6 },
    { rank: 7, percentage: 5 },
    { rank: 8, percentage: 4 },
    { rank: 9, percentage: 3 },
    { rank: 10, percentage: 2 }
  ];
  
  return (
    <div className="bg-gradient-to-br from-purple-900 via-black to-blue-900 py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-purple-400/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-400/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center shadow-xl">
              <span className="text-white font-bold text-2xl">🏆</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent tracking-tight">
              {t('topDonatorsTitle')}
            </h2>
          </div>
          <p className="text-2xl md:text-3xl text-purple-300 font-bold mb-4 tracking-wide">
            {t('topDonatorsSubtitle')}
          </p>
          <p className="text-white text-lg md:text-xl max-w-5xl mx-auto leading-relaxed mb-6">
            {t('topDonatorsDescription')}
          </p>
          <div className="bg-green-900/30 backdrop-blur rounded-xl p-4 max-w-4xl mx-auto border border-green-400/20">
            <p className="text-green-300 font-medium text-sm">
              ✅ {t('loyaltyNotGambling')}
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-16">
          {/* Live Leaderboard */}
          <div className="xl:col-span-2 bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur rounded-2xl p-8 border border-purple-400/20 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl md:text-3xl font-bold text-purple-400 flex items-center space-x-3">
                <span>👑</span>
                <span>{t('topClientsLeaderboard')}</span>
              </h3>
              <div className="bg-purple-500/20 backdrop-blur rounded-lg px-4 py-2">
                <span className="text-purple-300 font-bold text-sm">{t('currentMonth')}</span>
              </div>
            </div>
            
            {/* Leaderboard Table */}
            <div className="space-y-3">
              {mockTopDonators.map((donator) => (
                <div 
                  key={donator.rank}
                  className={`flex items-center justify-between p-4 rounded-xl transition-all hover:scale-105 ${
                    donator.rank <= 3 
                      ? 'bg-gradient-to-r from-yellow-600/20 to-purple-600/20 border-2 border-yellow-400/40 shadow-lg' 
                      : 'bg-gray-700/40 border border-gray-600/30'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <span className={`font-bold text-xl w-8 text-center ${
                        donator.rank === 1 ? 'text-yellow-400' : 
                        donator.rank === 2 ? 'text-gray-300' : 
                        donator.rank === 3 ? 'text-amber-500' : 'text-gray-400'
                      }`}>
                        #{donator.rank}
                      </span>
                      <span className="text-2xl">{donator.avatar}</span>
                    </div>
                    <div>
                      <p className="text-white font-bold text-lg">{donator.username}</p>
                      <p className="text-gray-400 text-sm">{donator.creditsSpent.toLocaleString()} {t('creditsSpent').toLowerCase()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-lg ${donator.rank <= 3 ? 'text-green-400' : 'text-gray-400'}`}>
                      {donator.potentialCashback}
                    </p>
                    <p className={`text-sm font-medium ${donator.rank <= 3 ? 'text-purple-400' : 'text-gray-500'}`}>
                      {donator.percentage}% {t('rewardsPool').toLowerCase()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reward Distribution */}
          <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur rounded-2xl p-8 border border-purple-400/20 shadow-2xl">
            <h3 className="text-2xl font-bold text-purple-400 mb-8 flex items-center space-x-3">
              <span>💰</span>
              <span>{t('rewardDistribution')}</span>
            </h3>
            
            <div className="mb-8">
              <div className="bg-purple-500/20 backdrop-blur rounded-xl p-6 border border-purple-400/30">
                <h4 className="text-lg font-bold text-white mb-2">{t('monthlyRewardsPool')}</h4>
                <p className="text-3xl font-bold text-yellow-400">50%</p>
                <p className="text-purple-300 text-sm">{t('ofGiftRevenue')}</p>
              </div>
            </div>

            <div className="space-y-3">
              {rewardPercentages.map((tier) => (
                <div 
                  key={tier.rank}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    tier.rank <= 3 
                      ? 'bg-gradient-to-r from-yellow-600/20 to-purple-600/20 border border-yellow-400/30' 
                      : 'bg-gray-700/30'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className={`font-bold text-lg ${
                      tier.rank === 1 ? 'text-yellow-400' : 
                      tier.rank === 2 ? 'text-gray-300' : 
                      tier.rank === 3 ? 'text-amber-500' : 'text-gray-400'
                    }`}>
                      #{tier.rank}
                    </span>
                  </div>
                  <span className={`font-bold text-lg ${tier.rank <= 3 ? 'text-green-400' : 'text-gray-400'}`}>
                    {tier.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* How it Works */}
        <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur rounded-2xl p-8 border border-purple-400/20 shadow-2xl mb-16">
          <h3 className="text-2xl md:text-3xl font-bold text-purple-400 mb-8 flex items-center space-x-3">
            <span>⚡</span>
            <span>{t('howItWorksClients')}</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-purple-500/20 backdrop-blur rounded-xl p-6 border border-purple-400/30">
              <div className="text-3xl mb-4">🎁</div>
              <p className="text-white font-medium">{t('spendCreditsOnGifts')}</p>
            </div>
            <div className="bg-blue-500/20 backdrop-blur rounded-xl p-6 border border-blue-400/30">
              <div className="text-3xl mb-4">📊</div>
              <p className="text-white font-medium">{t('earnRankingPoints')}</p>
            </div>
            <div className="bg-green-500/20 backdrop-blur rounded-xl p-6 border border-green-400/30">
              <div className="text-3xl mb-4">💰</div>
              <p className="text-white font-medium">{t('top10Share')}</p>
            </div>
            <div className="bg-yellow-500/20 backdrop-blur rounded-xl p-6 border border-yellow-400/30">
              <div className="text-3xl mb-4">🔄</div>
              <p className="text-white font-medium">{t('automaticRewards')}</p>
            </div>
            <div className="bg-pink-500/20 backdrop-blur rounded-xl p-6 border border-pink-400/30">
              <div className="text-3xl mb-4">🗓️</div>
              <p className="text-white font-medium">{t('newChanceMonthly')}</p>
            </div>
            <div className="bg-purple-500/20 backdrop-blur rounded-xl p-6 border border-purple-400/30">
              <div className="text-3xl mb-4">🏆</div>
              <p className="text-white font-medium">{t('joinLoyaltyProgram')}</p>
            </div>
          </div>
        </div>

        {/* Past Winners */}
        <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur rounded-2xl p-8 border border-purple-400/20 shadow-2xl">
          <h3 className="text-2xl md:text-3xl font-bold text-purple-400 mb-8 flex items-center space-x-3">
            <span>🏅</span>
            <span>{t('pastWinners')}</span>
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {Object.entries(mockPastWinners).map(([month, winners]) => (
              <div key={month} className="bg-gray-700/40 backdrop-blur rounded-xl p-6 border border-gray-600/30">
                <h4 className="text-lg font-bold text-white mb-4 text-center">{month}</h4>
                <div className="space-y-3">
                  {winners.slice(0, 3).map((winner) => (
                    <div 
                      key={winner.rank}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        winner.rank === 1 ? 'bg-yellow-600/20 border border-yellow-400/30' :
                        winner.rank === 2 ? 'bg-gray-600/20 border border-gray-400/30' :
                        'bg-amber-600/20 border border-amber-400/30'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span className={`font-bold text-sm ${
                          winner.rank === 1 ? 'text-yellow-400' :
                          winner.rank === 2 ? 'text-gray-300' :
                          'text-amber-500'
                        }`}>
                          #{winner.rank}
                        </span>
                        <div>
                          <p className="text-white font-medium text-sm">{winner.username}</p>
                          <p className="text-gray-400 text-xs">{winner.creditsSpent.toLocaleString()} credits</p>
                        </div>
                      </div>
                      <span className="text-green-400 font-bold text-sm">{winner.reward}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export const MonthlyRewardsSection = () => {
  const { t } = useLanguage();
  
  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 py-20 relative overflow-hidden">
      {/* Background decoration */}
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
              {t('rewardsTitle')}
            </h2>
          </div>
          <p className="text-2xl md:text-3xl text-yellow-400 font-bold mb-4 tracking-wide">
            {t('earnMonthly')}
          </p>
          <p className="text-white text-lg md:text-xl max-w-5xl mx-auto leading-relaxed">
            {t('rewardsSubtitle')}
          </p>
          <p className="text-yellow-300 text-lg md:text-xl font-medium mt-4 max-w-4xl mx-auto">
            👉 {t('moreActive')}
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
                  <span className="font-bold text-yellow-400">Earn 1 point</span> for each €1 invested (activation + repost credits)
                </p>
              </div>
              <div className="flex items-start space-x-4 p-4 bg-gray-700/30 rounded-xl border border-green-400/20">
                <span className="text-green-400 font-bold text-xl">✅</span>
                <p className="text-white text-lg">
                  <span className="font-bold text-yellow-400">Compete for the Top 3</span> every month:
                </p>
              </div>
            </div>

            {/* Prizes */}
            <div className="mt-10 space-y-4">
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-xl p-6 flex items-center space-x-6 shadow-lg transform hover:scale-105 transition-all">
                <span className="text-4xl">🥇</span>
                <div>
                  <p className="text-black font-bold text-xl">1st Place</p>
                  <p className="text-black font-bold text-lg">7% CASH-BACK on total invested</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-gray-300 to-gray-200 rounded-xl p-6 flex items-center space-x-6 shadow-lg transform hover:scale-105 transition-all">
                <span className="text-4xl">🥈</span>
                <div>
                  <p className="text-black font-bold text-xl">2nd Place</p>
                  <p className="text-black font-bold text-lg">2% CASH-BACK</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-amber-500 to-amber-400 rounded-xl p-6 flex items-center space-x-6 shadow-lg transform hover:scale-105 transition-all">
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
              <span>Live Leaderboard</span>
            </h3>
            <div className="space-y-4">
              {mockLeaderboard.slice(0, 8).map((user) => (
                <div 
                  key={user.rank}
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
                      <p className="text-white font-bold text-lg">{user.name}</p>
                      <p className="text-gray-400 text-sm">{user.points} points • €{user.invested} invested</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-lg ${user.rank <= 3 ? 'text-green-400' : 'text-gray-400'}`}>
                      {user.earnings}
                    </p>
                    <p className={`text-sm font-medium ${user.rank <= 3 ? 'text-yellow-400' : 'text-gray-500'}`}>
                      {user.cashback}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur rounded-2xl p-8 border border-yellow-400/20 shadow-2xl max-w-5xl mx-auto">
            <div className="space-y-4 mb-8">
              <p className="text-white text-lg">
                <span className="font-bold text-yellow-400">Leaderboard resets monthly</span> → New chances to win every month!
              </p>
              <p className="text-white text-lg">
                Track your points in real-time and see the live leaderboard.
              </p>
              <p className="text-yellow-300 font-medium text-lg">
                <span className="font-bold">TIP:</span> The more you repost and stay active, the more points you earn — and the closer you are to the Top 3!
              </p>
            </div>
            <button className="bg-gradient-to-r from-red-500 to-red-600 text-white px-12 py-4 rounded-xl font-bold text-lg hover:from-red-600 hover:to-red-700 transition-all transform hover:scale-105 shadow-xl uppercase tracking-wide">
              🔴 Join the Monthly Rewards Program now and start earning real money every month!
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
  const { t } = useLanguage();
  
  return (
    <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-purple-700 py-20 relative overflow-hidden">
      {/* Background decoration */}
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

        {/* Popular Destinations */}
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
  const [isReposting, setIsReposting] = useState(false);
  const [showRepostSuccess, setShowRepostSuccess] = useState(false);

  const handleRepost = async () => {
    setIsReposting(true);
    // Simulate API call
    setTimeout(() => {
      setIsReposting(false);
      setShowRepostSuccess(true);
      setTimeout(() => setShowRepostSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow profile-card">
      {/* Repost Success Message */}
      {showRepostSuccess && (
        <div className="absolute top-0 left-0 right-0 bg-green-500 text-white text-center py-2 z-10 rounded-t-lg">
          ✅ Ad reposted successfully! Now appears on top to attract more clients!
        </div>
      )}
      
      <div className="relative">
        <img 
          src={profile.image} 
          alt={profile.name}
          className="w-full h-64 object-cover"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {profile.vip && (
            <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold vip-badge">VIP</span>
          )}
          {profile.verified && (
            <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold verified-badge">VERIFIED</span>
          )}
          {profile.hasVideos && (
            <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold video-badge">VIDEO</span>
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

        {/* Repost Info */}
        <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
          Last repost: {profile.lastRepost}
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
        
        <p className="text-sm text-green-600 mb-2">{profile.availability}</p>
        
        {/* Repost Stats */}
        <div className="flex justify-between items-center mb-3 text-xs text-gray-500">
          <span>Reposts: {profile.repostCount}</span>
          <span>Points earned: {(profile.repostCount * 2) + 25}</span>
        </div>
        
        <p className="text-sm text-gray-700 mb-4">
          Intellectual companion who loves art, history and meaningful conversations. Perfect for dinner and city exploration.
        </p>
        
        {/* Action Buttons */}
        <div className="space-y-2">
          <button className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-2 rounded-lg font-semibold hover:from-pink-600 hover:to-pink-700 transition-all">
            View Details
          </button>
          
          {/* Repost Button */}
          <button 
            onClick={handleRepost}
            disabled={isReposting}
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black py-2 rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isReposting ? (
              <>
                <div className="loading-spinner w-4 h-4"></div>
                <span>Reposting...</span>
              </>
            ) : (
              <>
                <span>🚀</span>
                <span>Repost Ad (2 Credits)</span>
              </>
            )}
          </button>
          
          <p className="text-xs text-center text-gray-500 italic">
            "Repost your ad to stay on top and attract more clients!"
          </p>
        </div>
      </div>
    </div>
  );
};

// Profile Management Component
export const ProfileManagement = ({ profile }) => {
  const [credits, setCredits] = useState(45);
  const [repostHistory, setRepostHistory] = useState([
    { date: '2025-06-11 14:30', cost: 2, status: 'Success' },
    { date: '2025-06-11 10:15', cost: 2, status: 'Success' },
    { date: '2025-06-10 16:45', cost: 2, status: 'Success' },
    { date: '2025-06-10 09:20', cost: 2, status: 'Success' }
  ]);
  const [monthlyPoints, setMonthlyPoints] = useState(267);
  const [isReposting, setIsReposting] = useState(false);

  const handleRepost = async () => {
    if (credits < 2) {
      alert('Insufficient credits! Please top up your account.');
      return;
    }
    
    setIsReposting(true);
    setTimeout(() => {
      setCredits(prev => prev - 2);
      setMonthlyPoints(prev => prev + 2);
      setRepostHistory(prev => [
        { date: new Date().toLocaleString(), cost: 2, status: 'Success' },
        ...prev
      ]);
      setIsReposting(false);
      alert('✅ Ad reposted successfully! Your profile is now on top!');
    }, 1500);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="border-b border-gray-200 pb-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Management</h2>
        <p className="text-gray-600">{profile.name} - {profile.location}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Credits Balance */}
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-2xl">💰</span>
            <h3 className="font-semibold text-gray-900">Credits Balance</h3>
          </div>
          <p className="text-3xl font-bold text-yellow-600">{credits}</p>
          <p className="text-sm text-gray-600">Available credits</p>
          <button className="mt-2 bg-yellow-500 text-white px-4 py-2 rounded text-sm font-medium hover:bg-yellow-600 transition-colors">
            Top Up Credits
          </button>
        </div>

        {/* Monthly Points */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-2xl">🏆</span>
            <h3 className="font-semibold text-gray-900">Monthly Points</h3>
          </div>
          <p className="text-3xl font-bold text-purple-600">{monthlyPoints}</p>
          <p className="text-sm text-gray-600">Current ranking: #12</p>
          <p className="text-xs text-gray-500 mt-1">1€ spent = 1 point earned</p>
        </div>

        {/* Quick Stats */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-2xl">📊</span>
            <h3 className="font-semibold text-gray-900">This Month</h3>
          </div>
          <p className="text-lg font-semibold text-green-600">{profile.repostCount} reposts</p>
          <p className="text-sm text-gray-600">€{profile.repostCount * 2} invested</p>
          <p className="text-xs text-gray-500 mt-1">Last repost: {profile.lastRepost}</p>
        </div>
      </div>

      {/* Repost Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-6 border border-blue-200 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
              <span>🚀</span>
              <span>Repost Your Ad</span>
            </h3>
            <p className="text-gray-600 mt-1">Move your profile to the top of search results</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600">2 Credits</p>
            <p className="text-sm text-gray-500">per repost</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-blue-200 mb-4">
          <p className="text-sm text-gray-700 mb-2">
            <span className="font-semibold text-blue-600">"Repost your ad to stay on top and attract more clients!"</span>
          </p>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Your profile moves to the first page of listings</li>
            <li>• Increases visibility and booking chances</li>
            <li>• Earns 2 points towards Monthly Rewards Program</li>
            <li>• No limit on repost frequency</li>
          </ul>
        </div>

        <button 
          onClick={handleRepost}
          disabled={isReposting || credits < 2}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-bold text-lg hover:from-blue-600 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isReposting ? (
            <>
              <div className="loading-spinner w-5 h-5"></div>
              <span>Reposting...</span>
            </>
          ) : (
            <>
              <span>🚀</span>
              <span>Repost Now - 2 Credits</span>
            </>
          )}
        </button>
        
        {credits < 2 && (
          <p className="text-red-600 text-sm mt-2 text-center">
            Insufficient credits. Please top up your account to continue reposting.
          </p>
        )}
      </div>

      {/* Repost History */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <span>📝</span>
          <span>Repost History</span>
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 text-sm font-semibold text-gray-700">Date & Time</th>
                <th className="text-left py-2 text-sm font-semibold text-gray-700">Cost</th>
                <th className="text-left py-2 text-sm font-semibold text-gray-700">Points Earned</th>
                <th className="text-left py-2 text-sm font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {repostHistory.map((entry, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-2 text-sm text-gray-600">{entry.date}</td>
                  <td className="py-2 text-sm text-gray-600">{entry.cost} credits</td>
                  <td className="py-2 text-sm text-purple-600 font-medium">+{entry.cost} points</td>
                  <td className="py-2">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                      {entry.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
// Main Content Area
export const MainContent = ({ selectedCountry, selectedCity, onProfileManagementClick }) => {
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
          <button 
            onClick={onProfileManagementClick}
            className="hover:bg-red-600 px-4 py-2 rounded transition-colors ml-auto bg-yellow-500 text-black font-bold"
          >
            🔧 Manage Profile
          </button>
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
            <div className="flex items-center space-x-3 mb-4">
              {/* EUROLOVE Logo Image */}
              <img 
                src="https://i.imgur.com/YourImageURL.jpg" 
                alt="EUROLOVE Logo"
                className="w-10 h-10 rounded-full object-cover border-2 border-yellow-400"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              {/* Fallback golden heart logo */}
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center border-2 border-yellow-400" style={{display: 'none'}}>
                <span className="text-black font-bold text-sm">♥</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                EUROLOVE
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-2 font-light tracking-wide">
              INTIMACY, SCULPTED IN LUXURY
            </p>
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