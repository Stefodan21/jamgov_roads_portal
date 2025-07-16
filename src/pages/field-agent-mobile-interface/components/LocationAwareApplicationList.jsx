import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LocationAwareApplicationList = ({ onApplicationSelect, selectedApplicationId }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [sortBy, setSortBy] = useState('distance');
  const [filterStatus, setFilterStatus] = useState('all');

  const mockApplications = [
    {
      id: "APP-2025-001",
      permitType: "Road Construction Permit",
      applicantName: "Marcus Thompson",
      applicantPhone: "+1-876-555-0123",
      siteAddress: "45 Spanish Town Road, Kingston 11",
      coordinates: { lat: 18.0179, lng: -76.8099 },
      distance: 0.8,
      travelTime: "3 min",
      status: "pending_inspection",
      priority: "high",
      scheduledDate: "2025-07-16",
      inspectionType: "Initial Site Visit",
      requirements: ["Site survey", "Traffic impact assessment", "Safety compliance check"],
      lastVisit: null,
      notes: "New construction project requiring full compliance review"
    },
    {
      id: "APP-2025-002", 
      permitType: "Drainage System Permit",
      applicantName: "Sarah Williams",
      applicantPhone: "+1-876-555-0456",
      siteAddress: "78 Hope Road, Kingston 6",
      coordinates: { lat: 18.0206, lng: -76.7936 },
      distance: 1.2,
      travelTime: "5 min",
      status: "in_progress",
      priority: "medium",
      scheduledDate: "2025-07-16",
      inspectionType: "Follow-up Inspection",
      requirements: ["Drainage flow check", "Environmental compliance", "Documentation review"],
      lastVisit: "2025-07-10",
      notes: "Previous inspection identified minor compliance issues"
    },
    {
      id: "APP-2025-003",
      permitType: "Sidewalk Repair Permit",
      applicantName: "David Brown",
      applicantPhone: "+1-876-555-0789",
      siteAddress: "156 Constant Spring Road, Kingston 10",
      coordinates: { lat: 18.0292, lng: -76.7980 },
      distance: 2.1,
      travelTime: "8 min",
      status: "pending_inspection",
      priority: "low",
      scheduledDate: "2025-07-17",
      inspectionType: "Final Inspection",
      requirements: ["Quality assessment", "Safety verification", "Completion sign-off"],
      lastVisit: "2025-07-12",
      notes: "Ready for final approval pending quality check"
    },
    {
      id: "APP-2025-004",
      permitType: "Bridge Maintenance Permit",
      applicantName: "Jennifer Davis",
      applicantPhone: "+1-876-555-0321",
      siteAddress: "Rio Cobre Bridge, Spanish Town",
      coordinates: { lat: 17.9909, lng: -76.9570 },
      distance: 4.5,
      travelTime: "15 min",
      status: "urgent",
      priority: "urgent",
      scheduledDate: "2025-07-16",
      inspectionType: "Emergency Assessment",
      requirements: ["Structural integrity check", "Safety barrier inspection", "Traffic flow analysis"],
      lastVisit: "2025-07-14",
      notes: "Urgent structural concerns reported by maintenance team"
    }
  ];

  const [applications, setApplications] = useState(mockApplications);

  useEffect(() => {
    // Simulate getting current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Location access denied, using default location');
          setCurrentLocation({ lat: 18.0179, lng: -76.8099 }); // Kingston default
        }
      );
    }
  }, []);

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
      urgent: { color: 'text-error', label: 'Urgent' },
      high: { color: 'text-warning', label: 'High' },
      medium: { color: 'text-accent', label: 'Medium' },
      low: { color: 'text-muted-foreground', label: 'Low' }
    };
    return configs[priority] || configs.medium;
  };

  const sortApplications = (apps, sortType) => {
    switch (sortType) {
      case 'distance':
        return [...apps].sort((a, b) => a.distance - b.distance);
      case 'priority':
        const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
        return [...apps].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
      case 'scheduled':
        return [...apps].sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));
      default:
        return apps;
    }
  };

  const filterApplications = (apps, filter) => {
    if (filter === 'all') return apps;
    return apps.filter(app => app.status === filter);
  };

  const filteredAndSortedApps = sortApplications(
    filterApplications(applications, filterStatus),
    sortBy
  );

  const handleNavigate = (application) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${application.coordinates.lat},${application.coordinates.lng}`;
    window.open(url, '_blank');
  };

  const handleCall = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  return (
    <div className="space-y-4">
      {/* Header with Location */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon name="MapPin" size={20} className="text-primary" />
          <div>
            <h2 className="text-lg font-heading font-semibold text-foreground">
              Nearby Inspections
            </h2>
            <p className="text-sm text-muted-foreground">
              {currentLocation ? 'Location detected' : 'Using default location'}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          iconName="RefreshCw"
          iconSize={16}
          onClick={() => window.location.reload()}
        />
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-2 bg-input border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="distance">Sort by Distance</option>
            <option value="priority">Sort by Priority</option>
            <option value="scheduled">Sort by Schedule</option>
          </select>
        </div>
        <div className="flex-1">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-3 py-2 bg-input border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Status</option>
            <option value="pending_inspection">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-3">
        {filteredAndSortedApps.map((application) => {
          const statusConfig = getStatusConfig(application.status);
          const priorityConfig = getPriorityConfig(application.priority);
          const isSelected = selectedApplicationId === application.id;

          return (
            <div
              key={application.id}
              className={`
                p-4 bg-card border rounded-lg cursor-pointer transition-all duration-200
                ${isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
              `}
              onClick={() => onApplicationSelect(application)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-mono text-muted-foreground">
                      {application.id}
                    </span>
                    <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityConfig.color} bg-opacity-10`}>
                      {priorityConfig.label}
                    </div>
                  </div>
                  <h3 className="font-medium text-foreground truncate">
                    {application.permitType}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {application.applicantName}
                  </p>
                </div>
                
                <div className={`
                  flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium
                  ${statusConfig.color} ${statusConfig.bgColor}
                `}>
                  <Icon name={statusConfig.icon} size={12} />
                  <span>{statusConfig.label}</span>
                </div>
              </div>

              {/* Location and Distance */}
              <div className="flex items-center space-x-2 mb-3">
                <Icon name="MapPin" size={14} className="text-muted-foreground" />
                <span className="text-sm text-foreground flex-1 truncate">
                  {application.siteAddress}
                </span>
                <div className="flex items-center space-x-1 text-sm text-accent">
                  <Icon name="Navigation" size={12} />
                  <span>{application.distance} km</span>
                  <span className="text-muted-foreground">•</span>
                  <span>{application.travelTime}</span>
                </div>
              </div>

              {/* Inspection Details */}
              <div className="space-y-2 mb-3">
                <div className="flex items-center space-x-2">
                  <Icon name="Calendar" size={14} className="text-muted-foreground" />
                  <span className="text-sm text-foreground">
                    {application.inspectionType}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    • {new Date(application.scheduledDate).toLocaleDateString()}
                  </span>
                </div>
                
                {application.lastVisit && (
                  <div className="flex items-center space-x-2">
                    <Icon name="History" size={14} className="text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Last visit: {new Date(application.lastVisit).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              {/* Requirements Preview */}
              <div className="mb-3">
                <div className="flex flex-wrap gap-1">
                  {application.requirements.slice(0, 2).map((req, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-muted text-xs text-muted-foreground rounded"
                    >
                      {req}
                    </span>
                  ))}
                  {application.requirements.length > 2 && (
                    <span className="px-2 py-1 bg-muted text-xs text-muted-foreground rounded">
                      +{application.requirements.length - 2} more
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Navigation"
                  iconPosition="left"
                  iconSize={14}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNavigate(application);
                  }}
                  className="flex-1"
                >
                  Navigate
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Phone"
                  iconSize={16}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCall(application.applicantPhone);
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {filteredAndSortedApps.length === 0 && (
        <div className="text-center py-8">
          <Icon name="MapPin" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            No Applications Found
          </h3>
          <p className="text-muted-foreground">
            No applications match your current filters.
          </p>
        </div>
      )}
    </div>
  );
};

export default LocationAwareApplicationList;