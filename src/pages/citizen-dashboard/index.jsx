import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import QuickActionTiles from './components/QuickActionTiles';
import MyApplicationsSection from './components/MyApplicationsSection';
import AnnouncementsSidebar from './components/AnnouncementsSidebar';
import PersonalAnalytics from './components/PersonalAnalytics';
import NotificationCenter from './components/NotificationCenter';

const CitizenDashboard = () => {
  const [currentLanguage, setCurrentLanguage] = useState('english');
  const [activeTab, setActiveTab] = useState('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();

  // Check localStorage for saved language preference on load
  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  // Save language preference to localStorage
  useEffect(() => {
    localStorage.setItem('selectedLanguage', currentLanguage);
  }, [currentLanguage]);

  const dashboardTabs = [
    {
      id: 'overview',
      label: {
        english: 'Overview',
        patois: 'Overview'
      },
      icon: 'Home'
    },
    {
      id: 'applications',
      label: {
        english: 'My Applications',
        patois: 'Mi Applications'
      },
      icon: 'FileText'
    },
    {
      id: 'analytics',
      label: {
        english: 'Analytics',
        patois: 'Analytics'
      },
      icon: 'BarChart3'
    },
    {
      id: 'notifications',
      label: {
        english: 'Notifications',
        patois: 'Notifications'
      },
      icon: 'Bell'
    }
  ];

  const welcomeMessage = {
    english: {
      greeting: 'Welcome back, Marcus',
      subtitle: 'Manage your government services and track applications',
      lastLogin: 'Last login: Today at 2:30 PM'
    },
    patois: {
      greeting: 'Welcome back, Marcus',
      subtitle: 'Manage yuh government services and track applications',
      lastLogin: 'Last login: Today at 2:30 PM'
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const handleLanguageToggle = () => {
    const newLanguage = currentLanguage === 'english' ? 'patois' : 'english';
    setCurrentLanguage(newLanguage);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'applications':
        return <MyApplicationsSection />;
      case 'analytics':
        return <PersonalAnalytics />;
      case 'notifications':
        return <NotificationCenter />;
      default:
        return (
          <div className="space-y-8">
            {/* Quick Actions */}
            <div>
              <h2 className="text-xl font-heading font-semibold text-foreground mb-4">
                {currentLanguage === 'english' ? 'Quick Actions' : 'Quick Actions'}
              </h2>
              <QuickActionTiles />
            </div>

            {/* Recent Applications */}
            <MyApplicationsSection />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="w-full">
        <div className="px-4 lg:px-6 py-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">
                  {welcomeMessage[currentLanguage].greeting}
                </h1>
                <p className="text-muted-foreground mt-1">
                  {welcomeMessage[currentLanguage].subtitle}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {welcomeMessage[currentLanguage].lastLogin}
                </p>
              </div>

              <div className="flex items-center space-x-3">
                {/* Language Toggle */}
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Languages"
                  iconPosition="left"
                  iconSize={16}
                  onClick={handleLanguageToggle}
                >
                  {currentLanguage === 'english' ? 'Patois' : 'English'}
                </Button>

                {/* Refresh Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="RefreshCw"
                  iconSize={16}
                  loading={isRefreshing}
                  onClick={handleRefresh}
                  className={isRefreshing ? 'animate-spin' : ''}
                />

                {/* Emergency Contact */}
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Phone"
                  iconPosition="left"
                  iconSize={16}
                  className="text-error border-error hover:bg-error/10"
                >
                  {currentLanguage === 'english' ? 'Emergency' : 'Emergency'}
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Main Content Area */}
            <div className="xl:col-span-3">
              {/* Tab Navigation */}
              <div className="mb-6">
                <div className="flex space-x-1 overflow-x-auto pb-2">
                  {dashboardTabs.map((tab) => (
                    <Button
                      key={tab.id}
                      variant={activeTab === tab.id ? "default" : "ghost"}
                      size="sm"
                      iconName={tab.icon}
                      iconPosition="left"
                      iconSize={16}
                      onClick={() => setActiveTab(tab.id)}
                      className="whitespace-nowrap"
                    >
                      {tab.label[currentLanguage]}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="animate-fade-in">
                {renderTabContent()}
              </div>
            </div>

            {/* Sidebar */}
            <div className="xl:col-span-1">
              <div className="sticky top-24 space-y-6">
                <AnnouncementsSidebar />
                
                {/* Quick Stats Card */}
                <div className="bg-card border border-border rounded-lg p-4">
                  <h3 className="text-base font-heading font-semibold text-foreground mb-4">
                    {currentLanguage === 'english' ? 'Quick Stats' : 'Quick Stats'}
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {currentLanguage === 'english' ? 'Active Applications' : 'Active Applications'}
                      </span>
                      <span className="text-sm font-medium text-foreground">2</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {currentLanguage === 'english' ? 'Completed This Month' : 'Completed This Month'}
                      </span>
                      <span className="text-sm font-medium text-foreground">3</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {currentLanguage === 'english' ? 'Success Rate' : 'Success Rate'}
                      </span>
                      <span className="text-sm font-medium text-success">83%</span>
                    </div>
                  </div>
                </div>

                {/* Support Card */}
                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-border rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Icon name="HelpCircle" size={20} className="text-primary" />
                    <h3 className="text-base font-heading font-semibold text-foreground">
                      {currentLanguage === 'english' ? 'Need Help?' : 'Need Help?'}
                    </h3>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4">
                    {currentLanguage === 'english' ?'Get assistance with your applications or learn about our services.' :'Get assistance wid yuh applications or learn bout wi services.'
                    }
                  </p>
                  
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="MessageCircle"
                      iconPosition="left"
                      iconSize={14}
                      fullWidth
                    >
                      {currentLanguage === 'english' ? 'Live Chat' : 'Live Chat'}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="BookOpen"
                      iconPosition="left"
                      iconSize={14}
                      fullWidth
                    >
                      {currentLanguage === 'english' ? 'User Guide' : 'User Guide'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenDashboard;