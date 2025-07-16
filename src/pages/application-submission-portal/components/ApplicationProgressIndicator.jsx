import React from 'react';
import Icon from '../../../components/AppIcon';

const ApplicationProgressIndicator = ({ 
  currentStep = 0, 
  totalSteps = 5, 
  steps = [],
  className = '' 
}) => {
  const defaultSteps = [
    { title: 'Application Type', icon: 'FileText' },
    { title: 'Personal Info', icon: 'User' },
    { title: 'Project Details', icon: 'Settings' },
    { title: 'Documents', icon: 'Upload' },
    { title: 'Review & Submit', icon: 'CheckCircle' }
  ];

  const progressSteps = steps.length > 0 ? steps : defaultSteps;
  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;

  const getStepStatus = (stepIndex) => {
    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return 'current';
    return 'pending';
  };

  const getStepStyles = (status) => {
    switch (status) {
      case 'completed':
        return {
          circle: 'bg-success text-success-foreground border-success',
          text: 'text-success',
          line: 'bg-success'
        };
      case 'current':
        return {
          circle: 'bg-primary text-primary-foreground border-primary ring-4 ring-primary/20',
          text: 'text-primary font-semibold',
          line: 'bg-muted'
        };
      default:
        return {
          circle: 'bg-muted text-muted-foreground border-border',
          text: 'text-muted-foreground',
          line: 'bg-muted'
        };
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Mobile Progress Bar */}
      <div className="md:hidden mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">
            Step {currentStep + 1} of {totalSteps}
          </span>
          <span className="text-sm text-muted-foreground">
            {Math.round(progressPercentage)}% Complete
          </span>
        </div>
        
        <div className="w-full bg-muted rounded-full h-2 mb-3">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        <div className="text-center">
          <h3 className="text-lg font-heading font-semibold text-foreground">
            {progressSteps[currentStep]?.title}
          </h3>
        </div>
      </div>

      {/* Desktop Step Indicator */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-heading font-semibold text-foreground">
            Application Progress
          </h3>
          <span className="text-sm text-muted-foreground">
            {Math.round(progressPercentage)}% Complete
          </span>
        </div>
        
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-5 left-0 w-full h-0.5 bg-muted" />
          <div 
            className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}
          />
          
          {/* Steps */}
          <div className="relative flex justify-between">
            {progressSteps.slice(0, totalSteps).map((step, index) => {
              const status = getStepStatus(index);
              const styles = getStepStyles(status);
              
              return (
                <div key={index} className="flex flex-col items-center">
                  {/* Step Circle */}
                  <div className={`
                    w-10 h-10 rounded-full border-2 flex items-center justify-center
                    transition-all duration-300 ${styles.circle}
                  `}>
                    {status === 'completed' ? (
                      <Icon name="Check" size={16} />
                    ) : (
                      <Icon name={step.icon} size={16} />
                    )}
                  </div>
                  
                  {/* Step Label */}
                  <div className="mt-3 text-center max-w-24">
                    <span className={`text-sm transition-colors duration-300 ${styles.text}`}>
                      {step.title}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Step Navigation Hints */}
      <div className="mt-6 p-4 bg-muted/30 rounded-lg">
        <div className="flex items-center space-x-2">
          <Icon name="Info" size={16} className="text-accent" />
          <div className="text-sm">
            <span className="font-medium text-foreground">
              {currentStep === 0 && "Select your application type to get started"}
              {currentStep === 1 && "Fill in your personal information"}
              {currentStep === 2 && "Provide project details and requirements"}
              {currentStep === 3 && "Upload required documents"}
              {currentStep === 4 && "Review your application before submitting"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationProgressIndicator;