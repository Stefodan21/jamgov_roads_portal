import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';

const DocumentStatusIndicator = ({ 
  documentId, 
  status = 'pending', 
  progress = 0, 
  showDetails = false,
  size = 'default',
  className = '' 
}) => {
  const [currentStatus, setCurrentStatus] = useState(status);
  const [currentProgress, setCurrentProgress] = useState(progress);
  const [isProcessing, setIsProcessing] = useState(false);

  const statusConfig = {
    pending: {
      icon: 'Clock',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      label: 'Pending Review',
      description: 'Document is queued for processing'
    },
    processing: {
      icon: 'RefreshCw',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      label: 'Processing',
      description: 'Document is being analyzed and verified'
    },
    approved: {
      icon: 'CheckCircle',
      color: 'text-success',
      bgColor: 'bg-success/10',
      label: 'Approved',
      description: 'Document has been verified and approved'
    },
    rejected: {
      icon: 'XCircle',
      color: 'text-error',
      bgColor: 'bg-error/10',
      label: 'Rejected',
      description: 'Document requires attention or resubmission'
    },
    expired: {
      icon: 'AlertTriangle',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      label: 'Expired',
      description: 'Document has expired and needs renewal'
    },
    verified: {
      icon: 'Shield',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      label: 'Verified',
      description: 'Document authenticity confirmed'
    }
  };

  const sizeConfig = {
    sm: {
      container: 'px-2 py-1',
      icon: 14,
      text: 'text-xs',
      badge: 'w-4 h-4'
    },
    default: {
      container: 'px-3 py-2',
      icon: 16,
      text: 'text-sm',
      badge: 'w-5 h-5'
    },
    lg: {
      container: 'px-4 py-3',
      icon: 20,
      text: 'text-base',
      badge: 'w-6 h-6'
    }
  };

  const config = statusConfig[currentStatus] || statusConfig.pending;
  const sizing = sizeConfig[size] || sizeConfig.default;

  // Simulate real-time status updates
  useEffect(() => {
    if (currentStatus === 'processing') {
      setIsProcessing(true);
      const interval = setInterval(() => {
        setCurrentProgress(prev => {
          if (prev >= 100) {
            setCurrentStatus('approved');
            setIsProcessing(false);
            clearInterval(interval);
            return 100;
          }
          return prev + Math.random() * 10;
        });
      }, 500);

      return () => clearInterval(interval);
    }
  }, [currentStatus]);

  // Update status when prop changes
  useEffect(() => {
    setCurrentStatus(status);
    setCurrentProgress(progress);
  }, [status, progress]);

  const handleStatusClick = () => {
    if (currentStatus === 'pending') {
      setCurrentStatus('processing');
      setCurrentProgress(0);
    }
  };

  const getProgressColor = () => {
    if (currentProgress < 30) return 'bg-error';
    if (currentProgress < 70) return 'bg-warning';
    return 'bg-success';
  };

  return (
    <div className={`inline-flex items-center space-x-2 ${className}`}>
      {/* Status Badge */}
      <div 
        className={`
          flex items-center space-x-2 rounded-full border transition-all duration-200
          ${config.bgColor} ${sizing.container}
          ${currentStatus === 'pending' ? 'cursor-pointer hover:opacity-80' : ''}
        `}
        onClick={currentStatus === 'pending' ? handleStatusClick : undefined}
        title={config.description}
      >
        <div className={`${sizing.badge} flex items-center justify-center`}>
          <Icon 
            name={config.icon} 
            size={sizing.icon} 
            className={`${config.color} ${isProcessing ? 'animate-spin' : ''}`}
          />
        </div>
        
        <span className={`font-medium ${config.color} ${sizing.text}`}>
          {config.label}
        </span>

        {/* Progress indicator for processing status */}
        {currentStatus === 'processing' && (
          <div className="flex items-center space-x-2">
            <div className="w-12 h-1 bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${getProgressColor()}`}
                style={{ width: `${Math.min(currentProgress, 100)}%` }}
              />
            </div>
            <span className={`${sizing.text} text-muted-foreground font-mono`}>
              {Math.round(currentProgress)}%
            </span>
          </div>
        )}
      </div>

      {/* Detailed Status Information */}
      {showDetails && (
        <div className="flex flex-col space-y-1">
          <div className="flex items-center space-x-2">
            <span className={`${sizing.text} text-muted-foreground`}>
              Document ID:
            </span>
            <span className={`${sizing.text} font-mono text-foreground`}>
              {documentId || 'DOC-' + Math.random().toString(36).substr(2, 9).toUpperCase()}
            </span>
          </div>
          
          {currentStatus === 'processing' && (
            <div className="flex items-center space-x-2">
              <span className={`${sizing.text} text-muted-foreground`}>
                ETA:
              </span>
              <span className={`${sizing.text} text-foreground`}>
                {Math.max(1, Math.ceil((100 - currentProgress) / 10))} min
              </span>
            </div>
          )}

          {(currentStatus === 'approved' || currentStatus === 'verified') && (
            <div className="flex items-center space-x-2">
              <Icon name="Calendar" size={12} className="text-muted-foreground" />
              <span className={`${sizing.text} text-muted-foreground`}>
                Processed: {new Date().toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Compliance Indicators */}
      {(currentStatus === 'approved' || currentStatus === 'verified') && (
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-success rounded-full" title="GDPR Compliant" />
          <div className="w-2 h-2 bg-primary rounded-full" title="Government Verified" />
        </div>
      )}
    </div>
  );
};

export default DocumentStatusIndicator;