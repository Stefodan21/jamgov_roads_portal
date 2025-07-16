import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const DocumentPreviewModal = ({ document, isOpen, onClose, onDownload, onShare, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showOCRResults, setShowOCRResults] = useState(false);

  if (!isOpen || !document) return null;

  const mockOCRResults = {
    tesseract: {
      confidence: 87,
      text: `JAMAICA DRIVER'S LICENCE\nLICENCE NO: DL123456789\nNAME: JOHN MICHAEL BROWN\nADDRESS: 123 MAIN STREET\nKINGSTON 10, JAMAICA\nDATE OF BIRTH: 15/03/1985\nEXPIRY DATE: 15/03/2025\nCLASS: 1, 2`
    },
    abbyy: {
      confidence: 94,
      text: `JAMAICA DRIVER'S LICENCE\nLICENCE NO: DL123456789\nNAME: JOHN MICHAEL BROWN\nADDRESS: 123 MAIN STREET\nKINGSTON 10, JAMAICA\nDATE OF BIRTH: 15/03/1985\nEXPIRY DATE: 15/03/2025\nCLASS: 1, 2`
    },
    googleVision: {
      confidence: 92,
      text: `JAMAICA DRIVER'S LICENCE\nLICENCE NO: DL123456789\nNAME: JOHN MICHAEL BROWN\nADDRESS: 123 MAIN STREET\nKINGSTON 10, JAMAICA\nDATE OF BIRTH: 15/03/1985\nEXPIRY DATE: 15/03/2025\nCLASS: 1, 2`
    }
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 25, 50));
  };

  const handleResetZoom = () => {
    setZoomLevel(100);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-JM', {
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

  const getFileIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'pdf': return 'FileText';
      case 'jpg': case'jpeg': case'png': case'gif': return 'Image';
      case 'doc': case'docx': return 'FileText';
      default: return 'File';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-modal p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-6xl h-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <Icon name={getFileIcon(document.type)} size={20} className="text-muted-foreground" />
            <div>
              <h2 className="text-lg font-heading font-semibold text-foreground">{document.name}</h2>
              <p className="text-sm text-muted-foreground">
                {formatFileSize(document.size)} • Uploaded {formatDate(document.uploadDate)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              iconName="Download"
              iconSize={18}
              onClick={() => onDownload(document)}
              title="Download"
            />
            <Button
              variant="ghost"
              iconName="Share2"
              iconSize={18}
              onClick={() => onShare(document)}
              title="Share"
            />
            <Button
              variant="ghost"
              iconName="Trash2"
              iconSize={18}
              onClick={() => onDelete(document)}
              className="text-error hover:text-error"
              title="Delete"
            />
            <Button
              variant="ghost"
              iconName="X"
              iconSize={18}
              onClick={onClose}
              title="Close"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Main Preview Area */}
          <div className="flex-1 flex flex-col">
            {/* Toolbar */}
            <div className="flex items-center justify-between p-3 border-b border-border bg-muted/30">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="ZoomOut"
                  iconSize={16}
                  onClick={handleZoomOut}
                  disabled={zoomLevel <= 50}
                />
                <span className="text-sm text-muted-foreground min-w-16 text-center">
                  {zoomLevel}%
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="ZoomIn"
                  iconSize={16}
                  onClick={handleZoomIn}
                  disabled={zoomLevel >= 200}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResetZoom}
                  className="text-xs"
                >
                  Reset
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant={showOCRResults ? "default" : "ghost"}
                  size="sm"
                  iconName="Type"
                  iconPosition="left"
                  iconSize={16}
                  onClick={() => setShowOCRResults(!showOCRResults)}
                >
                  OCR Results
                </Button>
              </div>
            </div>

            {/* Preview Content */}
            <div className="flex-1 overflow-auto bg-muted/20 p-4">
              <div className="flex justify-center">
                <div 
                  className="bg-white shadow-elevation-2 rounded-lg overflow-hidden"
                  style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
                >
                  {document.thumbnail || document.type === 'jpg' || document.type === 'png' ? (
                    <Image
                      src={document.thumbnail || `https://picsum.photos/800/1000?random=${document.id}`}
                      alt={document.name}
                      className="max-w-none"
                      style={{ width: '800px', height: 'auto' }}
                    />
                  ) : (
                    <div className="w-[800px] h-[1000px] bg-white flex flex-col items-center justify-center p-8">
                      <Icon name={getFileIcon(document.type)} size={64} className="text-muted-foreground mb-4" />
                      <h3 className="text-xl font-semibold text-foreground mb-2">{document.name}</h3>
                      <p className="text-muted-foreground text-center mb-4">
                        This file type cannot be previewed directly.
                      </p>
                      <Button
                        variant="default"
                        iconName="Download"
                        iconPosition="left"
                        iconSize={16}
                        onClick={() => onDownload(document)}
                      >
                        Download to View
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* OCR Results Sidebar */}
          {showOCRResults && (
            <div className="w-80 border-l border-border bg-muted/30 flex flex-col">
              <div className="p-4 border-b border-border">
                <h3 className="text-lg font-heading font-semibold text-foreground">OCR Results</h3>
                <p className="text-sm text-muted-foreground">Extracted text from document</p>
              </div>
              
              <div className="flex-1 overflow-auto p-4 space-y-4">
                {/* Tesseract Results */}
                <div className="bg-card border border-border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-foreground">Tesseract OCR</h4>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-warning rounded-full"></div>
                      <span className="text-xs text-muted-foreground">{mockOCRResults.tesseract.confidence}%</span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground bg-muted p-2 rounded font-mono whitespace-pre-wrap max-h-32 overflow-auto">
                    {mockOCRResults.tesseract.text}
                  </div>
                </div>

                {/* ABBYY Results */}
                <div className="bg-card border border-border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-foreground">ABBYY FineReader</h4>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span className="text-xs text-muted-foreground">{mockOCRResults.abbyy.confidence}%</span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground bg-muted p-2 rounded font-mono whitespace-pre-wrap max-h-32 overflow-auto">
                    {mockOCRResults.abbyy.text}
                  </div>
                </div>

                {/* Google Vision Results */}
                <div className="bg-card border border-border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-foreground">Google Cloud Vision</h4>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      <span className="text-xs text-muted-foreground">{mockOCRResults.googleVision.confidence}%</span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground bg-muted p-2 rounded font-mono whitespace-pre-wrap max-h-32 overflow-auto">
                    {mockOCRResults.googleVision.text}
                  </div>
                </div>

                {/* Best Result */}
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="Award" size={16} className="text-primary" />
                    <h4 className="text-sm font-medium text-primary">Best Result</h4>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    ABBYY FineReader (94% confidence)
                  </p>
                  <div className="text-xs text-foreground bg-card p-2 rounded font-mono whitespace-pre-wrap max-h-32 overflow-auto">
                    {mockOCRResults.abbyy.text}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>Category: {document.category}</span>
              <span>Status: {document.status}</span>
              {document.version && <span>Version: {document.version}</span>}
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                iconName="Share2"
                iconPosition="left"
                iconSize={16}
                onClick={() => onShare(document)}
              >
                Share
              </Button>
              <Button
                variant="default"
                size="sm"
                iconName="Download"
                iconPosition="left"
                iconSize={16}
                onClick={() => onDownload(document)}
              >
                Download
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentPreviewModal;