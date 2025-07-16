import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const RoleBasedNavigation = ({ userRole = 'citizen', className = '' }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const navigationConfig = {
    citizen: {
      primary: [
        { 
          label: 'Dashboard', 
          path: '/citizen-dashboard', 
          icon: 'Home',
          tooltip: 'View your personal dashboard and recent activities'
        },
        { 
          label: 'Apply for Services', 
          path: '/application-submission-portal', 
          icon: 'FileText',
          tooltip: 'Submit new applications for government services'
        },
        { 
          label: 'My Documents', 
          path: '/document-management-center', 
          icon: 'Folder',
          tooltip: 'Manage and view your uploaded documents'
        },
      ],
      secondary: [
        { label: 'Help & Support', icon: 'HelpCircle', action: 'help' },
        { label: 'Settings', icon: 'Settings', action: 'settings' },
      ]
    },
    staff: {
      primary: [
        { 
          label: 'Admin Dashboard', 
          path: '/staff-administrative-dashboard', 
          icon: 'BarChart3',
          tooltip: 'Access administrative tools and system analytics'
        },
        { 
          label: 'Process Applications', 
          path: '/application-submission-portal', 
          icon: 'FileCheck',
          tooltip: 'Review and process citizen applications'
        },
        { 
          label: 'Document Center', 
          path: '/document-management-center', 
          icon: 'Archive',
          tooltip: 'Centralized document management and verification'
        },
      ],
      secondary: [
        { label: 'Reports', icon: 'FileBarChart', action: 'reports' },
        { label: 'User Management', icon: 'Users', action: 'users' },
        { label: 'System Settings', icon: 'Settings', action: 'settings' },
      ]
    },
    'field-agent': {
      primary: [
        { 
          label: 'Field Interface', 
          path: '/field-agent-mobile-interface', 
          icon: 'MapPin',
          tooltip: 'Mobile-optimized interface for field operations'
        },
        { 
          label: 'Documents', 
          path: '/document-management-center', 
          icon: 'Camera',
          tooltip: 'Capture and manage field documentation'
        },
      ],
      secondary: [
        { label: 'Sync Status', icon: 'RefreshCw', action: 'sync' },
        { label: 'Offline Mode', icon: 'Wifi', action: 'offline' },
      ]
    }
  };

  const currentConfig = navigationConfig[userRole] || navigationConfig.citizen;

  const handleNavigation = (path) => {
    if (path) {
      navigate(path);
    }
    setActiveDropdown(null);
  };

  const handleAction = (action) => {
    console.log(`Executing action: ${action}`);
    setActiveDropdown(null);
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const toggleDropdown = (dropdownId) => {
    setActiveDropdown(activeDropdown === dropdownId ? null : dropdownId);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <nav className={`flex items-center space-x-1 ${className}`} role="navigation" aria-label="Main navigation">
      {/* Primary Navigation Items */}
      {currentConfig.primary.map((item) => (
        <div key={item.path || item.label} className="relative">
          <Button
            variant={isActivePath(item.path) ? "default" : "ghost"}
            onClick={() => handleNavigation(item.path)}
            iconName={item.icon}
            iconPosition="left"
            iconSize={18}
            className="min-w-touch transition-all duration-200"
            title={item.tooltip}
          >
            {item.label}
          </Button>
        </div>
      ))}

      {/* Secondary Actions Dropdown */}
      {currentConfig.secondary && currentConfig.secondary.length > 0 && (
        <div className="relative dropdown-container">
          <Button
            variant="ghost"
            onClick={() => toggleDropdown('secondary')}
            iconName="MoreHorizontal"
            iconSize={18}
            className="min-w-touch"
            title="More options"
          />
          
          {activeDropdown === 'secondary' && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-md shadow-elevation-2 z-dropdown animate-slide-down">
              <div className="py-2">
                {currentConfig.secondary.map((item) => (
                  <button
                    key={item.action}
                    onClick={() => handleAction(item.action)}
                    className="w-full px-4 py-2 text-left text-sm text-popover-foreground hover:bg-muted transition-colors duration-200 flex items-center space-x-3 min-h-touch"
                  >
                    <Icon name={item.icon} size={16} />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Role Indicator */}
      <div className="hidden lg:flex items-center ml-4 px-3 py-1 bg-muted rounded-full">
        <Icon 
          name={userRole === 'staff' ? 'Shield' : userRole === 'field-agent' ? 'MapPin' : 'User'} 
          size={14} 
          className="text-muted-foreground mr-2" 
        />
        <span className="text-xs font-caption text-muted-foreground capitalize">
          {userRole.replace('-', ' ')}
        </span>
      </div>
    </nav>
  );
};

export default RoleBasedNavigation;