import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import OfflineStatusManager from '../../components/ui/OfflineStatusManager';
import LocationAwareApplicationList from './components/LocationAwareApplicationList';
import ApplicationDetailsCard from './components/ApplicationDetailsCard';
import PhotoCaptureTools from './components/PhotoCaptureTools';
import FormCompletionInterface from './components/FormCompletionInterface';
import StatusUpdateTools from './components/StatusUpdateTools';
import CommunicationFeatures from './components/CommunicationFeatures';
import Icon from '../../components/AppIcon';


const FieldAgentMobileInterface = () => {
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [activePanel, setActivePanel] = useState('applications');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [currentLocation, setCurrentLocation] = useState(null);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Simulate battery monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      setBatteryLevel(prev => Math.max(prev - 0.1, 0));
    }, 60000); // Decrease by 0.1% every minute

    return () => clearInterval(interval);
  }, []);

  // Get current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Location access denied');
          setCurrentLocation({ lat: 18.0179, lng: -76.8099 }); // Kingston default
        }
      );
    }
  }, []);

  const handleApplicationSelect = (application) => {
    setSelectedApplication(application);
    setActivePanel('details');
  };

  const handleStatusUpdate = (applicationId, newStatus, notes) => {
    console.log('Status updated:', { applicationId, newStatus, notes });
    if (selectedApplication && selectedApplication.id === applicationId) {
      setSelectedApplication(prev => ({
        ...prev,
        status: newStatus
      }));
    }
  };

  const handleFormSubmit = (formData) => {
    console.log('Form submitted:', formData);
    setActivePanel('applications');
    setSelectedApplication(null);
  };

  const handlePhotosUpdate = (photos) => {
    console.log('Photos updated:', photos);
  };

  const panels = [
    { id: 'applications', label: 'Applications', icon: 'List', shortLabel: 'Apps' },
    { id: 'details', label: 'Details', icon: 'FileText', shortLabel: 'Details' },
    { id: 'photos', label: 'Photos', icon: 'Camera', shortLabel: 'Photos' },
    { id: 'form', label: 'Form', icon: 'CheckSquare', shortLabel: 'Form' },
    { id: 'status', label: 'Status', icon: 'Activity', shortLabel: 'Status' },
    { id: 'communication', label: 'Communication', icon: 'MessageSquare', shortLabel: 'Comm' }
  ];

  const getBatteryColor = () => {
    if (batteryLevel > 50) return 'text-success';
    if (batteryLevel > 20) return 'text-warning';
    return 'text-error';
  };

  const getBatteryIcon = () => {
    if (batteryLevel > 75) return 'Battery';
    if (batteryLevel > 50) return 'Battery';
    if (batteryLevel > 25) return 'Battery';
    return 'Battery';
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Mobile Status Bar */}
      <div className="lg:hidden bg-card border-b border-border px-4 py-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <OfflineStatusManager />
            <div className="flex items-center space-x-1">
              <Icon name="MapPin" size={14} className="text-muted-foreground" />
              <span className="text-muted-foreground">
                {currentLocation ? 'GPS Active' : 'GPS Searching...'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Icon name={getBatteryIcon()} size={14} className={getBatteryColor()} />
              <span className={`text-xs ${getBatteryColor()}`}>
                {Math.round(batteryLevel)}%
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name={isOnline ? 'Wifi' : 'WifiOff'} size={14} className={isOnline ? 'text-success' : 'text-error'} />
              <span className={`text-xs ${isOnline ? 'text-success' : 'text-error'}`}>
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)]">
        {/* Mobile Navigation */}
        <div className="lg:hidden bg-card border-b border-border">
          <div className="flex overflow-x-auto">
            {panels.map((panel) => (
              <button
                key={panel.id}
                onClick={() => setActivePanel(panel.id)}
                disabled={panel.id !== 'applications' && !selectedApplication}
                className={`
                  flex flex-col items-center space-y-1 px-3 py-2 min-w-0 flex-shrink-0 transition-colors
                  ${activePanel === panel.id
                    ? 'text-primary bg-primary/5 border-b-2 border-primary' :'text-muted-foreground hover:text-foreground'
                  }
                  ${panel.id !== 'applications' && !selectedApplication ? 'opacity-50' : ''}
                `}
              >
                <Icon name={panel.icon} size={16} />
                <span className="text-xs font-medium">
                  {panel.shortLabel}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:w-80 bg-card border-r border-border flex-col">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-heading font-semibold text-foreground">
                Field Operations
              </h2>
              <OfflineStatusManager showDetails={false} />
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Icon name="MapPin" size={14} className="text-muted-foreground" />
                <span className="text-muted-foreground">
                  {currentLocation ? 'GPS Active' : 'Searching...'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name={getBatteryIcon()} size={14} className={getBatteryColor()} />
                <span className={getBatteryColor()}>
                  {Math.round(batteryLevel)}%
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <LocationAwareApplicationList
              onApplicationSelect={handleApplicationSelect}
              selectedApplicationId={selectedApplication?.id}
            />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6">
            {/* Mobile: Show based on active panel */}
            <div className="lg:hidden">
              {activePanel === 'applications' && (
                <LocationAwareApplicationList
                  onApplicationSelect={handleApplicationSelect}
                  selectedApplicationId={selectedApplication?.id}
                />
              )}
              
              {activePanel === 'details' && (
                <ApplicationDetailsCard
                  application={selectedApplication}
                  onClose={() => {
                    setActivePanel('applications');
                    setSelectedApplication(null);
                  }}
                  onStatusUpdate={handleStatusUpdate}
                />
              )}
              
              {activePanel === 'photos' && selectedApplication && (
                <PhotoCaptureTools
                  applicationId={selectedApplication.id}
                  onPhotosUpdate={handlePhotosUpdate}
                />
              )}
              
              {activePanel === 'form' && selectedApplication && (
                <FormCompletionInterface
                  applicationId={selectedApplication.id}
                  onFormSubmit={handleFormSubmit}
                />
              )}
              
              {activePanel === 'status' && selectedApplication && (
                <StatusUpdateTools
                  applicationId={selectedApplication.id}
                  currentStatus={selectedApplication.status}
                  onStatusUpdate={handleStatusUpdate}
                />
              )}
              
              {activePanel === 'communication' && selectedApplication && (
                <CommunicationFeatures
                  applicationId={selectedApplication.id}
                  applicantInfo={{
                    name: selectedApplication.applicantName,
                    phone: selectedApplication.applicantPhone
                  }}
                />
              )}
            </div>

            {/* Desktop: Show application details or welcome screen */}
            <div className="hidden lg:block">
              {selectedApplication ? (
                <div className="space-y-6">
                  <ApplicationDetailsCard
                    application={selectedApplication}
                    onStatusUpdate={handleStatusUpdate}
                  />
                  
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <PhotoCaptureTools
                      applicationId={selectedApplication.id}
                      onPhotosUpdate={handlePhotosUpdate}
                    />
                    
                    <StatusUpdateTools
                      applicationId={selectedApplication.id}
                      currentStatus={selectedApplication.status}
                      onStatusUpdate={handleStatusUpdate}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <FormCompletionInterface
                      applicationId={selectedApplication.id}
                      onFormSubmit={handleFormSubmit}
                    />
                    
                    <CommunicationFeatures
                      applicationId={selectedApplication.id}
                      applicantInfo={{
                        name: selectedApplication.applicantName,
                        phone: selectedApplication.applicantPhone
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center max-w-md">
                    <Icon name="MapPin" size={64} className="text-muted-foreground mx-auto mb-6" />
                    <h2 className="text-2xl font-heading font-semibold text-foreground mb-4">
                      Welcome to Field Operations
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      Select an application from the sidebar to begin your inspection. All tools and features are optimized for mobile field work.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="p-3 bg-muted rounded-lg">
                        <Icon name="Wifi" size={20} className="text-success mx-auto mb-2" />
                        <p className="font-medium text-foreground">Connectivity</p>
                        <p className="text-muted-foreground">
                          {isOnline ? 'Online & Synced' : 'Offline Mode'}
                        </p>
                      </div>
                      
                      <div className="p-3 bg-muted rounded-lg">
                        <Icon name="MapPin" size={20} className="text-primary mx-auto mb-2" />
                        <p className="font-medium text-foreground">Location</p>
                        <p className="text-muted-foreground">
                          {currentLocation ? 'GPS Active' : 'Searching...'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Battery Warning */}
      {batteryLevel < 20 && (
        <div className="fixed bottom-4 left-4 right-4 lg:left-auto lg:right-4 lg:w-80 bg-warning text-warning-foreground p-3 rounded-lg shadow-elevation-2 z-50">
          <div className="flex items-center space-x-2">
            <Icon name="Battery" size={16} />
            <span className="text-sm font-medium">
              Low Battery: {Math.round(batteryLevel)}%
            </span>
          </div>
          <p className="text-xs mt-1 opacity-90">
            Consider charging your device or enabling power saving mode.
          </p>
        </div>
      )}
    </div>
  );
};

export default FieldAgentMobileInterface;