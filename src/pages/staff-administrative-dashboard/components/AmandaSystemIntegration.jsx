import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import DocumentStatusIndicator from '../../../components/ui/DocumentStatusIndicator';

const AmandaSystemIntegration = () => {
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [syncStatus, setSyncStatus] = useState('synced');
  const [lastSync, setLastSync] = useState(new Date());
  const [dataConflicts, setDataConflicts] = useState([]);
  const [systemHealth, setSystemHealth] = useState({});
  const [permitData, setPermitData] = useState([]);

  useEffect(() => {
    // Mock Amanda 7 system data
    const mockSystemHealth = {
      uptime: 99.7,
      responseTime: 245,
      activeConnections: 12,
      queuedRequests: 3,
      errorRate: 0.2,
      lastHealthCheck: new Date()
    };

    const mockPermitData = [
      {
        id: 'PER-2025-001',
        type: 'Construction Permit',
        status: 'active',
        applicant: 'Marcus Campbell',
        issuedDate: '2025-01-10',
        expiryDate: '2025-07-10',
        amandaId: 'AMD-789123',
        syncStatus: 'synced'
      },
      {
        id: 'PER-2025-002',
        type: 'Infrastructure License',
        status: 'pending',
        applicant: 'Jennifer Brown',
        issuedDate: null,
        expiryDate: null,
        amandaId: 'AMD-789124',
        syncStatus: 'conflict'
      },
      {
        id: 'PER-2025-003',
        type: 'Utility Connection',
        status: 'expired',
        applicant: 'David Wilson',
        issuedDate: '2024-06-15',
        expiryDate: '2025-01-15',
        amandaId: 'AMD-789125',
        syncStatus: 'synced'
      }
    ];

    const mockConflicts = [
      {
        id: 'CONF-001',
        type: 'Data Mismatch',
        description: 'Permit status differs between systems',
        permitId: 'PER-2025-002',
        localValue: 'approved',
        amandaValue: 'pending',
        timestamp: new Date('2025-01-16T10:30:00'),
        severity: 'medium'
      },
      {
        id: 'CONF-002',
        type: 'Missing Record',
        description: 'Record exists in Amanda but not in local system',
        permitId: 'AMD-789126',
        localValue: null,
        amandaValue: 'active',
        timestamp: new Date('2025-01-16T09:15:00'),
        severity: 'high'
      }
    ];

    setSystemHealth(mockSystemHealth);
    setPermitData(mockPermitData);
    setDataConflicts(mockConflicts);
  }, []);

  const handleSync = () => {
    setSyncStatus('syncing');
    setTimeout(() => {
      setSyncStatus('synced');
      setLastSync(new Date());
    }, 3000);
  };

  const handleResolveConflict = (conflictId, resolution) => {
    setDataConflicts(prev => 
      prev.filter(conflict => conflict.id !== conflictId)
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'text-success';
      case 'disconnected': return 'text-error';
      case 'connecting': return 'text-warning';
      default: return 'text-muted-foreground';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-error bg-error/10';
      case 'medium': return 'text-warning bg-warning/10';
      case 'low': return 'text-success bg-success/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-JM', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Database" size={20} className="text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-heading font-semibold text-foreground">
              Amanda 7 Integration
            </h2>
            <p className="text-sm text-muted-foreground">
              Permit management system synchronization
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
            connectionStatus === 'connected' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              connectionStatus === 'connected' ? 'bg-success' : 'bg-error'
            }`}></div>
            <span>{connectionStatus.charAt(0).toUpperCase() + connectionStatus.slice(1)}</span>
          </div>
        </div>
      </div>

      {/* System Health Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Icon name="Activity" size={16} className="text-success" />
            <span className="text-xs text-muted-foreground">Uptime</span>
          </div>
          <div className="text-2xl font-bold text-foreground">{systemHealth.uptime}%</div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Icon name="Zap" size={16} className="text-accent" />
            <span className="text-xs text-muted-foreground">Response Time</span>
          </div>
          <div className="text-2xl font-bold text-foreground">{systemHealth.responseTime}ms</div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Icon name="Users" size={16} className="text-primary" />
            <span className="text-xs text-muted-foreground">Active Connections</span>
          </div>
          <div className="text-2xl font-bold text-foreground">{systemHealth.activeConnections}</div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Icon name="AlertTriangle" size={16} className="text-warning" />
            <span className="text-xs text-muted-foreground">Error Rate</span>
          </div>
          <div className="text-2xl font-bold text-foreground">{systemHealth.errorRate}%</div>
        </div>
      </div>

      {/* Sync Status and Controls */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-heading font-semibold text-foreground">
            Synchronization Status
          </h3>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-muted-foreground">
              Last sync: {formatTime(lastSync)}
            </span>
            <Button
              variant="outline"
              size="sm"
              iconName={syncStatus === 'syncing' ? 'RefreshCw' : 'RefreshCw'}
              iconPosition="left"
              iconSize={14}
              onClick={handleSync}
              disabled={syncStatus === 'syncing'}
              className={syncStatus === 'syncing' ? 'animate-pulse' : ''}
            >
              {syncStatus === 'syncing' ? 'Syncing...' : 'Sync Now'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Sync Statistics</h4>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Records</span>
                <span className="text-foreground font-medium">1,247</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Synced Today</span>
                <span className="text-success font-medium">89</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Pending Sync</span>
                <span className="text-warning font-medium">3</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Conflicts</span>
                <span className="text-error font-medium">{dataConflicts.length}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Data Flow</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Icon name="ArrowRight" size={16} className="text-primary" />
                <span className="text-sm text-foreground">Portal → Amanda</span>
                <span className="text-xs text-success bg-success/10 px-2 py-1 rounded">Active</span>
              </div>
              <div className="flex items-center space-x-3">
                <Icon name="ArrowLeft" size={16} className="text-accent" />
                <span className="text-sm text-foreground">Amanda → Portal</span>
                <span className="text-xs text-success bg-success/10 px-2 py-1 rounded">Active</span>
              </div>
              <div className="flex items-center space-x-3">
                <Icon name="RotateCcw" size={16} className="text-warning" />
                <span className="text-sm text-foreground">Bi-directional Sync</span>
                <span className="text-xs text-success bg-success/10 px-2 py-1 rounded">Enabled</span>
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
                iconName="Download"
                iconPosition="left"
                iconSize={14}
                className="justify-start"
              >
                Export Sync Log
              </Button>
              <Button
                variant="outline"
                size="sm"
                fullWidth
                iconName="Settings"
                iconPosition="left"
                iconSize={14}
                className="justify-start"
              >
                Sync Settings
              </Button>
              <Button
                variant="outline"
                size="sm"
                fullWidth
                iconName="AlertTriangle"
                iconPosition="left"
                iconSize={14}
                className="justify-start"
              >
                View Errors
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Data Conflicts */}
      {dataConflicts.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-heading font-semibold text-foreground">
              Data Conflicts
            </h3>
            <span className="text-sm text-error bg-error/10 px-3 py-1 rounded-full">
              {dataConflicts.length} conflicts
            </span>
          </div>

          <div className="space-y-4">
            {dataConflicts.map((conflict) => (
              <div key={conflict.id} className="border border-border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Icon name="AlertTriangle" size={20} className="text-warning" />
                    <div>
                      <h4 className="font-medium text-foreground">{conflict.type}</h4>
                      <p className="text-sm text-muted-foreground">{conflict.description}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(conflict.severity)}`}>
                    {conflict.severity.charAt(0).toUpperCase() + conflict.severity.slice(1)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-muted/30 rounded-lg p-3">
                    <div className="text-xs text-muted-foreground mb-1">Local System</div>
                    <div className="text-sm font-medium text-foreground">
                      {conflict.localValue || 'No record'}
                    </div>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-3">
                    <div className="text-xs text-muted-foreground mb-1">Amanda System</div>
                    <div className="text-sm font-medium text-foreground">
                      {conflict.amandaValue}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Detected: {formatTime(conflict.timestamp)}
                  </span>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleResolveConflict(conflict.id, 'local')}
                    >
                      Use Local
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleResolveConflict(conflict.id, 'amanda')}
                    >
                      Use Amanda
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleResolveConflict(conflict.id, 'manual')}
                    >
                      Resolve Manually
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Permit Data Table */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-6">
          Recent Permit Activity
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-medium text-foreground">Permit ID</th>
                <th className="text-left p-3 font-medium text-foreground">Type</th>
                <th className="text-left p-3 font-medium text-foreground">Applicant</th>
                <th className="text-left p-3 font-medium text-foreground">Status</th>
                <th className="text-left p-3 font-medium text-foreground">Sync Status</th>
                <th className="text-left p-3 font-medium text-foreground">Amanda ID</th>
                <th className="text-left p-3 font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {permitData.map((permit) => (
                <tr key={permit.id} className="border-b border-border hover:bg-muted/30">
                  <td className="p-3 font-mono text-sm text-primary">{permit.id}</td>
                  <td className="p-3 text-sm text-foreground">{permit.type}</td>
                  <td className="p-3 text-sm text-foreground">{permit.applicant}</td>
                  <td className="p-3">
                    <DocumentStatusIndicator status={permit.status} size="sm" />
                  </td>
                  <td className="p-3">
                    <div className={`flex items-center space-x-2 ${
                      permit.syncStatus === 'synced' ? 'text-success' : 
                      permit.syncStatus === 'conflict' ? 'text-error' : 'text-warning'
                    }`}>
                      <Icon 
                        name={permit.syncStatus === 'synced' ? 'CheckCircle' : 
                              permit.syncStatus === 'conflict' ? 'AlertTriangle' : 'Clock'} 
                        size={14} 
                      />
                      <span className="text-sm capitalize">{permit.syncStatus}</span>
                    </div>
                  </td>
                  <td className="p-3 font-mono text-sm text-muted-foreground">{permit.amandaId}</td>
                  <td className="p-3">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Eye"
                        iconSize={14}
                        title="View in Amanda"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="RefreshCw"
                        iconSize={14}
                        title="Force sync"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AmandaSystemIntegration;