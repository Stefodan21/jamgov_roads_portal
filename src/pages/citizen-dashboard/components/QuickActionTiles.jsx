import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActionTiles = ({ className = '' }) => {
  const navigate = useNavigate();

  const quickActions = [
    {
      id: 'new-application',
      title: 'Submit New Application',
      description: 'Start a new government service request',
      icon: 'FileText',
      color: 'bg-primary',
      textColor: 'text-primary-foreground',
      path: '/application-submission-portal',
      stats: '2-5 min'
    },
    {
      id: 'road-permits',
      title: 'Road Permits',
      description: 'Apply for road work and construction permits',
      icon: 'Construction',
      color: 'bg-secondary',
      textColor: 'text-secondary-foreground',
      path: '/application-submission-portal',
      stats: '3-7 days'
    },
    {
      id: 'construction-licenses',
      title: 'Construction Licenses',
      description: 'Building and construction licensing services',
      icon: 'Building',
      color: 'bg-accent',
      textColor: 'text-accent-foreground',
      path: '/application-submission-portal',
      stats: '5-14 days'
    },
    {
      id: 'infrastructure-requests',
      title: 'Infrastructure Requests',
      description: 'Report issues and request infrastructure services',
      icon: 'MapPin',
      color: 'bg-success',
      textColor: 'text-success-foreground',
      path: '/application-submission-portal',
      stats: '1-3 days'
    }
  ];

  const handleActionClick = (path) => {
    navigate(path);
  };

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {quickActions.map((action) => (
        <div
          key={action.id}
          className="group relative overflow-hidden rounded-lg border border-border bg-card hover:shadow-elevation-2 transition-all duration-200 cursor-pointer"
          onClick={() => handleActionClick(action.path)}
        >
          <div className="p-6">
            {/* Icon and Title */}
            <div className="flex items-center space-x-3 mb-3">
              <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                <Icon 
                  name={action.icon} 
                  size={24} 
                  className={action.textColor}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-heading font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                  {action.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Avg: {action.stats}
                </p>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {action.description}
            </p>

            {/* Action Button */}
            <Button
              variant="ghost"
              size="sm"
              iconName="ArrowRight"
              iconPosition="right"
              iconSize={16}
              className="w-full justify-between group-hover:bg-muted"
              onClick={(e) => {
                e.stopPropagation();
                handleActionClick(action.path);
              }}
            >
              Get Started
            </Button>
          </div>

          {/* Hover Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
        </div>
      ))}
    </div>
  );
};

export default QuickActionTiles;