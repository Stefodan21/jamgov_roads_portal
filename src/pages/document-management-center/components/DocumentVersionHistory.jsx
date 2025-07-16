import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DocumentVersionHistory = ({ document, isOpen, onClose, onRestore }) => {
  const [selectedVersion, setSelectedVersion] = useState(null);

  if (!isOpen || !document) return null;

  const mockVersions = [
    {
      id: 'v3',
      version: '3.0',
      uploadDate: new Date(Date.now() - 86400000), // 1 day ago
      size: document.size,
      uploadedBy: 'John Brown',
      changes: 'Updated personal information and address',
      isCurrent: true,
      status: 'processed'
    },
    {
      id: 'v2',
      version: '2.1',
      uploadDate: new Date(Date.now() - 172800000), // 2 days ago
      size: document.size - 1024,
      uploadedBy: 'John Brown',
      changes: 'Minor corrections to document formatting',
      isCurrent: false,
      status: 'processed'
    },
    {
      id: 'v1',
      version: '2.0',
      uploadDate: new Date(Date.now() - 604800000), // 1 week ago
      size: document.size - 2048,
      uploadedBy: 'John Brown',
      changes: 'Initial document upload',
      isCurrent: false,
      status: 'processed'
    }
  ];

  const formatDate = (date) => {
    return date.toLocaleDateString('en-JM', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
  };

  const handleRestore = (version) => {
    onRestore(document.id, version);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-modal p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-heading font-semibold text-foreground">Version History</h2>
            <p className="text-sm text-muted-foreground mt-1">{document.name}</p>
          </div>
          <Button
            variant="ghost"
            iconName="X"
            iconSize={18}
            onClick={onClose}
          />
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Version List */}
          <div className="w-1/2 border-r border-border overflow-auto">
            <div className="p-4">
              <h3 className="text-sm font-medium text-foreground mb-4">Document Versions</h3>
              
              <div className="space-y-3">
                {mockVersions.map((version, index) => (
                  <div
                    key={version.id}
                    className={`
                      p-4 border border-border rounded-lg cursor-pointer transition-all duration-200
                      ${selectedVersion?.id === version.id 
                        ? 'border-primary bg-primary/5' :'hover:border-primary/50 hover:bg-muted/50'
                      }
                      ${version.isCurrent ? 'ring-2 ring-success/20' : ''}
                    `}
                    onClick={() => setSelectedVersion(version)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className={`
                          w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium
                          ${version.isCurrent 
                            ? 'bg-success text-success-foreground' 
                            : 'bg-muted text-muted-foreground'
                          }
                        `}>
                          v{version.version}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            Version {version.version}
                            {version.isCurrent && (
                              <span className="ml-2 text-xs bg-success/10 text-success px-2 py-0.5 rounded-full">
                                Current
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {getTimeAgo(version.uploadDate)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(version.size)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          by {version.uploadedBy}
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-xs text-muted-foreground">
                      {version.changes}
                    </p>
                    
                    {index < mockVersions.length - 1 && (
                      <div className="absolute left-8 top-full w-0.5 h-3 bg-border"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Version Details */}
          <div className="w-1/2 overflow-auto">
            {selectedVersion ? (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-heading font-semibold text-foreground">
                    Version {selectedVersion.version} Details
                  </h3>
                  {!selectedVersion.isCurrent && (
                    <Button
                      variant="outline"
                      iconName="RotateCcw"
                      iconPosition="left"
                      iconSize={16}
                      onClick={() => handleRestore(selectedVersion)}
                    >
                      Restore Version
                    </Button>
                  )}
                </div>

                {/* Version Info */}
                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Upload Date</label>
                      <p className="text-sm text-foreground">{formatDate(selectedVersion.uploadDate)}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">File Size</label>
                      <p className="text-sm text-foreground">{formatFileSize(selectedVersion.size)}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Uploaded By</label>
                      <p className="text-sm text-foreground">{selectedVersion.uploadedBy}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Status</label>
                      <p className="text-sm text-foreground capitalize">{selectedVersion.status}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Changes Made</label>
                    <p className="text-sm text-foreground mt-1">{selectedVersion.changes}</p>
                  </div>
                </div>

                {/* Version Preview */}
                <div className="border border-border rounded-lg p-4 bg-muted/30">
                  <h4 className="text-sm font-medium text-foreground mb-3">Document Preview</h4>
                  <div className="aspect-[4/3] bg-white rounded border flex items-center justify-center">
                    <div className="text-center">
                      <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Preview for version {selectedVersion.version}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Version Actions */}
                <div className="flex space-x-3 mt-6">
                  <Button
                    variant="outline"
                    iconName="Download"
                    iconPosition="left"
                    iconSize={16}
                    onClick={() => {}}
                  >
                    Download
                  </Button>
                  <Button
                    variant="ghost"
                    iconName="Eye"
                    iconPosition="left"
                    iconSize={16}
                    onClick={() => {}}
                  >
                    View Full
                  </Button>
                  <Button
                    variant="ghost"
                    iconName="GitCompare"
                    iconPosition="left"
                    iconSize={16}
                    onClick={() => {}}
                  >
                    Compare
                  </Button>
                </div>

                {/* Restore Warning */}
                {!selectedVersion.isCurrent && (
                  <div className="mt-6 p-4 bg-warning/10 border border-warning/20 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-warning mb-1">Restore Version</p>
                        <p className="text-muted-foreground">
                          Restoring this version will create a new version based on the selected one. 
                          The current version will be preserved in history.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 flex items-center justify-center h-full">
                <div className="text-center">
                  <Icon name="MousePointer" size={48} className="text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Select a version to view details
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-muted/30">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Document versions are automatically saved and retained for compliance purposes
            </p>
            <Button
              variant="outline"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentVersionHistory;