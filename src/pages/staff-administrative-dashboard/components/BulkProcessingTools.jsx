import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';


const BulkProcessingTools = ({ selectedApplications, onSelectionChange }) => {
  const [bulkAction, setBulkAction] = useState('');
  const [processingStatus, setProcessingStatus] = useState('idle'); // idle, processing, completed, error
  const [processedCount, setProcessedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [processingLog, setProcessingLog] = useState([]);
  const [approvalWorkflow, setApprovalWorkflow] = useState(false);
  const [assignStaff, setAssignStaff] = useState('');
  const [priority, setPriority] = useState('');
  const [addComments, setAddComments] = useState('');

  const bulkActionOptions = [
    { value: '', label: 'Select Action' },
    { value: 'approve', label: 'Approve Applications' },
    { value: 'reject', label: 'Reject Applications' },
    { value: 'assign', label: 'Assign to Staff' },
    { value: 'priority', label: 'Change Priority' },
    { value: 'request-docs', label: 'Request Additional Documents' },
    { value: 'schedule-review', label: 'Schedule Review' },
    { value: 'export', label: 'Export Data' }
  ];

  const staffOptions = [
    { value: '', label: 'Select Staff Member' },
    { value: 'sarah-johnson', label: 'Sarah Johnson' },
    { value: 'michael-davis', label: 'Michael Davis' },
    { value: 'lisa-thompson', label: 'Lisa Thompson' },
    { value: 'robert-garcia', label: 'Robert Garcia' },
    { value: 'amanda-rodriguez', label: 'Amanda Rodriguez' }
  ];

  const priorityOptions = [
    { value: '', label: 'Select Priority' },
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' }
  ];

  // Mock processing simulation
  useEffect(() => {
    if (processingStatus === 'processing') {
      const interval = setInterval(() => {
        setProcessedCount(prev => {
          if (prev >= totalCount) {
            setProcessingStatus('completed');
            clearInterval(interval);
            return totalCount;
          }
          return prev + 1;
        });
      }, 500);

      return () => clearInterval(interval);
    }
  }, [processingStatus, totalCount]);

  const handleBulkProcess = () => {
    if (!bulkAction || selectedApplications.length === 0) return;

    setProcessingStatus('processing');
    setTotalCount(selectedApplications.length);
    setProcessedCount(0);
    
    // Add to processing log
    const logEntry = {
      id: Date.now(),
      timestamp: new Date(),
      action: bulkAction,
      count: selectedApplications.length,
      status: 'processing',
      user: 'Current User'
    };
    
    setProcessingLog(prev => [logEntry, ...prev]);

    // Simulate processing completion
    setTimeout(() => {
      setProcessingLog(prev => 
        prev.map(entry => 
          entry.id === logEntry.id 
            ? { ...entry, status: 'completed' }
            : entry
        )
      );
    }, selectedApplications.length * 500 + 1000);
  };

  const handleCancelProcessing = () => {
    setProcessingStatus('idle');
    setProcessedCount(0);
    setTotalCount(0);
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'approve': return 'CheckCircle';
      case 'reject': return 'XCircle';
      case 'assign': return 'Users';
      case 'priority': return 'Flag';
      case 'request-docs': return 'FileText';
      case 'schedule-review': return 'Calendar';
      case 'export': return 'Download';
      default: return 'Settings';
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'approve': return 'text-success';
      case 'reject': return 'text-error';
      case 'assign': return 'text-accent';
      case 'priority': return 'text-warning';
      default: return 'text-primary';
    }
  };

  const formatLogTime = (date) => {
    return date.toLocaleTimeString('en-JM', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-elevation-1">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-heading font-semibold text-foreground">
            Bulk Processing Tools
          </h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              {selectedApplications.length} selected
            </span>
            {selectedApplications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                iconName="X"
                iconSize={14}
                onClick={() => onSelectionChange([])}
                title="Clear selection"
              />
            )}
          </div>
        </div>

        {selectedApplications.length === 0 && (
          <div className="text-center py-8">
            <Icon name="MousePointer" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Select applications from the queue to enable bulk processing
            </p>
          </div>
        )}
      </div>

      {selectedApplications.length > 0 && (
        <div className="p-6 space-y-6">
          {/* Action Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Bulk Action"
              options={bulkActionOptions}
              value={bulkAction}
              onChange={setBulkAction}
              disabled={processingStatus === 'processing'}
            />

            {bulkAction === 'assign' && (
              <Select
                label="Assign to Staff"
                options={staffOptions}
                value={assignStaff}
                onChange={setAssignStaff}
                disabled={processingStatus === 'processing'}
              />
            )}

            {bulkAction === 'priority' && (
              <Select
                label="Set Priority"
                options={priorityOptions}
                value={priority}
                onChange={setPriority}
                disabled={processingStatus === 'processing'}
              />
            )}
          </div>

          {/* Additional Options */}
          {bulkAction && bulkAction !== 'export' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Checkbox
                  label="Require approval workflow"
                  checked={approvalWorkflow}
                  onChange={(e) => setApprovalWorkflow(e.target.checked)}
                  disabled={processingStatus === 'processing'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Comments (Optional)
                </label>
                <textarea
                  value={addComments}
                  onChange={(e) => setAddComments(e.target.value)}
                  placeholder="Add comments for this bulk action..."
                  disabled={processingStatus === 'processing'}
                  className="w-full px-3 py-2 border border-border rounded-md text-foreground bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Processing Status */}
          {processingStatus === 'processing' && (
            <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Icon name="RefreshCw" size={20} className="text-accent animate-spin" />
                  <span className="font-medium text-accent">Processing Applications</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="X"
                  iconSize={14}
                  onClick={handleCancelProcessing}
                >
                  Cancel
                </Button>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground">Progress</span>
                  <span className="text-muted-foreground">
                    {processedCount} of {totalCount} applications
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-accent h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(processedCount / totalCount) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="text-sm text-muted-foreground">
              {bulkAction && (
                <div className="flex items-center space-x-2">
                  <Icon 
                    name={getActionIcon(bulkAction)} 
                    size={16} 
                    className={getActionColor(bulkAction)} 
                  />
                  <span>
                    {bulkActionOptions.find(opt => opt.value === bulkAction)?.label}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setBulkAction('');
                  setAssignStaff('');
                  setPriority('');
                  setAddComments('');
                  setApprovalWorkflow(false);
                }}
                disabled={processingStatus === 'processing'}
              >
                Reset
              </Button>
              <Button
                variant="default"
                onClick={handleBulkProcess}
                disabled={!bulkAction || processingStatus === 'processing'}
                iconName={processingStatus === 'processing' ? 'RefreshCw' : 'Play'}
                iconPosition="left"
                iconSize={16}
                className={processingStatus === 'processing' ? 'animate-pulse' : ''}
              >
                {processingStatus === 'processing' ? 'Processing...' : 'Execute Action'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Processing Log */}
      {processingLog.length > 0 && (
        <div className="border-t border-border">
          <div className="p-6">
            <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
              Processing History
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {processingLog.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Icon 
                      name={getActionIcon(entry.action)} 
                      size={16} 
                      className={getActionColor(entry.action)} 
                    />
                    <div>
                      <div className="text-sm font-medium text-foreground">
                        {bulkActionOptions.find(opt => opt.value === entry.action)?.label}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {entry.count} applications • {formatLogTime(entry.timestamp)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {entry.status === 'processing' && (
                      <Icon name="RefreshCw" size={14} className="text-accent animate-spin" />
                    )}
                    {entry.status === 'completed' && (
                      <Icon name="CheckCircle" size={14} className="text-success" />
                    )}
                    <span className={`text-xs font-medium ${
                      entry.status === 'completed' ? 'text-success' : 
                      entry.status === 'processing' ? 'text-accent' : 'text-muted-foreground'
                    }`}>
                      {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkProcessingTools;