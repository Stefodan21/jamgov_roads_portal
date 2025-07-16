import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const DocumentCard = ({ 
  document, 
  onView, 
  onDownload, 
  onDelete, 
  onShare,
  isSelected,
  onSelect,
  viewMode = 'grid'
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'processed': return 'text-success bg-success/10';
      case 'processing': return 'text-accent bg-accent/10';
      case 'failed': return 'text-error bg-error/10';
      case 'pending': return 'text-warning bg-warning/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getFileIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'pdf': return 'FileText';
      case 'jpg': case'jpeg': case'png': case'gif': return 'Image';
      case 'doc': case'docx': return 'FileText';
      case 'xls': case'xlsx': return 'FileSpreadsheet';
      default: return 'File';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-JM', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (viewMode === 'list') {
    return (
      <div className={`
        flex items-center p-4 bg-card border border-border rounded-lg hover:shadow-elevation-1 transition-all duration-200
        ${isSelected ? 'ring-2 ring-primary' : ''}
      `}>
        <div className="flex items-center space-x-4 flex-1">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => onSelect(document.id, e.target.checked)}
              className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
            />
            <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
              <Icon name={getFileIcon(document.type)} size={20} className="text-muted-foreground" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-foreground truncate">{document.name}</h3>
            <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
              <span>{formatFileSize(document.size)}</span>
              <span>{formatDate(document.uploadDate)}</span>
              <span className="capitalize">{document.category}</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(document.status)}`}>
              {document.status}
            </div>
            
            {document.ocrConfidence && (
              <div className="text-xs text-muted-foreground">
                OCR: {document.ocrConfidence}%
              </div>
            )}

            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                iconName="MoreVertical"
                iconSize={16}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              />
              
              {isMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-popover border border-border rounded-md shadow-elevation-2 z-dropdown">
                  <div className="py-1">
                    <button
                      onClick={() => { onView(document); setIsMenuOpen(false); }}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center space-x-2"
                    >
                      <Icon name="Eye" size={14} />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => { onDownload(document); setIsMenuOpen(false); }}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center space-x-2"
                    >
                      <Icon name="Download" size={14} />
                      <span>Download</span>
                    </button>
                    <button
                      onClick={() => { onShare(document); setIsMenuOpen(false); }}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center space-x-2"
                    >
                      <Icon name="Share2" size={14} />
                      <span>Share</span>
                    </button>
                    <button
                      onClick={() => { onDelete(document); setIsMenuOpen(false); }}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center space-x-2 text-error"
                    >
                      <Icon name="Trash2" size={14} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`
      bg-card border border-border rounded-lg overflow-hidden hover:shadow-elevation-1 transition-all duration-200
      ${isSelected ? 'ring-2 ring-primary' : ''}
    `}>
      {/* Document Preview */}
      <div className="relative aspect-[4/3] bg-muted">
        {document.thumbnail ? (
          <Image
            src={document.thumbnail}
            alt={document.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Icon name={getFileIcon(document.type)} size={48} className="text-muted-foreground" />
          </div>
        )}
        
        {/* Selection Checkbox */}
        <div className="absolute top-2 left-2">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect(document.id, e.target.checked)}
            className="w-4 h-4 text-primary border-border rounded focus:ring-primary bg-card"
          />
        </div>

        {/* Status Badge */}
        <div className="absolute top-2 right-2">
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(document.status)}`}>
            {document.status}
          </div>
        </div>

        {/* Processing Indicator */}
        {document.status === 'processing' && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-white text-center">
              <Icon name="RefreshCw" size={24} className="animate-spin mx-auto mb-2" />
              <p className="text-sm">Processing...</p>
            </div>
          </div>
        )}
      </div>

      {/* Document Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-sm font-medium text-foreground truncate flex-1 mr-2">
            {document.name}
          </h3>
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              iconName="MoreVertical"
              iconSize={16}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex-shrink-0"
            />
            
            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-popover border border-border rounded-md shadow-elevation-2 z-dropdown">
                <div className="py-1">
                  <button
                    onClick={() => { onView(document); setIsMenuOpen(false); }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center space-x-2"
                  >
                    <Icon name="Eye" size={14} />
                    <span>View</span>
                  </button>
                  <button
                    onClick={() => { onDownload(document); setIsMenuOpen(false); }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center space-x-2"
                  >
                    <Icon name="Download" size={14} />
                    <span>Download</span>
                  </button>
                  <button
                    onClick={() => { onShare(document); setIsMenuOpen(false); }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center space-x-2"
                  >
                    <Icon name="Share2" size={14} />
                    <span>Share</span>
                  </button>
                  <button
                    onClick={() => { onDelete(document); setIsMenuOpen(false); }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center space-x-2 text-error"
                  >
                    <Icon name="Trash2" size={14} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>Size:</span>
            <span>{formatFileSize(document.size)}</span>
          </div>
          <div className="flex justify-between">
            <span>Uploaded:</span>
            <span>{formatDate(document.uploadDate)}</span>
          </div>
          <div className="flex justify-between">
            <span>Category:</span>
            <span className="capitalize">{document.category}</span>
          </div>
          {document.ocrConfidence && (
            <div className="flex justify-between">
              <span>OCR Confidence:</span>
              <span>{document.ocrConfidence}%</span>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex space-x-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            iconName="Eye"
            iconPosition="left"
            iconSize={14}
            onClick={() => onView(document)}
            className="flex-1"
          >
            View
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconName="Download"
            iconSize={14}
            onClick={() => onDownload(document)}
          />
          <Button
            variant="ghost"
            size="sm"
            iconName="Share2"
            iconSize={14}
            onClick={() => onShare(document)}
          />
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;