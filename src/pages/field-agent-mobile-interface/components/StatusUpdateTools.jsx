import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const StatusUpdateTools = ({ applicationId, currentStatus, onStatusUpdate }) => {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [customNotes, setCustomNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateHistory, setUpdateHistory] = useState([
    {
      id: 1,
      status: 'pending_inspection',
      timestamp: new Date(Date.now() - 7200000),
      agent: 'Field Agent #001',
      notes: 'Initial assignment received'
    },
    {
      id: 2,
      status: 'in_progress',
      timestamp: new Date(Date.now() - 3600000),
      agent: 'Field Agent #001',
      notes: 'Arrived at site, beginning inspection'
    }
  ]);

  const statusOptions = [
    {
      value: 'pending_inspection',
      label: 'Pending Inspection',
      icon: 'Clock',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      description: 'Awaiting field inspection'
    },
    {
      value: 'in_progress',
      label: 'In Progress',
      icon: 'RefreshCw',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      description: 'Currently being inspected'
    },
    {
      value: 'inspection_complete',
      label: 'Inspection Complete',
      icon: 'CheckCircle',
      color: 'text-success',
      bgColor: 'bg-success/10',
      description: 'Field inspection completed'
    },
    {
      value: 'requires_followup',
      label: 'Requires Follow-up',
      icon: 'AlertCircle',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      description: 'Additional inspection needed'
    },
    {
      value: 'on_hold',
      label: 'On Hold',
      icon: 'Pause',
      color: 'text-muted-foreground',
      bgColor: 'bg-muted',
      description: 'Temporarily suspended'
    },
    {
      value: 'rejected',
      label: 'Rejected',
      icon: 'XCircle',
      color: 'text-error',
      bgColor: 'bg-error/10',
      description: 'Does not meet requirements'
    }
  ];

  const predefinedNotes = [
    "Site inspection completed successfully",
    "Minor compliance issues identified",
    "Awaiting additional documentation",
    "Safety concerns require immediate attention",
    "Work quality meets standards",
    "Environmental compliance verified",
    "Traffic control measures adequate",
    "Requires supervisor review"
  ];

  const getStatusConfig = (status) => {
    return statusOptions.find(option => option.value === status) || statusOptions[0];
  };

  const handleStatusUpdate = async () => {
    if (selectedStatus === currentStatus && !customNotes.trim()) {
      return;
    }

    setIsUpdating(true);

    // Simulate API call
    setTimeout(() => {
      const newUpdate = {
        id: updateHistory.length + 1,
        status: selectedStatus,
        timestamp: new Date(),
        agent: 'Field Agent #001',
        notes: customNotes.trim() || `Status updated to ${getStatusConfig(selectedStatus).label}`
      };

      setUpdateHistory(prev => [...prev, newUpdate]);
      onStatusUpdate && onStatusUpdate(applicationId, selectedStatus, customNotes);
      setCustomNotes('');
      setIsUpdating(false);
    }, 1500);
  };

  const handleQuickNote = (note) => {
    setCustomNotes(note);
  };

  const formatTimestamp = (timestamp) => {
    return timestamp.toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const currentConfig = getStatusConfig(currentStatus);
  const selectedConfig = getStatusConfig(selectedStatus);

  return (
    <div className="space-y-6">
      {/* Current Status Display */}
      <div className="p-4 bg-card border border-border rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-heading font-semibold text-foreground">
            Current Status
          </h3>
          <span className="text-sm font-mono text-muted-foreground">
            {applicationId}
          </span>
        </div>
        
        <div className={`
          flex items-center space-x-3 p-3 rounded-lg
          ${currentConfig.bgColor}
        `}>
          <Icon name={currentConfig.icon} size={20} className={currentConfig.color} />
          <div className="flex-1">
            <h4 className={`font-medium ${currentConfig.color}`}>
              {currentConfig.label}
            </h4>
            <p className="text-sm text-muted-foreground">
              {currentConfig.description}
            </p>
          </div>
        </div>
      </div>

      {/* Status Update Form */}
      <div className="space-y-4">
        <h4 className="text-base font-medium text-foreground">
          Update Status
        </h4>
        
        {/* Status Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedStatus(option.value)}
              className={`
                p-3 border rounded-lg text-left transition-all duration-200
                ${selectedStatus === option.value
                  ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                }
              `}
            >
              <div className="flex items-center space-x-3">
                <Icon 
                  name={option.icon} 
                  size={16} 
                  className={selectedStatus === option.value ? 'text-primary' : option.color}
                />
                <div className="flex-1 min-w-0">
                  <h5 className={`text-sm font-medium ${
                    selectedStatus === option.value ? 'text-primary' : 'text-foreground'
                  }`}>
                    {option.label}
                  </h5>
                  <p className="text-xs text-muted-foreground truncate">
                    {option.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Quick Notes */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Quick Notes
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {predefinedNotes.map((note, index) => (
              <button
                key={index}
                onClick={() => handleQuickNote(note)}
                className="px-3 py-1 bg-muted text-sm text-muted-foreground rounded-full hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
              >
                {note}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Notes */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Additional Notes
          </label>
          <textarea
            value={customNotes}
            onChange={(e) => setCustomNotes(e.target.value)}
            className="w-full h-24 px-3 py-2 bg-input border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            placeholder="Add any additional notes or observations..."
          />
        </div>

        {/* Update Button */}
        <Button
          variant="default"
          onClick={handleStatusUpdate}
          loading={isUpdating}
          disabled={selectedStatus === currentStatus && !customNotes.trim()}
          iconName="Send"
          iconPosition="left"
          iconSize={16}
          fullWidth
        >
          {isUpdating ? 'Updating Status...' : 'Update Status'}
        </Button>
      </div>

      {/* Status History */}
      <div className="space-y-4">
        <h4 className="text-base font-medium text-foreground">
          Status History
        </h4>
        
        <div className="space-y-3">
          {updateHistory.slice().reverse().map((update, index) => {
            const config = getStatusConfig(update.status);
            const isLatest = index === 0;
            
            return (
              <div
                key={update.id}
                className={`
                  p-3 border rounded-lg
                  ${isLatest ? 'border-primary bg-primary/5' : 'border-border'}
                `}
              >
                <div className="flex items-start space-x-3">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center
                    ${config.bgColor}
                  `}>
                    <Icon name={config.icon} size={14} className={config.color} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`text-sm font-medium ${config.color}`}>
                        {config.label}
                      </span>
                      {isLatest && (
                        <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-foreground mb-2">
                      {update.notes}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>{formatTimestamp(update.timestamp)}</span>
                      <span>•</span>
                      <span>{update.agent}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Emergency Actions */}
      <div className="p-4 bg-error/10 border border-error/20 rounded-lg">
        <div className="flex items-start space-x-2 mb-3">
          <Icon name="AlertTriangle" size={16} className="text-error mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-error">
              Emergency Actions
            </h4>
            <p className="text-xs text-muted-foreground">
              Use only for urgent safety or compliance issues
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Phone"
            iconPosition="left"
            iconSize={14}
            onClick={() => window.location.href = 'tel:+1-876-555-0911'}
            className="text-error border-error hover:bg-error hover:text-error-foreground"
          >
            Emergency Contact
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="AlertTriangle"
            iconPosition="left"
            iconSize={14}
            onClick={() => setSelectedStatus('rejected')}
            className="text-error border-error hover:bg-error hover:text-error-foreground"
          >
            Stop Work Order
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StatusUpdateTools;