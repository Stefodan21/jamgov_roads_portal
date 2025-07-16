import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import AuthenticationCard from './components/AuthenticationCard';
import SecurityIndicators from './components/SecurityIndicators';
import JamaicanBackground from './components/JamaicanBackground';
import GovernmentHeader from './components/GovernmentHeader';

const CitizenLoginRegistration = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [currentLanguage, setCurrentLanguage] = useState('en');

  // Load saved language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('jamgov-language');
    if (savedLanguage && ['en', 'jm'].includes(savedLanguage)) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  // Save language preference
  const handleLanguageChange = (language) => {
    setCurrentLanguage(language);
    localStorage.setItem('jamgov-language', language);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
      <Helmet>
        <title>Citizen Login & Registration - JamGov Roads Portal</title>
        <meta 
          name="description" 
          content="Secure access to Jamaica's government services. Login or register for road permits, construction licenses, and infrastructure services through our official portal." 
        />
        <meta name="keywords" content="Jamaica government, citizen login, road permits, construction licenses, JamGov portal" />
        <meta property="og:title" content="Citizen Login & Registration - JamGov Roads Portal" />
        <meta property="og:description" content="Official Jamaica government portal for road and infrastructure services" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="/citizen-login-registration" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Jamaican Background Pattern */}
        <JamaicanBackground />

        {/* Main Content */}
        <div className="relative z-10 min-h-screen flex flex-col">
          {/* Header Section */}
          <div className="flex-shrink-0 pt-8 pb-4 px-4">
            <GovernmentHeader currentLanguage={currentLanguage} />
          </div>

          {/* Authentication Section */}
          <div className="flex-1 flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md">
              <AuthenticationCard
                activeTab={activeTab}
                onTabChange={handleTabChange}
                currentLanguage={currentLanguage}
                onLanguageChange={handleLanguageChange}
              />
              
              <SecurityIndicators currentLanguage={currentLanguage} />
            </div>
          </div>

          {/* Footer */}
          <footer className="flex-shrink-0 py-6 px-4 border-t border-border bg-card/50 backdrop-blur-sm">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                <div className="text-center sm:text-left">
                  <p className="text-xs text-muted-foreground">
                    © {new Date().getFullYear()} Government of Jamaica. All rights reserved.
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Ministry of Economic Growth and Job Creation
                  </p>
                </div>
                
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <a 
                    href="#" 
                    className="hover:text-foreground transition-colors"
                    onClick={(e) => e.preventDefault()}
                  >
                    Privacy Policy
                  </a>
                  <span>•</span>
                  <a 
                    href="#" 
                    className="hover:text-foreground transition-colors"
                    onClick={(e) => e.preventDefault()}
                  >
                    Terms of Service
                  </a>
                  <span>•</span>
                  <a 
                    href="#" 
                    className="hover:text-foreground transition-colors"
                    onClick={(e) => e.preventDefault()}
                  >
                    Accessibility
                  </a>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <span>Emergency Services: 119</span>
                    <span>•</span>
                    <span>Citizen Support: 1-888-JAMGOV</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <span>Powered by</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-primary rounded-full" />
                      <span className="font-medium">JamGov Digital</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};

export default CitizenLoginRegistration;