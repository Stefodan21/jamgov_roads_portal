import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ApplicationDetailsCard = ({ application, onClose, onStatusUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  if (!application) {
    return (
      <div className="p-6 bg-card border border-border rounded-lg">
        <div className="text-center">
          <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            Select an Application
          </h3>
          <p className="text-muted-foreground">
            Choose an application from the list to view details.
          </p>
        </div>
      </div>
    );
  }

  const getStatusConfig = (status) => {
    const configs = {
      pending_inspection: {
        color: 'text-warning',
        bgColor: 'bg-warning/10',
        label: 'Pending Inspection',
        icon: 'Clock'
      },
      in_progress: {
        color: 'text-accent',
        bgColor: 'bg-accent/10',
        label: 'In Progress',
        icon: 'RefreshCw'
      },
      urgent: {
        color: 'text-error',
        bgColor: 'bg-error/10',
        label: 'Urgent',
        icon: 'AlertTriangle'
      },
      completed: {
        color: 'text-success',
        bgColor: 'bg-success/10',
        label: 'Completed',
        icon: 'CheckCircle'
      }
    };
    return configs[status] || configs.pending_inspection;
  };

  const getPriorityConfig = (priority) => {
    const configs = {
      urgent: { color: 'text-error', label: 'Urgent', bgColor: 'bg-error/10' },
      high: { color: 'text-warning', label: 'High', bgColor: 'bg-warning/10' },
      medium: { color: 'text-accent', label: 'Medium', bgColor: 'bg-accent/10' },
      low: { color: 'text-muted-foreground', label: 'Low', bgColor: 'bg-muted' }
    };
    return configs[priority] || configs.medium;
  };

  const statusConfig = getStatusConfig(application.status);
  const priorityConfig = getPriorityConfig(application.priority);

  const handleCall = () => {
    window.location.href = `tel:${application.applicantPhone}`;
  };

  const handleNavigate = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${application.coordinates.lat},${application.coordinates.lng}`;
    window.open(url, '_blank');
  };

  const handleStatusChange = (newStatus) => {
    onStatusUpdate(application.id, newStatus);
  };

  const tabs = [
    { id: 'details', label: 'Details', icon: 'FileText' },
    { id: 'requirements', label: 'Requirements', icon: 'CheckSquare' },
    { id: 'history', label: 'History', icon: 'History' },
    { id: 'location', label: 'Location', icon: 'MapPin' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm font-mono text-muted-foreground">
                {application.id}
              </span>
              <div className={`
                px-2 py-1 rounded-full text-xs font-medium
                ${priorityConfig.color} ${priorityConfig.bgColor}
              `}>
                {priorityConfig.label} Priority
              </div>
            </div>
            <h2 className="text-lg font-heading font-semibold text-foreground mb-1">
              {application.permitType}
            </h2>
            <p className="text-sm text-muted-foreground">
              {application.applicantName}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className={`
              flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium
              ${statusConfig.color} ${statusConfig.bgColor}
            `}>
              <Icon name={statusConfig.icon} size={14} />
              <span>{statusConfig.label}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              iconSize={16}
              onClick={onClose}
              className="lg:hidden"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Phone"
            iconPosition="left"
            iconSize={14}
            onClick={handleCall}
            className="flex-1"
          >
            Call
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="Navigation"
            iconPosition="left"
            iconSize={14}
            onClick={handleNavigate}
            className="flex-1"
          >
            Navigate
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors
                ${activeTab === tab.id
                  ? 'border-primary text-primary bg-primary/5' :'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }
              `}
            >
              <Icon name={tab.icon} size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4 max-h-96 overflow-y-auto">
        {activeTab === 'details' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Inspection Type
                </label>
                <p className="text-sm text-foreground mt-1">
                  {application.inspectionType}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Scheduled Date
                </label>
                <p className="text-sm text-foreground mt-1">
                  {new Date(application.scheduledDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Distance
                </label>
                <p className="text-sm text-foreground mt-1">
                  {application.distance} km ({application.travelTime})
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Phone
                </label>
                <p className="text-sm text-foreground mt-1">
                  {application.applicantPhone}
                </p>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Site Address
              </label>
              <p className="text-sm text-foreground mt-1">
                {application.siteAddress}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Notes
              </label>
              <p className="text-sm text-foreground mt-1">
                {application.notes}
              </p>
            </div>
          </div>
        )}

        {activeTab === 'requirements' && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground">
              Inspection Requirements
            </h3>
            <div className="space-y-2">
              {application.requirements.map((requirement, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 bg-muted rounded-lg"
                >
                  <Icon name="CheckSquare" size={16} className="text-muted-foreground" />
                  <span className="text-sm text-foreground flex-1">
                    {requirement}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Check"
                    iconSize={14}
                    className="text-success"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground">
              Visit History
            </h3>
            <div className="space-y-3">
              {application.lastVisit ? (
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="Calendar" size={14} className="text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">
                      Last Visit
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(application.lastVisit).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Previous inspection completed. Minor compliance issues identified.
                  </p>
                </div>
              ) : (
                <div className="text-center py-4">
                  <Icon name="Calendar" size={32} className="text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No previous visits recorded
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'location' && (
          <div className="space-y-4">
            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
              <iframe
                width="100%"
                height="100%"
                loading="lazy"
                title={application.siteAddress}
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${application.coordinates.lat},${application.coordinates.lng}&z=16&output=embed`}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label className="text-muted-foreground">Latitude</label>
                <p className="text-foreground font-mono">
                  {application.coordinates.lat}
                </p>
              </div>
              <div>
                <label className="text-muted-foreground">Longitude</label>
                <p className="text-foreground font-mono">
                  {application.coordinates.lng}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status Update Actions */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Play"
            iconPosition="left"
            iconSize={14}
            onClick={() => handleStatusChange('in_progress')}
            disabled={application.status === 'in_progress'}
          >
            Start Inspection
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="CheckCircle"
            iconPosition="left"
            iconSize={14}
            onClick={() => handleStatusChange('completed')}
            disabled={application.status === 'completed'}
          >
            Complete
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="AlertTriangle"
            iconPosition="left"
            iconSize={14}
            onClick={() => handleStatusChange('urgent')}
            className="text-warning"
          >
            Mark Urgent
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailsCard;