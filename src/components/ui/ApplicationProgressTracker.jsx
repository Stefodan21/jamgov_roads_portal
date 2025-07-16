import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';

const ApplicationProgressTracker = ({ 
  applicationId,
  currentStep = 0,
  totalSteps = 5,
  status = 'in-progress',
  estimatedCompletion,
  showDetails = true,
  orientation = 'horizontal',
  className = ''
}) => {
  const [progress, setProgress] = useState(currentStep);
  const [applicationStatus, setApplicationStatus] = useState(status);

  const steps = [
    {
      id: 1,
      title: 'Application Submitted',
      description: 'Your application has been received',
      icon: 'FileText',
      estimatedTime: '0 min'
    },
    {
      id: 2,
      title: 'Document Verification',
      description: 'Verifying submitted documents',
      icon: 'Shield',
      estimatedTime: '2-5 min'
    },
    {
      id: 3,
      title: 'Review Process',
      description: 'Application under staff review',
      icon: 'Eye',
      estimatedTime: '10-15 min'
    },
    {
      id: 4,
      title: 'Approval Process',
      description: 'Final approval and processing',
      icon: 'CheckCircle',
      estimatedTime: '5-10 min'
    },
    {
      id: 5,
      title: 'Completed',
      description: 'Application processed successfully',
      icon: 'Award',
      estimatedTime: 'Complete'
    }
  ];

  const statusConfig = {
    'in-progress': {
      color: 'text-accent',
      bgColor: 'bg-accent',
      label: 'In Progress'
    },
    'completed': {
      color: 'text-success',
      bgColor: 'bg-success',
      label: 'Completed'
    },
    'rejected': {
      color: 'text-error',
      bgColor: 'bg-error',
      label: 'Rejected'
    },
    'on-hold': {
      color: 'text-warning',
      bgColor: 'bg-warning',
      label: 'On Hold'
    }
  };

  const getStepStatus = (stepIndex) => {
    if (stepIndex < progress) return 'completed';
    if (stepIndex === progress && applicationStatus === 'in-progress') return 'current';
    if (stepIndex === progress && applicationStatus === 'rejected') return 'error';
    return 'pending';
  };

  const getStepStyles = (stepStatus) => {
    switch (stepStatus) {
      case 'completed':
        return {
          circle: 'bg-success text-success-foreground border-success',
          line: 'bg-success',
          text: 'text-success',
          title: 'text-foreground'
        };
      case 'current':
        return {
          circle: 'bg-accent text-accent-foreground border-accent animate-pulse',
          line: 'bg-muted',
          text: 'text-accent',
          title: 'text-foreground font-semibold'
        };
      case 'error':
        return {
          circle: 'bg-error text-error-foreground border-error',
          line: 'bg-muted',
          text: 'text-error',
          title: 'text-foreground'
        };
      default:
        return {
          circle: 'bg-muted text-muted-foreground border-border',
          line: 'bg-muted',
          text: 'text-muted-foreground',
          title: 'text-muted-foreground'
        };
    }
  };

  // Simulate progress updates
  useEffect(() => {
    if (applicationStatus === 'in-progress' && progress < totalSteps - 1) {
      const timer = setTimeout(() => {
        setProgress(prev => Math.min(prev + 1, totalSteps - 1));
      }, 3000);
      return () => clearTimeout(timer);
    } else if (progress === totalSteps - 1 && applicationStatus === 'in-progress') {
      setApplicationStatus('completed');
    }
  }, [progress, applicationStatus, totalSteps]);

  const currentConfig = statusConfig[applicationStatus] || statusConfig['in-progress'];
  const progressPercentage = ((progress + 1) / totalSteps) * 100;

  return (
    <div className={`w-full ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground">
            Application Progress
          </h3>
          {applicationId && (
            <p className="text-sm text-muted-foreground font-mono">
              ID: {applicationId}
            </p>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${currentConfig.color} bg-opacity-10`}>
            {currentConfig.label}
          </div>
          <div className="text-sm text-muted-foreground">
            {Math.round(progressPercentage)}%
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${currentConfig.bgColor}`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className={`
        ${orientation === 'horizontal' ?'flex items-start justify-between' :'space-y-6'
        }
      `}>
        {steps.slice(0, totalSteps).map((step, index) => {
          const stepStatus = getStepStatus(index);
          const styles = getStepStyles(stepStatus);
          const isLast = index === steps.length - 1;

          return (
            <div 
              key={step.id}
              className={`
                flex items-start space-x-3 relative
                ${orientation === 'horizontal' ? 'flex-col items-center text-center max-w-32' : 'flex-row'}
              `}
            >
              {/* Step Circle */}
              <div className={`
                relative z-10 w-10 h-10 rounded-full border-2 flex items-center justify-center
                transition-all duration-300 ${styles.circle}
              `}>
                {stepStatus === 'completed' ? (
                  <Icon name="Check" size={16} />
                ) : stepStatus === 'error' ? (
                  <Icon name="X" size={16} />
                ) : (
                  <Icon name={step.icon} size={16} />
                )}
              </div>

              {/* Connecting Line */}
              {!isLast && orientation === 'horizontal' && (
                <div className={`
                  absolute top-5 left-10 w-full h-0.5 -translate-y-0.5
                  transition-all duration-500 ${styles.line}
                `} />
              )}

              {!isLast && orientation === 'vertical' && (
                <div className={`
                  absolute left-5 top-10 w-0.5 h-full -translate-x-0.5
                  transition-all duration-500 ${styles.line}
                `} />
              )}

              {/* Step Content */}
              <div className={`
                ${orientation === 'horizontal' ? 'mt-3' : 'flex-1 min-w-0'}
              `}>
                <h4 className={`text-sm font-medium transition-colors duration-300 ${styles.title}`}>
                  {step.title}
                </h4>
                
                {showDetails && (
                  <>
                    <p className={`text-xs mt-1 transition-colors duration-300 ${styles.text}`}>
                      {step.description}
                    </p>
                    
                    {stepStatus === 'current' && (
                      <div className="flex items-center space-x-1 mt-2">
                        <Icon name="Clock" size={12} className="text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          ETA: {step.estimatedTime}
                        </span>
                      </div>
                    )}

                    {stepStatus === 'completed' && (
                      <div className="flex items-center space-x-1 mt-2">
                        <Icon name="CheckCircle" size={12} className="text-success" />
                        <span className="text-xs text-success">
                          Completed
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Estimated Completion */}
      {estimatedCompletion && applicationStatus === 'in-progress' && (
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={16} className="text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">
              Estimated Completion:
            </span>
            <span className="text-sm text-muted-foreground">
              {estimatedCompletion}
            </span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {applicationStatus === 'rejected' && (
        <div className="mt-6 flex space-x-3">
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity">
            Resubmit Application
          </button>
          <button className="px-4 py-2 border border-border text-foreground rounded-md text-sm font-medium hover:bg-muted transition-colors">
            Contact Support
          </button>
        </div>
      )}
    </div>
  );
};

export default ApplicationProgressTracker;