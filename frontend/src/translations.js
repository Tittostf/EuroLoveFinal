import React, { createContext, useContext, useState, useEffect } from 'react';

// Language Context
const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('ro'); // Default to Romanian

  // Detect user's location/language preference
  useEffect(() => {
    const detectLanguage = () => {
      const saved = localStorage.getItem('eurolove_language');
      if (saved) {
        setLanguage(saved);
        return;
      }
      
      // Try to detect if user is from Romania
      const userLang = navigator.language || navigator.userLanguage;
      if (userLang.startsWith('ro')) {
        setLanguage('ro');
      } else {
        setLanguage('en');
      }
    };
    
    detectLanguage();
  }, []);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('eurolove_language', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Complete translations object
export const translations = {
  en: {
    // Header & Navigation
    vipEscorts: "VIP Escorts",
    girls: "Girls",
    pornstars: "Pornstars", 
    cityTour: "City Tour",
    agencies: "Agencies",
    videos: "Videos",
    reviews: "Reviews",
    login: "LOGIN",
    register: "REGISTER",
    
    // Hero Section
    heroTitle: "Premium Escort Directory",
    heroSubtitle: "Discover sophisticated companions across Europe's finest cities",
    searchPlaceholder: "Search for escorts or services...",
    allLocations: "All Locations",
    searchNow: "SEARCH NOW",
    popularDestinations: "Popular Destinations",
    
    // Monthly Rewards Program
    lunarContest: "LUNAR UNIQUE CONTEST",
    euroloveBrand: "EUROLOVE",
    contestText1: "EARN 10% CASH-BACK FROM TOTAL ESCORT SUBSCRIPTIONS!",
    contestText2: "EVERY MONTH, 3 PEOPLE RECEIVE THE REWARD.",
    contestText3: "ACTIVATE YOUR PROFILE AND JOIN THE RACE TODAY!",
    contestText4: "THE MORE SUBSCRIPTIONS IN TOTAL, THE HIGHER THE CASH-BACK AMOUNT GRANTED.",
    participateNow: "PARTICIPATE NOW!",
    
    rewardsTitle: "EUROLOVE Official Monthly Rewards Program",
    earnMonthly: "Earn Every Month!",
    rewardsSubtitle: "Turn your monthly activity on EUROLOVE into real cash with our Official Monthly Rewards Program.",
    moreActive: "The more active you are, the more you earn — simple, transparent, and PROFITABLE.",
    
    howItWorks: "How it works:",
    activateAccount: "Activate your account monthly (€25 activation required)",
    topUpCredits: "Top up at least €5 in reposting credits",
    earnPoints: "Every €1 invested on the platform = 1 point. All revenue sources are included:",
    revenueSource1: "Monthly subscriptions",
    revenueSource2: "Reposting of ads",
    revenueSource3: "Purchase of advertising banners", 
    revenueSource4: "VIP subscriptions",
    revenueSource5: "Any other euro invested on the platform",
    competeTop3: "At the end of each month, the Top 3 escorts will SHARE 10% of the platform's TOTAL REVENUE for that month, distributed as follows:",
    
    firstPlace: "1st Place",
    secondPlace: "2nd Place", 
    thirdPlace: "3rd Place",
    firstPlaceReward: "7% of total revenue",
    secondPlaceReward: "2% of total revenue",
    thirdPlaceReward: "1% of total revenue",
    
    leaderboardResets: "The leaderboard resets monthly → new chances to win every month!",
    trackPoints: "Track your points in real-time and see the live leaderboard.",
    tipText: "TIP: The more you repost and stay active, the more points you earn — and the closer you are to the Top 3!",
    
    exampleTitle: "Example: If the platform generates €150,000 in one month (from all revenue sources):",
    exampleFirst: "1st Place → €10,500",
    exampleSecond: "2nd Place → €3,000", 
    exampleThird: "3rd Place → €1,500",
    
    joinProgram: "Join the Official Monthly Rewards Program NOW and start earning real money!",
    liveLeaderboard: "Live Leaderboard",
    
    // Profile Management
    profileManagement: "Profile Management",
    creditsBalance: "Credits Balance",
    monthlyPoints: "Monthly Points",
    thisMonth: "This Month",
    availableCredits: "Available credits",
    currentRanking: "Current ranking:",
    topUpCreditsBtn: "Top Up Credits",
    reposts: "reposts",
    invested: "invested",
    lastRepost: "Last repost:",
    
    // Repost Feature
    repostAd: "Repost Your Ad",
    repostNow: "REPOST NOW",
    repostHistory: "Repost History",
    repostMessage: "Repost your ad to stay on top and attract more clients!",
    repostSuccess: "Ad reposted successfully! Now appears on top to attract more clients!",
    repostButton: "🚀 Repost Ad (2 Credits)",
    reposting: "Reposting...",
    moveToTop: "Move your profile to the top of search results",
    creditsPerRepost: "2 Credits",
    perRepost: "per repost",
    repostBenefits: [
      "Your profile moves to the first page of listings",
      "Increases visibility and booking chances", 
      "Earns 2 points towards Monthly Rewards Program",
      "No limit on repost frequency"
    ],
    insufficientCredits: "Insufficient credits. Please top up your account to continue reposting.",
    
    // Table Headers
    dateTime: "Date & Time",
    cost: "Cost",
    pointsEarned: "Points Earned",
    status: "Status",
    success: "Success",
    credits: "credits",
    points: "points",
    
    // Profile Card
    viewDetails: "View Details",
    age: "Age:",
    available: "Available",
    today: "Today",
    tomorrow: "Tomorrow",
    thisWeek: "This Week",
    
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
    contact: "Contact",
    allRightsReserved: "All rights reserved.",
    
    // Filter & Search
    companionsFound: "companions found",
    clearAll: "Clear All",
    recentlyReviewed: "Recently Reviewed",
    withReviews: "WITH REVIEWS",
    verified: "VERIFIED",
    newcomers: "NEWCOMERS", 
    withVideos: "WITH VIDEOS",
    pornstar: "PORNSTAR",
    independent: "INDEPENDENT",
    seenLastWeek: "SEEN LAST WEEK",
    duoWithGirl: "DUO WITH GIRL",
    couple: "COUPLE"
  },
  
  ro: {
    // Header & Navigation
    vipEscorts: "Escorte VIP",
    girls: "Fete",
    pornstars: "Vedete Porno",
    cityTour: "Tur Oraș", 
    agencies: "Agenții",
    videos: "Videouri",
    reviews: "Recenzii",
    login: "CONECTARE",
    register: "ÎNREGISTRARE",
    
    // Hero Section
    heroTitle: "Director Premium de Escorte",
    heroSubtitle: "Descoperă companioni sofisticați în cele mai rafinate orașe din Europa",
    searchPlaceholder: "Caută escorte sau servicii...",
    allLocations: "Toate Locațiile",
    searchNow: "CAUTĂ ACUM",
    popularDestinations: "Destinații Populare",
    
    // Monthly Rewards Program
    lunarContest: "CONCURS LUNAR UNIC",
    euroloveBrand: "EUROLOVE", 
    contestText1: "CÂȘTIGĂ 10% CASH-BACK DIN TOTALUL ABONAMENTELOR ESCORTELOR!",
    contestText2: "ÎN FIECARE LUNĂ, 3 PERSOANE PRIMESC RECOMPENSA.",
    contestText3: "ACTIVEAZĂ-ȚI PROFILUL ȘI INTRĂ ÎN CURSĂ CHIAR AZI!",
    contestText4: "CU CÂT MAI MULTE ABONAMENTE PER TOTAL CU ATÂT MAI MARE ESTE SUMA CASH-BACK ACORDATĂ.",
    participateNow: "PARTICIPĂ ACUM!",
    
    rewardsTitle: "Programul Oficial de Recompensă EUROLOVE",
    earnMonthly: "Câștigă în fiecare lună!",
    rewardsSubtitle: "Transformă activitatea ta lunară pe EUROLOVE în bani reali cu Programul Oficial de Recompensă Lunară.",
    moreActive: "Cu cât ești mai activă, cu atât câștigi mai mult — simplu, transparent și PROFITABIL.",
    
    howItWorks: "Cum funcționează:",
    activateAccount: "Activează-ți contul lunar (25€ activare obligatorie)",
    topUpCredits: "Încarcă minimum 5€ în credite pentru repostări",
    earnPoints: "Fiecare 1€ investit pe platformă = 1 punct. Se contorizează toate veniturile:",
    revenueSource1: "Abonamente lunare",
    revenueSource2: "Repostări ale anunțurilor",
    revenueSource3: "Achiziționarea de bannere publicitare",
    revenueSource4: "Abonamente VIP", 
    revenueSource5: "Orice alt euro investit pe platformă",
    competeTop3: "La finalul fiecărei luni, cele 3 escorte de top câștigă ÎMPREUNĂ 10% din TOTALUL veniturilor platformei în luna respectivă, repartizat astfel:",
    
    firstPlace: "Locul 1",
    secondPlace: "Locul 2",
    thirdPlace: "Locul 3", 
    firstPlaceReward: "7% din total venituri",
    secondPlaceReward: "2% din total venituri",
    thirdPlaceReward: "1% din total venituri",
    
    leaderboardResets: "Clasamentul se resetează lunar → fiecare lună oferă o nouă șansă de a câștiga!",
    trackPoints: "Vezi punctele tale în timp real și urmărește live clasamentul actualizat.",
    tipText: "SFAT: Cu cât repostezi mai mult și rămâi activă, cu atât câștigi mai multe puncte — și cu atât ești mai aproape de Top 3!",
    
    exampleTitle: "Exemplu: Dacă platforma generează 150.000€ într-o lună (toate sursele incluse):",
    exampleFirst: "Locul 1 → 10.500€",
    exampleSecond: "Locul 2 → 3.000€",
    exampleThird: "Locul 3 → 1.500€",
    
    joinProgram: "Participă ACUM în Programul Oficial de Recompensă Lunară și câștigă bani reali!",
    liveLeaderboard: "Clasament Live",
    
    // Profile Management
    profileManagement: "Gestionare Profil",
    creditsBalance: "Sold Credite",
    monthlyPoints: "Puncte Lunare",
    thisMonth: "Luna Aceasta",
    availableCredits: "Credite disponibile",
    currentRanking: "Clasament curent:",
    topUpCreditsBtn: "Încarcă Credite",
    reposts: "repostări",
    invested: "investiți",
    lastRepost: "Ultima repostare:",
    
    // Repost Feature
    repostAd: "Repostează Anunțul",
    repostNow: "REPOSTEAZĂ ACUM",
    repostHistory: "Istoric Repostări",
    repostMessage: "Repostează anunțul pentru a urca pe primele pagini și a atrage mai mulți clienți!",
    repostSuccess: "Anunț repostat cu succes! Acum apare în top pentru a atrage mai mulți clienți!",
    repostButton: "🚀 Repostează Anunțul (2 Credite)",
    reposting: "Se repostează...",
    moveToTop: "Mută profilul tău în vârful rezultatelor de căutare",
    creditsPerRepost: "2 Credite",
    perRepost: "per repostare",
    repostBenefits: [
      "Profilul tău se mută pe prima pagină a listărilor",
      "Crește vizibilitatea și șansele de rezervare",
      "Câștigi 2 puncte către Programul de Recompense Lunare",
      "Fără limită la frecvența repostărilor"
    ],
    insufficientCredits: "Credite insuficiente. Te rugăm să îți încarci contul pentru a continua repostările.",
    
    // Table Headers
    dateTime: "Data & Ora",
    cost: "Cost",
    pointsEarned: "Puncte Câștigate",
    status: "Status",
    success: "Succes",
    credits: "credite",
    points: "puncte",
    
    // Profile Card
    viewDetails: "Vezi Detaliile",
    age: "Vârsta:",
    available: "Disponibilă",
    today: "Azi",
    tomorrow: "Mâine", 
    thisWeek: "Săptămâna aceasta",
    
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
    contact: "Contact",
    allRightsReserved: "Toate drepturile rezervate.",
    
    // Filter & Search
    companionsFound: "companioni găsiți",
    clearAll: "Șterge Tot",
    recentlyReviewed: "Recent Recenzați",
    withReviews: "CU RECENZII",
    verified: "VERIFICATE",
    newcomers: "NOI VENITE",
    withVideos: "CU VIDEOURI", 
    pornstar: "VEDETĂ PORNO",
    independent: "INDEPENDENTE",
    seenLastWeek: "VĂZUTE SĂPT. TRECUTĂ",
    duoWithGirl: "DUO CU FATĂ",
    couple: "CUPLU"
  }
};

// Translation hook
export const useTranslation = () => {
  const { language } = useLanguage();
  
  const t = (key) => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };
  
  return { t, language };
};