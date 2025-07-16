import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Button from './Button';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState('citizen'); // citizen, staff, field-agent
  const location = useLocation();
  const navigate = useNavigate();

  // Mock user role detection based on current route
  useEffect(() => {
    if (location.pathname.includes('staff-administrative')) {
      setUserRole('staff');
    } else if (location.pathname.includes('field-agent')) {
      setUserRole('field-agent');
    } else {
      setUserRole('citizen');
    }
  }, [location.pathname]);

  const navigationItems = {
    citizen: [
      { label: 'Dashboard', path: '/citizen-dashboard', icon: 'Home' },
      { label: 'Apply for Services', path: '/application-submission-portal', icon: 'FileText' },
      { label: 'My Documents', path: '/document-management-center', icon: 'Folder' },
    ],
    staff: [
      { label: 'Admin Dashboard', path: '/staff-administrative-dashboard', icon: 'BarChart3' },
      { label: 'Applications', path: '/application-submission-portal', icon: 'FileText' },
      { label: 'Document Center', path: '/document-management-center', icon: 'Folder' },
    ],
    'field-agent': [
      { label: 'Field Interface', path: '/field-agent-mobile-interface', icon: 'MapPin' },
      { label: 'Documents', path: '/document-management-center', icon: 'Folder' },
    ]
  };

  const currentNavItems = navigationItems[userRole] || navigationItems.citizen;

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    navigate('/citizen-login-registration');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const getRoleDisplayName = () => {
    switch (userRole) {
      case 'staff': return 'Staff Portal';
      case 'field-agent': return 'Field Agent';
      default: return 'Citizen Portal';
    }
  };

  return (
    <header className="sticky top-0 z-navigation bg-card border-b border-border shadow-elevation-1">
      <div className="w-full">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              {/* Jamaica Government Seal */}
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-primary-foreground">
                  <path
                    fill="currentColor"
                    d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"
                  />
                  <circle cx="12" cy="12" r="3" fill="var(--color-secondary)" />
                </svg>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-heading font-semibold text-foreground">
                  JamGov Roads Portal
                </h1>
                <p className="text-xs font-caption text-muted-foreground">
                  {getRoleDisplayName()}
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {currentNavItems.map((item) => (
              <Button
                key={item.path}
                variant={isActivePath(item.path) ? "default" : "ghost"}
                onClick={() => handleNavigation(item.path)}
                iconName={item.icon}
                iconPosition="left"
                iconSize={18}
                className="min-w-touch"
              >
                {item.label}
              </Button>
            ))}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-2">
            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              iconName="Bell"
              iconSize={20}
              className="hidden sm:flex min-w-touch min-h-touch"
              onClick={() => {}}
            />

            {/* User Menu */}
            <div className="hidden sm:flex items-center space-x-2">
              <Button
                variant="outline"
                iconName="User"
                iconPosition="left"
                iconSize={18}
                onClick={() => {}}
              >
                Profile
              </Button>
              <Button
                variant="ghost"
                iconName="LogOut"
                iconPosition="left"
                iconSize={18}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              iconName={isMobileMenuOpen ? "X" : "Menu"}
              iconSize={24}
              className="lg:hidden min-w-touch min-h-touch"
              onClick={toggleMobileMenu}
            />
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-card animate-slide-down">
            <nav className="px-4 py-4 space-y-2">
              {currentNavItems.map((item) => (
                <Button
                  key={item.path}
                  variant={isActivePath(item.path) ? "default" : "ghost"}
                  fullWidth
                  onClick={() => handleNavigation(item.path)}
                  iconName={item.icon}
                  iconPosition="left"
                  iconSize={18}
                  className="justify-start min-h-touch"
                >
                  {item.label}
                </Button>
              ))}
              
              <div className="pt-4 mt-4 border-t border-border space-y-2">
                <Button
                  variant="ghost"
                  fullWidth
                  iconName="Bell"
                  iconPosition="left"
                  iconSize={18}
                  className="justify-start min-h-touch"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Notifications
                </Button>
                <Button
                  variant="ghost"
                  fullWidth
                  iconName="User"
                  iconPosition="left"
                  iconSize={18}
                  className="justify-start min-h-touch"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Profile
                </Button>
                <Button
                  variant="ghost"
                  fullWidth
                  iconName="LogOut"
                  iconPosition="left"
                  iconSize={18}
                  className="justify-start min-h-touch text-error"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;