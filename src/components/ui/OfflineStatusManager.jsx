import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const OfflineStatusManager = ({ 
  className = '',
  showDetails = false,
  autoSync = true,
  syncInterval = 30000 // 30 seconds
}) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState('synced'); // synced, syncing, pending, error
  const [lastSyncTime, setLastSyncTime] = useState(new Date());
  const [pendingChanges, setPendingChanges] = useState(0);
  const [syncProgress, setSyncProgress] = useState(0);
  const [dataSize, setDataSize] = useState('2.4 MB');

  const statusConfig = {
    synced: {
      icon: 'Wifi',
      color: 'text-success',
      bgColor: 'bg-success/10',
      label: 'Online & Synced',
      description: 'All data is up to date'
    },
    syncing: {
      icon: 'RefreshCw',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      label: 'Syncing...',
      description: 'Updating data with server'
    },
    pending: {
      icon: 'CloudOff',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      label: 'Offline Mode',
      description: 'Changes will sync when online'
    },
    error: {
      icon: 'AlertTriangle',
      color: 'text-error',
      bgColor: 'bg-error/10',
      label: 'Sync Error',
      description: 'Failed to sync data'
    }
  };

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (pendingChanges > 0) {
        handleSync();
      } else {
        setSyncStatus('synced');
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setSyncStatus('pending');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [pendingChanges]);

  // Auto-sync when online
  useEffect(() => {
    if (!autoSync || !isOnline) return;

    const interval = setInterval(() => {
      if (syncStatus === 'synced' && pendingChanges === 0) {
        // Periodic sync check
        checkForUpdates();
      }
    }, syncInterval);

    return () => clearInterval(interval);
  }, [autoSync, isOnline, syncStatus, pendingChanges, syncInterval]);

  // Simulate data changes for demo
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isOnline) {
        setPendingChanges(prev => prev + Math.floor(Math.random() * 3));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isOnline]);

  const handleSync = async () => {
    if (!isOnline) return;

    setSyncStatus('syncing');
    setSyncProgress(0);

    // Simulate sync progress
    const progressInterval = setInterval(() => {
      setSyncProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setSyncStatus('synced');
          setPendingChanges(0);
          setLastSyncTime(new Date());
          return 100;
        }
        return prev + Math.random() * 20;
      });
    }, 200);

    // Simulate potential sync error
    setTimeout(() => {
      if (Math.random() < 0.1) { // 10% chance of error
        clearInterval(progressInterval);
        setSyncStatus('error');
        setSyncProgress(0);
      }
    }, 1000);
  };

  const checkForUpdates = () => {
    // Simulate checking for server updates
    console.log('Checking for updates...');
  };

  const handleRetrySync = () => {
    if (syncStatus === 'error') {
      handleSync();
    }
  };

  const handleClearCache = () => {
    // Clear local storage/cache
    localStorage.clear();
    setPendingChanges(0);
    setSyncStatus(isOnline ? 'synced' : 'pending');
    setDataSize('0 MB');
  };

  const currentConfig = statusConfig[syncStatus] || statusConfig.synced;
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`${className}`}>
      {/* Compact Status Indicator */}
      <div className="flex items-center space-x-2">
        <div className={`
          flex items-center space-x-2 px-3 py-2 rounded-full border transition-all duration-200
          ${currentConfig.bgColor}
        `}>
          <Icon 
            name={currentConfig.icon} 
            size={16} 
            className={`${currentConfig.color} ${syncStatus === 'syncing' ? 'animate-spin' : ''}`}
          />
          <span className={`text-sm font-medium ${currentConfig.color}`}>
            {currentConfig.label}
          </span>
          
          {pendingChanges > 0 && (
            <div className="bg-warning text-warning-foreground text-xs px-2 py-0.5 rounded-full font-medium">
              {pendingChanges}
            </div>
          )}
        </div>

        {/* Manual Sync Button */}
        {isOnline && syncStatus !== 'syncing' && (
          <Button
            variant="ghost"
            size="sm"
            iconName="RefreshCw"
            iconSize={14}
            onClick={handleSync}
            disabled={syncStatus === 'syncing'}
            title="Manual sync"
          />
        )}
      </div>

      {/* Detailed Status Panel */}
      {showDetails && (
        <div className="mt-4 p-4 bg-card border border-border rounded-lg space-y-4">
          {/* Status Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-heading font-semibold text-foreground">
              Sync Status
            </h3>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Icon name="Clock" size={12} />
              <span>Last sync: {formatTime(lastSyncTime)}</span>
            </div>
          </div>

          {/* Progress Bar (when syncing) */}
          {syncStatus === 'syncing' && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Syncing data...</span>
                <span>{Math.round(syncProgress)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-accent h-2 rounded-full transition-all duration-300"
                  style={{ width: `${syncProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Status Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Connection:</span>
              <div className="flex items-center space-x-1 mt-1">
                <Icon 
                  name={isOnline ? 'Wifi' : 'WifiOff'} 
                  size={14} 
                  className={isOnline ? 'text-success' : 'text-error'}
                />
                <span className={isOnline ? 'text-success' : 'text-error'}>
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
            
            <div>
              <span className="text-muted-foreground">Local Data:</span>
              <div className="flex items-center space-x-1 mt-1">
                <Icon name="HardDrive" size={14} className="text-muted-foreground" />
                <span className="text-foreground">{dataSize}</span>
              </div>
            </div>

            {pendingChanges > 0 && (
              <div>
                <span className="text-muted-foreground">Pending:</span>
                <div className="flex items-center space-x-1 mt-1">
                  <Icon name="Upload" size={14} className="text-warning" />
                  <span className="text-warning">{pendingChanges} changes</span>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 pt-2 border-t border-border">
            {syncStatus === 'error' && (
              <Button
                variant="outline"
                size="sm"
                iconName="RefreshCw"
                iconPosition="left"
                iconSize={14}
                onClick={handleRetrySync}
              >
                Retry Sync
              </Button>
            )}
            
            {isOnline && (
              <Button
                variant="ghost"
                size="sm"
                iconName="Download"
                iconPosition="left"
                iconSize={14}
                onClick={checkForUpdates}
              >
                Check Updates
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              iconName="Trash2"
              iconPosition="left"
              iconSize={14}
              onClick={handleClearCache}
              className="text-error hover:text-error"
            >
              Clear Cache
            </Button>
          </div>

          {/* Offline Mode Tips */}
          {!isOnline && (
            <div className="p-3 bg-warning/10 border border-warning/20 rounded-md">
              <div className="flex items-start space-x-2">
                <Icon name="Info" size={16} className="text-warning mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-warning mb-1">Offline Mode Active</p>
                  <p className="text-muted-foreground">
                    Your changes are being saved locally and will sync automatically when connection is restored.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OfflineStatusManager;