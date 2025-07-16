import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const SecurityIndicators = ({ currentLanguage }) => {
  const [securityStatus, setSecurityStatus] = useState({
    ssl: 'verified',
    dataProtection: 'compliant',
    government: 'verified',
    lastUpdated: new Date()
  });

  const content = {
    en: {
      securityFeatures: 'Security Features',
      sslEncryption: 'SSL Encryption',
      dataProtection: 'Data Protection Act Compliant',
      governmentVerified: 'Government Verified Portal',
      lastUpdated: 'Last Updated',
      secureConnection: 'Your connection is secure',
      protectedData: 'Your data is protected',
      officialPortal: 'Official government portal'
    },
    jm: {
      securityFeatures: 'Security Features',
      sslEncryption: 'SSL Encryption',
      dataProtection: 'Data Protection Act Compliant',
      governmentVerified: 'Government Verified Portal',
      lastUpdated: 'Last Updated',
      secureConnection: 'Yu connection secure',
      protectedData: 'Yu data protected',
      officialPortal: 'Official government portal'
    }
  };

  const t = content[currentLanguage] || content.en;

  const securityFeatures = [
    {
      id: 'ssl',
      icon: 'Shield',
      title: t.sslEncryption,
      description: t.secureConnection,
      status: securityStatus.ssl,
      color: 'text-success'
    },
    {
      id: 'dataProtection',
      icon: 'Lock',
      title: t.dataProtection,
      description: t.protectedData,
      status: securityStatus.dataProtection,
      color: 'text-primary'
    },
    {
      id: 'government',
      icon: 'Award',
      title: t.governmentVerified,
      description: t.officialPortal,
      status: securityStatus.government,
      color: 'text-accent'
    }
  ];

  // Simulate security status checks
  useEffect(() => {
    const checkSecurityStatus = () => {
      setSecurityStatus(prev => ({
        ...prev,
        lastUpdated: new Date()
      }));
    };

    const interval = setInterval(checkSecurityStatus, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="w-full max-w-md mx-auto mt-6">
      <div className="bg-card border border-border rounded-lg p-4 shadow-elevation-1">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="ShieldCheck" size={18} className="text-success" />
          <h3 className="text-sm font-heading font-semibold text-foreground">
            {t.securityFeatures}
          </h3>
        </div>

        <div className="space-y-3">
          {securityFeatures.map((feature) => (
            <div key={feature.id} className="flex items-start space-x-3">
              <div className={`w-5 h-5 rounded-full bg-opacity-10 flex items-center justify-center ${feature.color.replace('text-', 'bg-')}`}>
                <Icon 
                  name={feature.icon} 
                  size={12} 
                  className={feature.color}
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <p className="text-xs font-medium text-foreground">
                    {feature.title}
                  </p>
                  {feature.status === 'verified' || feature.status === 'compliant' ? (
                    <Icon name="CheckCircle" size={12} className="text-success" />
                  ) : (
                    <Icon name="AlertCircle" size={12} className="text-warning" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-border">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{t.lastUpdated}:</span>
            <span className="font-mono">
              {formatTime(securityStatus.lastUpdated)}
            </span>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="flex items-center justify-center space-x-4 mt-4">
        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
          <div className="w-4 h-4 bg-success rounded-full flex items-center justify-center">
            <Icon name="Check" size={10} className="text-success-foreground" />
          </div>
          <span>256-bit SSL</span>
        </div>
        
        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
          <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
            <Icon name="Shield" size={10} className="text-primary-foreground" />
          </div>
          <span>GDPR Compliant</span>
        </div>
        
        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
          <div className="w-4 h-4 bg-accent rounded-full flex items-center justify-center">
            <Icon name="Award" size={10} className="text-accent-foreground" />
          </div>
          <span>Gov Verified</span>
        </div>
      </div>
    </div>
  );
};

export default SecurityIndicators;