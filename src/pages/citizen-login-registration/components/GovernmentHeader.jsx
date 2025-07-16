import React from 'react';
import Icon from '../../../components/AppIcon';

const GovernmentHeader = ({ currentLanguage }) => {
  const content = {
    en: {
      title: 'JamGov Roads Portal',
      subtitle: 'Ministry of Economic Growth and Job Creation',
      department: 'National Works Agency',
      tagline: 'Secure • Efficient • Accessible',
      welcomeMessage: 'Welcome to Jamaica\'s Digital Government Services'
    },
    jm: {
      title: 'JamGov Roads Portal',
      subtitle: 'Ministry of Economic Growth and Job Creation',
      department: 'National Works Agency',
      tagline: 'Secure • Efficient • Accessible',
      welcomeMessage: 'Welcome to Jamaica Digital Government Services'
    }
  };

  const t = content[currentLanguage] || content.en;

  return (
    <div className="w-full max-w-4xl mx-auto text-center mb-8">
      {/* Government Seal and Branding */}
      <div className="flex items-center justify-center space-x-4 mb-6">
        {/* Jamaica Government Seal */}
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-elevation-2">
          <svg viewBox="0 0 24 24" className="w-10 h-10 text-primary-foreground">
            <path
              fill="currentColor"
              d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"
            />
            <circle cx="12" cy="12" r="3" fill="var(--color-secondary)" />
            <path
              fill="currentColor"
              d="M12 7L12.5 9.5L15 10L12.5 10.5L12 13L11.5 10.5L9 10L11.5 9.5L12 7Z"
            />
          </svg>
        </div>

        {/* Coat of Arms Elements */}
        <div className="hidden sm:flex items-center space-x-2">
          <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
            <Icon name="Crown" size={20} className="text-secondary-foreground" />
          </div>
          <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
            <Icon name="Shield" size={20} className="text-accent-foreground" />
          </div>
        </div>
      </div>

      {/* Title and Branding */}
      <div className="space-y-2 mb-6">
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-foreground">
          {t.title}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground font-medium">
          {t.subtitle}
        </p>
        <p className="text-xs sm:text-sm text-muted-foreground">
          {t.department}
        </p>
      </div>

      {/* Welcome Message */}
      <div className="bg-card border border-border rounded-lg p-4 mb-6 shadow-elevation-1">
        <p className="text-sm sm:text-base text-foreground font-medium mb-2">
          {t.welcomeMessage}
        </p>
        <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
          <Icon name="Shield" size={14} className="text-success" />
          <span>{t.tagline}</span>
        </div>
      </div>

      {/* National Colors Accent */}
      <div className="flex items-center justify-center space-x-1 mb-4">
        <div className="w-8 h-1 bg-primary rounded-full" />
        <div className="w-8 h-1 bg-secondary rounded-full" />
        <div className="w-8 h-1 bg-foreground rounded-full" />
      </div>

      {/* Government Verification Badge */}
      <div className="inline-flex items-center space-x-2 px-3 py-1 bg-success/10 border border-success/20 rounded-full text-xs text-success">
        <Icon name="CheckCircle" size={12} />
        <span className="font-medium">Official Government Portal</span>
      </div>
    </div>
  );
};

export default GovernmentHeader;