import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import OfflineStatusManager from '../../../components/ui/OfflineStatusManager';

const SystemAdministrationTools = () => {
  const [systemStatus, setSystemStatus] = useState({});
  const [userManagement, setUserManagement] = useState([]);
  const [securityLogs, setSecurityLogs] = useState([]);
  const [backupStatus, setBackupStatus] = useState({});
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    // Mock system status data
    const mockSystemStatus = {
      serverHealth: 'healthy',
      databaseStatus: 'connected',
      apiResponseTime: 245,
      activeUsers: 127,
      systemLoad: 68,
      memoryUsage: 72,
      diskSpace: 45,
      lastRestart: new Date('2025-01-15T02:00:00')
    };

    const mockUsers = [
      {
        id: 'USER-001',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@jamgov.jm',
        role: 'Staff',
        department: 'Processing',
        status: 'active',
        lastLogin: new Date('2025-01-16T09:30:00'),
        permissions: ['read', 'write', 'approve']
      },
      {
        id: 'USER-002',
        name: 'Michael Davis',
        email: 'michael.davis@jamgov.jm',
        role: 'Supervisor',
        department: 'Administration',
        status: 'active',
        lastLogin: new Date('2025-01-16T08:15:00'),
        permissions: ['read', 'write', 'approve', 'admin']
      },
      {
        id: 'USER-003',
        name: 'Lisa Thompson',
        email: 'lisa.thompson@jamgov.jm',
        role: 'Field Agent',
        department: 'Field Operations',
        status: 'offline',
        lastLogin: new Date('2025-01-15T16:45:00'),
        permissions: ['read', 'write']
      },
      {
        id: 'USER-004',
        name: 'Robert Garcia',
        email: 'robert.garcia@jamgov.jm',
        role: 'Staff',
        department: 'Document Review',
        status: 'suspended',
        lastLogin: new Date('2025-01-14T14:20:00'),
        permissions: ['read']
      }
    ];

    const mockSecurityLogs = [
      {
        id: 'LOG-001',
        timestamp: new Date('2025-01-16T10:30:00'),
        event: 'Login Attempt',
        user: 'sarah.johnson@jamgov.jm',
        ipAddress: '192.168.1.100',
        status: 'success',
        severity: 'info'
      },
      {
        id: 'LOG-002',
        timestamp: new Date('2025-01-16T10:25:00'),
        event: 'Failed Login',
        user: 'unknown@email.com',
        ipAddress: '203.45.67.89',
        status: 'failed',
        severity: 'warning'
      },
      {
        id: 'LOG-003',
        timestamp: new Date('2025-01-16T09:45:00'),
        event: 'Permission Change',
        user: 'admin@jamgov.jm',
        ipAddress: '192.168.1.50',
        status: 'success',
        severity: 'high'
      }
    ];

    const mockBackupStatus = {
      lastBackup: new Date('2025-01-16T02:00:00'),
      nextBackup: new Date('2025-01-17T02:00:00'),
      backupSize: '2.4 GB',
      status: 'completed',
      retentionDays: 30,
      location: 'Cloud Storage (Encrypted)'
    };

    setSystemStatus(mockSystemStatus);
    setUserManagement(mockUsers);
    setSecurityLogs(mockSecurityLogs);
    setBackupStatus(mockBackupStatus);
  }, []);

  const handleUserStatusChange = (userId, newStatus) => {
    setUserManagement(prev => 
      prev.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      )
    );
  };

  const handleBulkUserAction = (action) => {
    console.log(`Bulk action: ${action} for users:`, selectedUsers);
    setSelectedUsers([]);
  };

  const handleBackupNow = () => {
    console.log('Initiating manual backup...');
    setBackupStatus(prev => ({ ...prev, status: 'in-progress' }));
    
    setTimeout(() => {
      setBackupStatus(prev => ({ 
        ...prev, 
        status: 'completed',
        lastBackup: new Date()
      }));
    }, 3000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': case 'healthy': case 'connected': case 'completed': 
        return 'text-success bg-success/10';
      case 'offline': case 'warning': case 'in-progress':
        return 'text-warning bg-warning/10';
      case 'suspended': case 'error': case 'failed':
        return 'text-error bg-error/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-error';
      case 'warning': return 'text-warning';
      case 'info': return 'text-accent';
      default: return 'text-muted-foreground';
    }
  };

  const getHealthColor = (value, thresholds = { good: 80, warning: 60 }) => {
    if (value >= thresholds.good) return 'text-success';
    if (value >= thresholds.warning) return 'text-warning';
    return 'text-error';
  };

  const formatTime = (date) => {
    return date.toLocaleString('en-JM', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const roleOptions = [
    { value: 'all', label: 'All Roles' },
    { value: 'Staff', label: 'Staff' },
    { value: 'Supervisor', label: 'Supervisor' },
    { value: 'Field Agent', label: 'Field Agent' },
    { value: 'Administrator', label: 'Administrator' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Settings" size={20} className="text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-heading font-semibold text-foreground">
              System Administration
            </h2>
            <p className="text-sm text-muted-foreground">
              Manage users, security, and system health
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <OfflineStatusManager showDetails={false} />
          <Button
            variant="outline"
            size="sm"
            iconName="RefreshCw"
            iconSize={14}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Icon name="Server" size={16} className="text-success" />
            <span className="text-xs text-muted-foreground">Server</span>
          </div>
          <div className={`text-lg font-bold ${getStatusColor(systemStatus.serverHealth).split(' ')[0]}`}>
            {systemStatus.serverHealth?.charAt(0).toUpperCase() + systemStatus.serverHealth?.slice(1)}
          </div>
          <div className="text-xs text-muted-foreground">
            Uptime: 99.8%
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Icon name="Database" size={16} className="text-success" />
            <span className="text-xs text-muted-foreground">Database</span>
          </div>
          <div className={`text-lg font-bold ${getStatusColor(systemStatus.databaseStatus).split(' ')[0]}`}>
            Connected
          </div>
          <div className="text-xs text-muted-foreground">
            Response: {systemStatus.apiResponseTime}ms
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Icon name="Users" size={16} className="text-accent" />
            <span className="text-xs text-muted-foreground">Active Users</span>
          </div>
          <div className="text-lg font-bold text-foreground">{systemStatus.activeUsers}</div>
          <div className="text-xs text-muted-foreground">
            Peak: 156 users
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Icon name="Activity" size={16} className={getHealthColor(100 - systemStatus.systemLoad)} />
            <span className="text-xs text-muted-foreground">System Load</span>
          </div>
          <div className={`text-lg font-bold ${getHealthColor(100 - systemStatus.systemLoad)}`}>
            {systemStatus.systemLoad}%
          </div>
          <div className="text-xs text-muted-foreground">
            Memory: {systemStatus.memoryUsage}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Management */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-heading font-semibold text-foreground">
              User Management
            </h3>
            <div className="flex items-center space-x-2">
              <Select
                options={roleOptions}
                value="all"
                onChange={() => {}}
                className="w-32"
              />
              <Button
                variant="outline"
                size="sm"
                iconName="UserPlus"
                iconSize={14}
              >
                Add User
              </Button>
            </div>
          </div>

          {selectedUsers.length > 0 && (
            <div className="mb-4 p-3 bg-accent/10 border border-accent/20 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-accent">
                  {selectedUsers.length} users selected
                </span>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleBulkUserAction('activate')}
                  >
                    Activate
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleBulkUserAction('suspend')}
                  >
                    Suspend
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedUsers([])}
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {userManagement.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={selectedUsers.includes(user.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers(prev => [...prev, user.id]);
                      } else {
                        setSelectedUsers(prev => prev.filter(id => id !== user.id));
                      }
                    }}
                  />
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-xs text-primary-foreground font-medium">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{user.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {user.role} • {user.department}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                    {user.status}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Edit"
                      iconSize={14}
                      title="Edit user"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName={user.status === 'active' ? 'UserX' : 'UserCheck'}
                      iconSize={14}
                      onClick={() => handleUserStatusChange(
                        user.id, 
                        user.status === 'active' ? 'suspended' : 'active'
                      )}
                      title={user.status === 'active' ? 'Suspend user' : 'Activate user'}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Monitoring */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-heading font-semibold text-foreground">
              Security Logs
            </h3>
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              iconSize={14}
            >
              Export Logs
            </Button>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {securityLogs.map((log) => (
              <div key={log.id} className="p-3 border border-border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Icon 
                      name={log.severity === 'high' ? 'AlertTriangle' : 
                            log.severity === 'warning' ? 'AlertCircle' : 'Info'} 
                      size={16} 
                      className={getSeverityColor(log.severity)} 
                    />
                    <span className="font-medium text-foreground">{log.event}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                    {log.status}
                  </span>
                </div>
                
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>User: {log.user}</div>
                  <div>IP: {log.ipAddress}</div>
                  <div>Time: {formatTime(log.timestamp)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Backup and Recovery */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-heading font-semibold text-foreground">
            Backup & Recovery
          </h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              iconSize={14}
            >
              Download Backup
            </Button>
            <Button
              variant="default"
              size="sm"
              iconName="Save"
              iconSize={14}
              onClick={handleBackupNow}
              disabled={backupStatus.status === 'in-progress'}
            >
              {backupStatus.status === 'in-progress' ? 'Backing up...' : 'Backup Now'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Backup Status</h4>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status:</span>
                <span className={`font-medium ${getStatusColor(backupStatus.status).split(' ')[0]}`}>
                  {backupStatus.status?.charAt(0).toUpperCase() + backupStatus.status?.slice(1)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Last Backup:</span>
                <span className="text-foreground">{formatTime(backupStatus.lastBackup)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Next Backup:</span>
                <span className="text-foreground">{formatTime(backupStatus.nextBackup)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Backup Size:</span>
                <span className="text-foreground">{backupStatus.backupSize}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Configuration</h4>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Retention:</span>
                <span className="text-foreground">{backupStatus.retentionDays} days</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Location:</span>
                <span className="text-foreground">{backupStatus.location}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Encryption:</span>
                <span className="text-success">Enabled</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Compression:</span>
                <span className="text-success">Enabled</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Quick Actions</h4>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                fullWidth
                iconName="Settings"
                iconPosition="left"
                iconSize={14}
                className="justify-start"
              >
                Backup Settings
              </Button>
              <Button
                variant="outline"
                size="sm"
                fullWidth
                iconName="RotateCcw"
                iconPosition="left"
                iconSize={14}
                className="justify-start"
              >
                Restore Data
              </Button>
              <Button
                variant="outline"
                size="sm"
                fullWidth
                iconName="FileText"
                iconPosition="left"
                iconSize={14}
                className="justify-start"
              >
                Backup History
              </Button>
              <Button
                variant="outline"
                size="sm"
                fullWidth
                iconName="TestTube"
                iconPosition="left"
                iconSize={14}
                className="justify-start"
              >
                Test Recovery
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemAdministrationTools;