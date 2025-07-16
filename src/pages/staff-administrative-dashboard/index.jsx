import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';

// Import all dashboard components
import ApplicationQueueTable from './components/ApplicationQueueTable';
import PerformanceMetrics from './components/PerformanceMetrics';
import BulkProcessingTools from './components/BulkProcessingTools';
import AmandaSystemIntegration from './components/AmandaSystemIntegration';
import DocumentReviewInterface from './components/DocumentReviewInterface';
import StaffTrainingModule from './components/StaffTrainingModule';
import CommunicationCenter from './components/CommunicationCenter';
import SystemAdministrationTools from './components/SystemAdministrationTools';

const StaffAdministrativeDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedApplications, setSelectedApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [dashboardStats, setDashboardStats] = useState({});
  const [currentLanguage, setCurrentLanguage] = useState('en');

  // Language content
  const content = {
    en: {
      pageTitle: 'Staff Administrative Dashboard - JamGov Roads Portal',
      dashboardTitle: 'Staff Administrative Dashboard',
      subtitle: 'Comprehensive management interface for government operations',
      tabs: {
        overview: 'Overview',
        applications: 'Applications',
        performance: 'Performance',
        bulk: 'Bulk Processing',
        amanda: 'Amanda Integration',
        documents: 'Document Review',
        training: 'Training',
        communication: 'Communication',
        system: 'System Admin'
      },
      stats: {
        totalApplications: 'Total Applications',
        pendingReview: 'Pending Review',
        processedToday: 'Processed Today',
        avgProcessingTime: 'Avg Processing Time'
      }
    },
    jm: {
      pageTitle: 'Staff Administrative Dashboard - JamGov Roads Portal',
      dashboardTitle: 'Staff Administrative Dashboard',
      subtitle: 'Comprehensive management interface fi government operations',
      tabs: {
        overview: 'Overview',
        applications: 'Applications',
        performance: 'Performance',
        bulk: 'Bulk Processing',
        amanda: 'Amanda Integration',
        documents: 'Document Review',
        training: 'Training',
        communication: 'Communication',
        system: 'System Admin'
      },
      stats: {
        totalApplications: 'Total Applications',
        pendingReview: 'Pending Review',
        processedToday: 'Processed Today',
        avgProcessingTime: 'Avg Processing Time'
      }
    }
  };

  useEffect(() => {
    // Check for saved language preference
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    setCurrentLanguage(savedLanguage);

    // Mock dashboard statistics
    const mockStats = {
      totalApplications: 1247,
      pendingReview: 89,
      processedToday: 156,
      avgProcessingTime: '2.4 hours',
      staffProductivity: 94,
      systemUptime: 99.8,
      citizenSatisfaction: 4.6
    };
    setDashboardStats(mockStats);
  }, []);

  const handleApplicationSelect = (application) => {
    setSelectedApplication(application);
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedApplications(newSelection);
  };

  const handleLanguageChange = (language) => {
    setCurrentLanguage(language);
    localStorage.setItem('selectedLanguage', language);
  };

  const currentContent = content[currentLanguage];

  const tabConfig = [
    { id: 'overview', label: currentContent.tabs.overview, icon: 'BarChart3' },
    { id: 'applications', label: currentContent.tabs.applications, icon: 'FileText' },
    { id: 'performance', label: currentContent.tabs.performance, icon: 'TrendingUp' },
    { id: 'bulk', label: currentContent.tabs.bulk, icon: 'Layers' },
    { id: 'amanda', label: currentContent.tabs.amanda, icon: 'Database' },
    { id: 'documents', label: currentContent.tabs.documents, icon: 'Search' },
    { id: 'training', label: currentContent.tabs.training, icon: 'GraduationCap' },
    { id: 'communication', label: currentContent.tabs.communication, icon: 'MessageSquare' },
    { id: 'system', label: currentContent.tabs.system, icon: 'Settings' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon name="FileText" size={24} className="text-primary" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-heading font-bold text-foreground">
                      {dashboardStats.totalApplications?.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {currentContent.stats.totalApplications}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                    <Icon name="Clock" size={24} className="text-warning" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-heading font-bold text-foreground">
                      {dashboardStats.pendingReview}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {currentContent.stats.pendingReview}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                    <Icon name="CheckCircle" size={24} className="text-success" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-heading font-bold text-foreground">
                      {dashboardStats.processedToday}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {currentContent.stats.processedToday}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Icon name="Zap" size={24} className="text-accent" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-heading font-bold text-foreground">
                      {dashboardStats.avgProcessingTime}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {currentContent.stats.avgProcessingTime}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity and Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
                <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
                  Recent Activity
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                    <Icon name="FileText" size={16} className="text-primary" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-foreground">
                        New application submitted
                      </div>
                      <div className="text-xs text-muted-foreground">
                        APP-2025-001 • Marcus Campbell • 2 minutes ago
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                    <Icon name="CheckCircle" size={16} className="text-success" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-foreground">
                        Application approved
                      </div>
                      <div className="text-xs text-muted-foreground">
                        APP-2025-002 • Jennifer Brown • 15 minutes ago
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                    <Icon name="MessageSquare" size={16} className="text-accent" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-foreground">
                        Citizen inquiry received
                      </div>
                      <div className="text-xs text-muted-foreground">
                        INQ-2025-001 • David Wilson • 30 minutes ago
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
                <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    fullWidth
                    iconName="FileText"
                    iconPosition="left"
                    iconSize={16}
                    onClick={() => setActiveTab('applications')}
                    className="justify-start"
                  >
                    View Queue
                  </Button>
                  <Button
                    variant="outline"
                    fullWidth
                    iconName="Layers"
                    iconPosition="left"
                    iconSize={16}
                    onClick={() => setActiveTab('bulk')}
                    className="justify-start"
                  >
                    Bulk Process
                  </Button>
                  <Button
                    variant="outline"
                    fullWidth
                    iconName="Search"
                    iconPosition="left"
                    iconSize={16}
                    onClick={() => setActiveTab('documents')}
                    className="justify-start"
                  >
                    Review Docs
                  </Button>
                  <Button
                    variant="outline"
                    fullWidth
                    iconName="MessageSquare"
                    iconPosition="left"
                    iconSize={16}
                    onClick={() => setActiveTab('communication')}
                    className="justify-start"
                  >
                    Messages
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'applications':
        return (
          <ApplicationQueueTable
            onApplicationSelect={handleApplicationSelect}
            selectedApplications={selectedApplications}
            onSelectionChange={handleSelectionChange}
          />
        );
      case 'performance':
        return <PerformanceMetrics />;
      case 'bulk':
        return (
          <BulkProcessingTools
            selectedApplications={selectedApplications}
            onSelectionChange={handleSelectionChange}
          />
        );
      case 'amanda':
        return <AmandaSystemIntegration />;
      case 'documents':
        return <DocumentReviewInterface />;
      case 'training':
        return <StaffTrainingModule />;
      case 'communication':
        return <CommunicationCenter />;
      case 'system':
        return <SystemAdministrationTools />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{currentContent.pageTitle}</title>
        <meta name="description" content="Comprehensive staff interface for managing applications, monitoring performance, and ensuring compliance with Jamaica's government processing standards." />
      </Helmet>

      <Header />

      <main className="w-full">
        <div className="px-4 lg:px-6 py-6">
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Shield" size={24} className="text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">
                  {currentContent.dashboardTitle}
                </h1>
                <p className="text-muted-foreground">
                  {currentContent.subtitle}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Select
                options={[
                  { value: 'en', label: 'English' },
                  { value: 'jm', label: 'Patois' }
                ]}
                value={currentLanguage}
                onChange={handleLanguageChange}
                className="w-32"
              />
              <Button
                variant="outline"
                iconName="Bell"
                iconSize={16}
                title="Notifications"
              />
              <Button
                variant="outline"
                iconName="HelpCircle"
                iconSize={16}
                title="Help"
              />
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mb-8">
            <div className="border-b border-border">
              <nav className="flex space-x-8 overflow-x-auto">
                {tabConfig.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-200
                      ${activeTab === tab.id
                        ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                      }
                    `}
                  >
                    <Icon name={tab.icon} size={16} />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="animate-fade-in">
            {renderTabContent()}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-12">
        <div className="px-4 lg:px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-primary-foreground">
                  <path
                    fill="currentColor"
                    d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"
                  />
                  <circle cx="12" cy="12" r="3" fill="var(--color-secondary)" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium text-foreground">
                  JamGov Roads Portal
                </div>
                <div className="text-xs text-muted-foreground">
                  Staff Administrative Interface
                </div>
              </div></div>
            <div className="flex items-center space-x-6 text-xs text-muted-foreground">
              <span>Version 2.1.0</span>
              <span>•</span>
              <span>Last Updated: January 16, 2025</span>
              <span>•</span>
              <span>System Status: Operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StaffAdministrativeDashboard;