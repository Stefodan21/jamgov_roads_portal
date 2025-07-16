import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NotificationCenter = ({ className = '' }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'status-update',
      title: 'Application Status Updated',
      message: 'Your Road Work Permit application (RWP-240714-001) has moved to Document Verification stage.',
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
      read: false,
      priority: 'high',
      actionRequired: false,
      applicationId: 'RWP-240714-001'
    },
    {
      id: 2,
      type: 'document-request',
      title: 'Additional Documents Required',
      message: 'Please upload your updated site plan for Construction License application CL-240712-002.',
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      read: false,
      priority: 'high',
      actionRequired: true,
      applicationId: 'CL-240712-002'
    },
    {
      id: 3,
      type: 'payment-reminder',
      title: 'Payment Reminder',
      message: 'Payment of J$45,000 is required to proceed with your Construction License application.',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      read: false,
      priority: 'medium',
      actionRequired: true,
      applicationId: 'CL-240712-002'
    },
    {
      id: 4,
      type: 'approval',
      title: 'Application Approved',
      message: 'Congratulations! Your Infrastructure Request (IR-240710-003) has been approved.',
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      read: true,
      priority: 'low',
      actionRequired: false,
      applicationId: 'IR-240710-003'
    },
    {
      id: 5,
      type: 'system',
      title: 'System Maintenance Notice',
      message: 'Scheduled maintenance on July 20th from 2:00 AM to 6:00 AM. Some services may be temporarily unavailable.',
      timestamp: new Date(Date.now() - 86400000), // 1 day ago
      read: true,
      priority: 'low',
      actionRequired: false,
      applicationId: null
    }
  ]);

  const [filter, setFilter] = useState('all');

  const notificationConfig = {
    'status-update': {
      icon: 'Bell',
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    },
    'document-request': {
      icon: 'FileText',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    'payment-reminder': {
      icon: 'CreditCard',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    'approval': {
      icon: 'CheckCircle',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    'rejection': {
      icon: 'XCircle',
      color: 'text-error',
      bgColor: 'bg-error/10'
    },
    'system': {
      icon: 'Settings',
      color: 'text-muted-foreground',
      bgColor: 'bg-muted'
    }
  };

  const filterOptions = [
    { value: 'all', label: 'All', count: notifications.length },
    { value: 'unread', label: 'Unread', count: notifications.filter(n => !n.read).length },
    { value: 'action-required', label: 'Action Required', count: notifications.filter(n => n.actionRequired).length },
    { value: 'high-priority', label: 'High Priority', count: notifications.filter(n => n.priority === 'high').length }
  ];

  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification.read;
      case 'action-required':
        return notification.actionRequired;
      case 'high-priority':
        return notification.priority === 'high';
      default:
        return true;
    }
  });

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getPriorityIndicator = (priority) => {
    switch (priority) {
      case 'high':
        return <div className="w-2 h-2 bg-error rounded-full" />;
      case 'medium':
        return <div className="w-2 h-2 bg-warning rounded-full" />;
      default:
        return <div className="w-2 h-2 bg-success rounded-full" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className={`bg-card border border-border rounded-lg ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icon name="Bell" size={20} className="text-primary" />
            <h2 className="text-lg font-heading font-semibold text-foreground">
              Notifications
            </h2>
            {unreadCount > 0 && (
              <div className="bg-error text-error-foreground text-xs px-2 py-1 rounded-full font-medium">
                {unreadCount}
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              iconName="CheckCheck"
              iconSize={14}
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              Mark All Read
            </Button>
            <Button
              variant="ghost"
              size="sm"
              iconName="Settings"
              iconSize={14}
            >
              Settings
            </Button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 mt-4 overflow-x-auto">
          {filterOptions.map((option) => (
            <Button
              key={option.value}
              variant={filter === option.value ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter(option.value)}
              className="whitespace-nowrap text-xs"
            >
              {option.label}
              {option.count > 0 && (
                <span className="ml-1 opacity-70">({option.count})</span>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {filteredNotifications.length > 0 ? (
          <div className="divide-y divide-border">
            {filteredNotifications.map((notification) => {
              const config = notificationConfig[notification.type] || notificationConfig.system;
              
              return (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-muted/50 transition-colors duration-200 ${
                    !notification.read ? 'bg-accent/5' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {/* Icon */}
                    <div className={`w-8 h-8 rounded-full ${config.bgColor} flex items-center justify-center flex-shrink-0`}>
                      <Icon name={config.icon} size={16} className={config.color} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className={`text-sm font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                              {notification.title}
                            </h3>
                            {getPriorityIndicator(notification.priority)}
                            {notification.actionRequired && (
                              <div className="bg-warning text-warning-foreground text-xs px-2 py-0.5 rounded-full font-medium">
                                Action Required
                              </div>
                            )}
                          </div>
                          
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>{formatTimestamp(notification.timestamp)}</span>
                            {notification.applicationId && (
                              <span className="font-mono">{notification.applicationId}</span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-1 ml-2">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              iconName="Check"
                              iconSize={14}
                              onClick={() => markAsRead(notification.id)}
                              className="h-8 w-8 p-0"
                              title="Mark as read"
                            />
                          )}
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            iconName="Trash2"
                            iconSize={14}
                            onClick={() => deleteNotification(notification.id)}
                            className="h-8 w-8 p-0 text-error hover:text-error"
                            title="Delete notification"
                          />
                        </div>
                      </div>

                      {/* Action Buttons */}
                      {notification.actionRequired && (
                        <div className="flex space-x-2 mt-3">
                          {notification.type === 'document-request' && (
                            <Button
                              variant="outline"
                              size="sm"
                              iconName="Upload"
                              iconPosition="left"
                              iconSize={14}
                            >
                              Upload Documents
                            </Button>
                          )}
                          
                          {notification.type === 'payment-reminder' && (
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
                            iconName="ExternalLink"
                            iconPosition="right"
                            iconSize={14}
                          >
                            View Application
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center">
            <Icon name="Bell" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
              No Notifications
            </h3>
            <p className="text-muted-foreground">
              {filter === 'all' ?'You\'re all caught up! No new notifications.'
                : `No notifications match the "${filterOptions.find(f => f.value === filter)?.label}" filter.`
              }
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      {filteredNotifications.length > 0 && (
        <div className="p-4 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            iconName="Archive"
            iconPosition="left"
            iconSize={14}
            fullWidth
          >
            Archive All Notifications
          </Button>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;