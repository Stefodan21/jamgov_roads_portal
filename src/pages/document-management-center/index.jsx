import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import DocumentCard from './components/DocumentCard';
import DocumentUploadZone from './components/DocumentUploadZone';
import DocumentPreviewModal from './components/DocumentPreviewModal';
import DocumentFilters from './components/DocumentFilters';
import BulkActionsBar from './components/BulkActionsBar';
import DocumentVersionHistory from './components/DocumentVersionHistory';
import DocumentStatusIndicator from '../../components/ui/DocumentStatusIndicator';
import OfflineStatusManager from '../../components/ui/OfflineStatusManager';

const DocumentManagementCenter = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('my-documents');
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('date-desc');
  const [previewDocument, setPreviewDocument] = useState(null);
  const [versionHistoryDocument, setVersionHistoryDocument] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');

  // Mock documents data
  const mockDocuments = [
    {
      id: 'doc-001',
      name: 'National ID Card - Front.jpg',
      type: 'jpg',
      size: 2048576,
      uploadDate: new Date(Date.now() - 86400000).toISOString(),
      status: 'processed',
      category: 'identification',
      thumbnail: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=300&fit=crop',
      ocrConfidence: 94,
      version: '1.0'
    },
    {
      id: 'doc-002',
      name: 'Road Permit Application.pdf',
      type: 'pdf',
      size: 1536000,
      uploadDate: new Date(Date.now() - 172800000).toISOString(),
      status: 'processing',
      category: 'permits',
      thumbnail: null,
      ocrConfidence: null,
      version: '2.1'
    },
    {
      id: 'doc-003',
      name: 'Construction Blueprint.pdf',
      type: 'pdf',
      size: 5242880,
      uploadDate: new Date(Date.now() - 259200000).toISOString(),
      status: 'processed',
      category: 'plans',
      thumbnail: null,
      ocrConfidence: 89,
      version: '1.0'
    },
    {
      id: 'doc-004',
      name: 'Site Photo - Before.jpg',
      type: 'jpg',
      size: 3145728,
      uploadDate: new Date(Date.now() - 345600000).toISOString(),
      status: 'processed',
      category: 'photos',
      thumbnail: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop',
      ocrConfidence: null,
      version: '1.0'
    },
    {
      id: 'doc-005',
      name: 'Tax Compliance Certificate.pdf',
      type: 'pdf',
      size: 1024000,
      uploadDate: new Date(Date.now() - 432000000).toISOString(),
      status: 'failed',
      category: 'permits',
      thumbnail: null,
      ocrConfidence: null,
      version: '1.0'
    },
    {
      id: 'doc-006',
      name: 'Property Survey.pdf',
      type: 'pdf',
      size: 4194304,
      uploadDate: new Date(Date.now() - 518400000).toISOString(),
      status: 'processed',
      category: 'plans',
      thumbnail: null,
      ocrConfidence: 92,
      version: '1.0'
    }
  ];

  const requiredDocuments = [
    {
      id: 'req-001',
      name: 'Valid Government ID',
      description: 'National ID, Passport, or Driver\'s License',
      status: 'uploaded',
      category: 'identification',
      required: true
    },
    {
      id: 'req-002',
      name: 'Proof of Address',
      description: 'Utility bill or bank statement (within 3 months)',
      status: 'missing',
      category: 'identification',
      required: true
    },
    {
      id: 'req-003',
      name: 'Tax Registration Number (TRN)',
      description: 'Valid TRN certificate',
      status: 'pending',
      category: 'permits',
      required: true
    },
    {
      id: 'req-004',
      name: 'Site Plan',
      description: 'Detailed construction or development plan',
      status: 'uploaded',
      category: 'plans',
      required: false
    }
  ];

  // Initialize documents and language
  useEffect(() => {
    setDocuments(mockDocuments);
    setFilteredDocuments(mockDocuments);
    
    // Check for saved language preference
    const savedLanguage = localStorage.getItem('jamgov-language') || 'en';
    setCurrentLanguage(savedLanguage);
  }, []);

  // Filter and sort documents
  useEffect(() => {
    let filtered = [...documents];

    // Apply filters
    if (filters.search) {
      filtered = filtered.filter(doc => 
        doc.name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(doc => doc.category === filters.category);
    }

    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(doc => doc.status === filters.status);
    }

    if (filters.fileType && filters.fileType !== 'all') {
      filtered = filtered.filter(doc => {
        switch (filters.fileType) {
          case 'pdf': return doc.type === 'pdf';
          case 'image': return ['jpg', 'jpeg', 'png', 'gif'].includes(doc.type);
          case 'document': return ['doc', 'docx'].includes(doc.type);
          default: return true;
        }
      });
    }

    if (filters.sizeRange && filters.sizeRange !== 'all') {
      filtered = filtered.filter(doc => {
        switch (filters.sizeRange) {
          case 'small': return doc.size < 1048576; // < 1MB
          case 'medium': return doc.size >= 1048576 && doc.size <= 10485760; // 1-10MB
          case 'large': return doc.size > 10485760; // > 10MB
          default: return true;
        }
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.uploadDate) - new Date(a.uploadDate);
        case 'date-asc':
          return new Date(a.uploadDate) - new Date(b.uploadDate);
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'size-desc':
          return b.size - a.size;
        case 'size-asc':
          return a.size - b.size;
        default:
          return 0;
      }
    });

    setFilteredDocuments(filtered);
  }, [documents, filters, sortBy]);

  const handleUpload = (newDocument) => {
    setDocuments(prev => [newDocument, ...prev]);
  };

  const handleDocumentSelect = (documentId, isSelected) => {
    setSelectedDocuments(prev => {
      if (isSelected) {
        return [...prev, documents.find(doc => doc.id === documentId)];
      } else {
        return prev.filter(doc => doc.id !== documentId);
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedDocuments.length === filteredDocuments.length) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments([...filteredDocuments]);
    }
  };

  const handleClearSelection = () => {
    setSelectedDocuments([]);
  };

  const handleView = (document) => {
    setPreviewDocument(document);
  };

  const handleDownload = (document) => {
    console.log('Downloading document:', document.name);
    // Simulate download
    const link = document.createElement('a');
    link.href = '#';
    link.download = document.name;
    link.click();
  };

  const handleShare = (document) => {
    console.log('Sharing document:', document.name);
    // Generate secure sharing link
    const shareLink = `https://jamgov.jm/share/${document.id}?expires=${Date.now() + 86400000}`;
    navigator.clipboard.writeText(shareLink);
    alert('Secure sharing link copied to clipboard!');
  };

  const handleDelete = (document) => {
    if (confirm(`Are you sure you want to delete "${document.name}"?`)) {
      setDocuments(prev => prev.filter(doc => doc.id !== document.id));
      setSelectedDocuments(prev => prev.filter(doc => doc.id !== document.id));
    }
  };

  const handleBulkDownload = (documents) => {
    console.log('Bulk downloading documents:', documents.length);
    documents.forEach(doc => handleDownload(doc));
  };

  const handleBulkShare = (documents) => {
    console.log('Bulk sharing documents:', documents.length);
    const shareLinks = documents.map(doc => 
      `https://jamgov.jm/share/${doc.id}?expires=${Date.now() + 86400000}`
    );
    navigator.clipboard.writeText(shareLinks.join('\n'));
    alert(`${documents.length} secure sharing links copied to clipboard!`);
  };

  const handleBulkDelete = (documents) => {
    setDocuments(prev => prev.filter(doc => !documents.some(delDoc => delDoc.id === doc.id)));
    setSelectedDocuments([]);
  };

  const handleVersionRestore = (documentId, version) => {
    console.log('Restoring version:', version.version, 'for document:', documentId);
    // Update document with restored version
    setDocuments(prev => prev.map(doc => 
      doc.id === documentId 
        ? { ...doc, version: `${version.version}+`, status: 'processing' }
        : doc
    ));
  };

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'en' ? 'jm' : 'en';
    setCurrentLanguage(newLanguage);
    localStorage.setItem('jamgov-language', newLanguage);
  };

  const getTabContent = () => {
    switch (activeTab) {
      case 'my-documents':
        return (
          <div className="space-y-6">
            <DocumentFilters
              onFilterChange={setFilters}
              onSortChange={setSortBy}
              onViewModeChange={setViewMode}
              currentFilters={filters}
              viewMode={viewMode}
            />

            {filteredDocuments.length > 0 ? (
              <div className={`
                ${viewMode === 'grid' ?'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' :'space-y-4'
                }
              `}>
                {filteredDocuments.map(document => (
                  <DocumentCard
                    key={document.id}
                    document={document}
                    onView={handleView}
                    onDownload={handleDownload}
                    onDelete={handleDelete}
                    onShare={handleShare}
                    isSelected={selectedDocuments.some(doc => doc.id === document.id)}
                    onSelect={handleDocumentSelect}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Icon name="FileX" size={64} className="text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                  No documents found
                </h3>
                <p className="text-muted-foreground mb-4">
                  {Object.keys(filters).length > 0 
                    ? 'Try adjusting your filters or search terms' :'Upload your first document to get started'
                  }
                </p>
                {Object.keys(filters).length === 0 && (
                  <Button
                    variant="default"
                    iconName="Upload"
                    iconPosition="left"
                    iconSize={16}
                    onClick={() => setActiveTab('upload')}
                  >
                    Upload Document
                  </Button>
                )}
              </div>
            )}
          </div>
        );

      case 'required-uploads':
        return (
          <div className="space-y-6">
            <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Icon name="AlertTriangle" size={20} className="text-warning mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-warning mb-1">
                    Required Documents
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Complete your application by uploading all required documents
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              {requiredDocuments.map(doc => (
                <div key={doc.id} className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-sm font-medium text-foreground">{doc.name}</h3>
                        {doc.required && (
                          <span className="text-xs bg-error/10 text-error px-2 py-0.5 rounded-full">
                            Required
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{doc.description}</p>
                      <DocumentStatusIndicator
                        status={doc.status}
                        size="sm"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {doc.status === 'missing' && (
                        <Button
                          variant="default"
                          size="sm"
                          iconName="Upload"
                          iconPosition="left"
                          iconSize={14}
                          onClick={() => setActiveTab('upload')}
                        >
                          Upload
                        </Button>
                      )}
                      {doc.status === 'uploaded' && (
                        <Button
                          variant="outline"
                          size="sm"
                          iconName="Eye"
                          iconSize={14}
                          onClick={() => {}}
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'processed-files':
        const processedDocs = filteredDocuments.filter(doc => doc.status === 'processed');
        return (
          <div className="space-y-6">
            <div className="bg-success/10 border border-success/20 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Icon name="CheckCircle" size={20} className="text-success mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-success mb-1">
                    Processed Documents
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {processedDocs.length} documents have been successfully processed
                  </p>
                </div>
              </div>
            </div>

            {processedDocs.length > 0 ? (
              <div className={`
                ${viewMode === 'grid' ?'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' :'space-y-4'
                }
              `}>
                {processedDocs.map(document => (
                  <DocumentCard
                    key={document.id}
                    document={document}
                    onView={handleView}
                    onDownload={handleDownload}
                    onDelete={handleDelete}
                    onShare={handleShare}
                    isSelected={selectedDocuments.some(doc => doc.id === document.id)}
                    onSelect={handleDocumentSelect}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Icon name="FileCheck" size={64} className="text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                  No processed documents
                </h3>
                <p className="text-muted-foreground">
                  Documents will appear here once processing is complete
                </p>
              </div>
            )}
          </div>
        );

      case 'upload':
        return (
          <DocumentUploadZone
            onUpload={handleUpload}
            acceptedTypes={[
              'application/pdf',
              'image/jpeg',
              'image/png',
              'image/gif',
              'application/msword',
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ]}
            maxSize={10485760} // 10MB
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
              {currentLanguage === 'en' ? 'Document Management Center' : 'Dokument Manijment Senta'}
            </h1>
            <p className="text-muted-foreground">
              {currentLanguage === 'en' ?'Upload, manage, and track all your application documents' :'Upload, manij, an track all yu aplikieshan dokument dem'
              }
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <OfflineStatusManager showDetails={false} />
            
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="text-xs"
            >
              {currentLanguage === 'en' ? 'Patois' : 'English'}
            </Button>
            
            {selectedDocuments.length > 0 && (
              <Button
                variant="outline"
                iconName="CheckSquare"
                iconPosition="left"
                iconSize={16}
                onClick={handleSelectAll}
              >
                {selectedDocuments.length === filteredDocuments.length ? 'Deselect All' : 'Select All'}
              </Button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-border mb-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'my-documents', label: currentLanguage === 'en' ? 'My Documents' : 'Mi Dokument Dem', icon: 'Folder' },
              { id: 'required-uploads', label: currentLanguage === 'en' ? 'Required Uploads' : 'Rikyuaird Upload Dem', icon: 'AlertCircle' },
              { id: 'processed-files', label: currentLanguage === 'en' ? 'Processed Files' : 'Proses Fail Dem', icon: 'CheckCircle' },
              { id: 'upload', label: currentLanguage === 'en' ? 'Upload New' : 'Upload Nyuu', icon: 'Upload' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-200
                  ${activeTab === tab.id
                    ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                  }
                `}
              >
                <Icon name={tab.icon} size={16} />
                <span>{tab.label}</span>
                {tab.id === 'required-uploads' && (
                  <div className="w-2 h-2 bg-warning rounded-full"></div>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="min-h-96">
          {getTabContent()}
        </div>
      </div>

      {/* Bulk Actions Bar */}
      <BulkActionsBar
        selectedDocuments={selectedDocuments}
        onDownloadSelected={handleBulkDownload}
        onDeleteSelected={handleBulkDelete}
        onShareSelected={handleBulkShare}
        onClearSelection={handleClearSelection}
        totalDocuments={filteredDocuments.length}
      />

      {/* Document Preview Modal */}
      <DocumentPreviewModal
        document={previewDocument}
        isOpen={!!previewDocument}
        onClose={() => setPreviewDocument(null)}
        onDownload={handleDownload}
        onShare={handleShare}
        onDelete={handleDelete}
      />

      {/* Version History Modal */}
      <DocumentVersionHistory
        document={versionHistoryDocument}
        isOpen={!!versionHistoryDocument}
        onClose={() => setVersionHistoryDocument(null)}
        onRestore={handleVersionRestore}
      />
    </div>
  );
};

export default DocumentManagementCenter;