import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AnnouncementsSidebar = ({ className = '' }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('english');

  const announcements = [
    {
      id: 1,
      type: 'system-update',
      title: {
        english: 'System Maintenance Scheduled',
        patois: 'System Maintenance Schedule'
      },
      content: {
        english: `The JamGov Roads Portal will undergo scheduled maintenance on July 20th from 2:00 AM to 6:00 AM. During this time, some services may be temporarily unavailable.`,
        patois: `Di JamGov Roads Portal ago get maintenance pon July 20th from 2:00 AM to 6:00 AM. Some service dem might not work fi a likkle while.`
      },
      date: '2024-07-16',
      priority: 'high',
      icon: 'Settings'
    },
    {
      id: 2,
      type: 'service-update',
      title: {
        english: 'New Digital Payment Options',
        patois: 'New Digital Payment Options'
      },
      content: {
        english: `We now accept mobile payments through JN Bank Mobile, NCB Mobile, and Sagicor Bank digital wallets for faster processing.`,
        patois: `Wi now tek mobile payment through JN Bank Mobile, NCB Mobile, and Sagicor Bank digital wallet fi faster processing.`
      },
      date: '2024-07-15',
      priority: 'medium',
      icon: 'CreditCard'
    },
    {
      id: 3,
      type: 'educational',
      title: {
        english: 'Road Safety Guidelines Updated',
        patois: 'Road Safety Guidelines Update'
      },
      content: {
        english: `New road safety guidelines are now available in the resource center. Learn about proper signage requirements for construction zones.`,
        patois: `New road safety guidelines deh inna di resource center now. Learn bout proper signage requirements fi construction zones.`
      },
      date: '2024-07-14',
      priority: 'low',
      icon: 'Shield'
    }
  ];

  const serviceUpdates = [
    {
      id: 1,
      service: 'Road Permits',
      status: 'operational',
      message: {
        english: 'All systems operational',
        patois: 'All system dem a work good'
      },
      lastUpdated: '2024-07-16 14:30'
    },
    {
      id: 2,
      service: 'Document Upload',
      status: 'maintenance',
      message: {
        english: 'Temporary slowdown expected',
        patois: 'Expect likkle slowdown'
      },
      lastUpdated: '2024-07-16 13:45'
    },
    {
      id: 3,
      service: 'Payment Processing',
      status: 'operational',
      message: {
        english: 'Processing normally',
        patois: 'Processing normal'
      },
      lastUpdated: '2024-07-16 15:00'
    }
  ];

  const educationalResources = [
    {
      id: 1,
      title: {
        english: 'How to Apply for Road Permits',
        patois: 'How fi Apply fi Road Permits'
      },
      type: 'guide',
      downloadUrl: '/resources/road-permits-guide.pdf',
      size: '2.4 MB',
      icon: 'FileText'
    },
    {
      id: 2,
      title: {
        english: 'Construction License Requirements',
        patois: 'Construction License Requirements'
      },
      type: 'checklist',
      downloadUrl: '/resources/construction-checklist.pdf',
      size: '1.8 MB',
      icon: 'CheckSquare'
    },
    {
      id: 3,
      title: {
        english: 'Digital Services Tutorial Video',
        patois: 'Digital Services Tutorial Video'
      },
      type: 'video',
      downloadUrl: '/resources/tutorial-video.mp4',
      size: '45.2 MB',
      icon: 'Play'
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-error';
      case 'medium': return 'text-warning';
      default: return 'text-success';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'operational': return 'text-success';
      case 'maintenance': return 'text-warning';
      case 'error': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-JM', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const toggleLanguage = () => {
    setSelectedLanguage(selectedLanguage === 'english' ? 'patois' : 'english');
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Language Toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-heading font-semibold text-foreground">
          {selectedLanguage === 'english' ? 'Updates & Resources' : 'Updates & Resources'}
        </h2>
        <Button
          variant="ghost"
          size="sm"
          iconName="Languages"
          iconPosition="left"
          iconSize={14}
          onClick={toggleLanguage}
          className="text-xs"
        >
          {selectedLanguage === 'english' ? 'Patois' : 'English'}
        </Button>
      </div>

      {/* Announcements */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Bell" size={18} className="text-primary" />
          <h3 className="text-base font-heading font-semibold text-foreground">
            {selectedLanguage === 'english' ? 'Announcements' : 'Announcements'}
          </h3>
        </div>

        <div className="space-y-3">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="border-l-2 border-primary pl-3 py-2">
              <div className="flex items-start space-x-2">
                <Icon 
                  name={announcement.icon} 
                  size={16} 
                  className={`mt-0.5 ${getPriorityColor(announcement.priority)}`}
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-foreground mb-1">
                    {announcement.title[selectedLanguage]}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-3 mb-2">
                    {announcement.content[selectedLanguage]}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {formatDate(announcement.date)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="ExternalLink"
                      iconSize={12}
                      className="text-xs h-6 px-2"
                    >
                      {selectedLanguage === 'english' ? 'Read More' : 'Read More'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Service Status */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Activity" size={18} className="text-accent" />
          <h3 className="text-base font-heading font-semibold text-foreground">
            {selectedLanguage === 'english' ? 'Service Status' : 'Service Status'}
          </h3>
        </div>

        <div className="space-y-3">
          {serviceUpdates.map((service) => (
            <div key={service.id} className="flex items-center justify-between py-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {service.service}
                </p>
                <p className="text-xs text-muted-foreground">
                  {service.message[selectedLanguage]}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  service.status === 'operational' ? 'bg-success' :
                  service.status === 'maintenance' ? 'bg-warning' : 'bg-error'
                }`} />
                <span className={`text-xs font-medium ${getStatusColor(service.status)}`}>
                  {service.status === 'operational' ? 
                    (selectedLanguage === 'english' ? 'Online' : 'Online') :
                    service.status === 'maintenance' ?
                    (selectedLanguage === 'english' ? 'Maintenance' : 'Maintenance') :
                    (selectedLanguage === 'english' ? 'Error' : 'Error')
                  }
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Educational Resources */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="BookOpen" size={18} className="text-secondary" />
          <h3 className="text-base font-heading font-semibold text-foreground">
            {selectedLanguage === 'english' ? 'Resources' : 'Resources'}
          </h3>
        </div>

        <div className="space-y-3">
          {educationalResources.map((resource) => (
            <div key={resource.id} className="flex items-center space-x-3 p-2 hover:bg-muted rounded-md transition-colors duration-200">
              <Icon name={resource.icon} size={16} className="text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {resource.title[selectedLanguage]}
                </p>
                <p className="text-xs text-muted-foreground">
                  {resource.type} • {resource.size}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                iconName="Download"
                iconSize={14}
                className="h-8 w-8 p-0"
              />
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            iconName="ExternalLink"
            iconPosition="right"
            iconSize={14}
            fullWidth
          >
            {selectedLanguage === 'english' ? 'View All Resources' : 'View All Resources'}
          </Button>
        </div>
      </div>

      {/* Payment Reminders */}
      <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Icon name="CreditCard" size={18} className="text-warning" />
          <h3 className="text-base font-heading font-semibold text-warning">
            {selectedLanguage === 'english' ? 'Payment Reminder' : 'Payment Reminder'}
          </h3>
        </div>
        
        <p className="text-sm text-foreground mb-3">
          {selectedLanguage === 'english' ?'You have 1 application requiring payment to proceed.' :'Yuh have 1 application weh need payment fi continue.'
          }
        </p>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {selectedLanguage === 'english' ? 'Amount Due:' : 'Amount Due:'}
          </span>
          <span className="font-semibold text-foreground">J$45,000</span>
        </div>
        
        <Button
          variant="default"
          size="sm"
          iconName="CreditCard"
          iconPosition="left"
          iconSize={14}
          fullWidth
          className="mt-3"
        >
          {selectedLanguage === 'english' ? 'Pay Now' : 'Pay Now'}
        </Button>
      </div>
    </div>
  );
};

export default AnnouncementsSidebar;