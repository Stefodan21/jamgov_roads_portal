import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BulkActionsBar = ({ 
  selectedDocuments, 
  onDownloadSelected, 
  onDeleteSelected, 
  onShareSelected,
  onClearSelection,
  totalDocuments 
}) => {
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  if (selectedDocuments.length === 0) return null;

  const handleDownloadAll = () => {
    onDownloadSelected(selectedDocuments);
    setIsActionMenuOpen(false);
  };

  const handleShareAll = () => {
    onShareSelected(selectedDocuments);
    setIsActionMenuOpen(false);
  };

  const handleDeleteConfirm = () => {
    onDeleteSelected(selectedDocuments);
    setIsConfirmDeleteOpen(false);
    setIsActionMenuOpen(false);
  };

  const formatFileSize = (documents) => {
    const totalSize = documents.reduce((sum, doc) => sum + doc.size, 0);
    if (totalSize === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(totalSize) / Math.log(k));
    return parseFloat((totalSize / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <>
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-overlay">
        <div className="bg-card border border-border rounded-lg shadow-elevation-3 p-4 min-w-96">
          <div className="flex items-center justify-between">
            {/* Selection Info */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Icon name="Check" size={16} className="text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {selectedDocuments.length} of {totalDocuments} selected
                </p>
                <p className="text-xs text-muted-foreground">
                  Total size: {formatFileSize(selectedDocuments)}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              {/* Quick Actions */}
              <Button
                variant="ghost"
                size="sm"
                iconName="Download"
                iconSize={16}
                onClick={handleDownloadAll}
                title="Download selected"
              />
              
              <Button
                variant="ghost"
                size="sm"
                iconName="Share2"
                iconSize={16}
                onClick={handleShareAll}
                title="Share selected"
              />

              {/* More Actions Menu */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="MoreVertical"
                  iconSize={16}
                  onClick={() => setIsActionMenuOpen(!isActionMenuOpen)}
                  title="More actions"
                />
                
                {isActionMenuOpen && (
                  <div className="absolute bottom-full right-0 mb-2 w-48 bg-popover border border-border rounded-md shadow-elevation-2">
                    <div className="py-1">
                      <button
                        onClick={handleDownloadAll}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center space-x-2"
                      >
                        <Icon name="Download" size={14} />
                        <span>Download All</span>
                      </button>
                      
                      <button
                        onClick={handleShareAll}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center space-x-2"
                      >
                        <Icon name="Share2" size={14} />
                        <span>Share All</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          // Move to folder functionality
                          setIsActionMenuOpen(false);
                        }}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center space-x-2"
                      >
                        <Icon name="FolderPlus" size={14} />
                        <span>Move to Folder</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          // Add tags functionality
                          setIsActionMenuOpen(false);
                        }}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center space-x-2"
                      >
                        <Icon name="Tag" size={14} />
                        <span>Add Tags</span>
                      </button>
                      
                      <div className="border-t border-border my-1"></div>
                      
                      <button
                        onClick={() => {
                          setIsConfirmDeleteOpen(true);
                          setIsActionMenuOpen(false);
                        }}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center space-x-2 text-error"
                      >
                        <Icon name="Trash2" size={14} />
                        <span>Delete All</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Clear Selection */}
              <Button
                variant="ghost"
                size="sm"
                iconName="X"
                iconSize={16}
                onClick={onClearSelection}
                title="Clear selection"
              />
            </div>
          </div>

          {/* Progress Bar (if any bulk operation is in progress) */}
          <div className="mt-3 w-full bg-muted rounded-full h-1">
            <div className="bg-primary h-1 rounded-full w-0 transition-all duration-300"></div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isConfirmDeleteOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-modal p-4">
          <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-error/10 rounded-full flex items-center justify-center">
                <Icon name="AlertTriangle" size={20} className="text-error" />
              </div>
              <div>
                <h3 className="text-lg font-heading font-semibold text-foreground">
                  Delete Documents
                </h3>
                <p className="text-sm text-muted-foreground">
                  This action cannot be undone
                </p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm text-foreground mb-3">
                Are you sure you want to delete {selectedDocuments.length} selected document{selectedDocuments.length > 1 ? 's' : ''}?
              </p>
              
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                  <span>Documents to delete:</span>
                  <span>{selectedDocuments.length}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Total size:</span>
                  <span>{formatFileSize(selectedDocuments)}</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setIsConfirmDeleteOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteConfirm}
                iconName="Trash2"
                iconPosition="left"
                iconSize={16}
                className="flex-1"
              >
                Delete All
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BulkActionsBar;