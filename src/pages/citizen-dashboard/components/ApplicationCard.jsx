import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import ApplicationProgressTracker from '../../../components/ui/ApplicationProgressTracker';

const ApplicationCard = ({ application, className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusConfig = {
    submitted: {
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      icon: 'FileText',
      label: 'Submitted'
    },
    'under-review': {
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      icon: 'Eye',
      label: 'Under Review'
    },
    approved: {
      color: 'text-success',
      bgColor: 'bg-success/10',
      icon: 'CheckCircle',
      label: 'Approved'
    },
    rejected: {
      color: 'text-error',
      bgColor: 'bg-error/10',
      icon: 'XCircle',
      label: 'Rejected'
    },
    'pending-payment': {
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      icon: 'CreditCard',
      label: 'Payment Required'
    }
  };

  const config = statusConfig[application.status] || statusConfig.submitted;
  const formatDate = (date) => new Date(date).toLocaleDateString('en-JM', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const getProgressStep = () => {
    switch (application.status) {
      case 'submitted': return 0;
      case 'under-review': return 2;
      case 'approved': return 4;
      case 'rejected': return 2;
      default: return 0;
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`bg-card border border-border rounded-lg overflow-hidden hover:shadow-elevation-2 transition-all duration-200 ${className}`}>
      {/* Card Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-base font-heading font-semibold text-foreground truncate">
                {application.type}
              </h3>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${config.color} ${config.bgColor}`}>
                {config.label}
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Icon name="Calendar" size={14} />
                <span>{formatDate(application.submissionDate)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Hash" size={14} />
                <span className="font-mono">{application.referenceNumber}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {application.status === 'pending-payment' && (
              <Button
                variant="outline"
                size="sm"
                iconName="CreditCard"
                iconPosition="left"
                iconSize={14}
                className="text-warning border-warning hover:bg-warning/10"
              >
                Pay Now
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
              iconSize={16}
              onClick={toggleExpanded}
            />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>Progress</span>
            <span>{application.estimatedCompletion}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                application.status === 'approved' ? 'bg-success' :
                application.status === 'rejected'? 'bg-error' : 'bg-accent'
              }`}
              style={{ width: `${(getProgressStep() + 1) * 20}%` }}
            />
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-4 bg-muted/30 animate-slide-down">
          <div className="space-y-4">
            {/* Application Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Location:</span>
                <p className="text-foreground mt-1">{application.location}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Current Stage:</span>
                <p className="text-foreground mt-1">{application.currentStage}</p>
              </div>
              {application.assignedOfficer && (
                <div>
                  <span className="text-muted-foreground">Assigned Officer:</span>
                  <p className="text-foreground mt-1">{application.assignedOfficer}</p>
                </div>
              )}
              {application.fee && (
                <div>
                  <span className="text-muted-foreground">Fee:</span>
                  <p className="text-foreground mt-1 font-medium">J${application.fee.toLocaleString()}</p>
                </div>
              )}
            </div>

            {/* Progress Tracker */}
            <ApplicationProgressTracker
              applicationId={application.referenceNumber}
              currentStep={getProgressStep()}
              totalSteps={5}
              status={application.status === 'approved' ? 'completed' : 
                     application.status === 'rejected' ? 'rejected' : 'in-progress'}
              estimatedCompletion={application.estimatedCompletion}
              showDetails={false}
              orientation="horizontal"
            />

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                iconName="Eye"
                iconPosition="left"
                iconSize={14}
              >
                View Details
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                iconName="Download"
                iconPosition="left"
                iconSize={14}
              >
                Download
              </Button>
              
              {application.status === 'rejected' && (
                <Button
                  variant="outline"
                  size="sm"
                  iconName="RefreshCw"
                  iconPosition="left"
                  iconSize={14}
                  className="text-primary border-primary hover:bg-primary/10"
                >
                  Resubmit
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                iconName="MessageCircle"
                iconPosition="left"
                iconSize={14}
              >
                Contact
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationCard;