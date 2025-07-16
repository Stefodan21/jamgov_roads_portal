import React, { useState, useRef, useCallback } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import DocumentStatusIndicator from '../../../components/ui/DocumentStatusIndicator';

const DocumentUploadZone = ({ 
  uploadedDocuments = [], 
  onDocumentsChange, 
  requiredDocuments = [], 
  applicationType,
  className = '' 
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [ocrResults, setOcrResults] = useState({});
  const fileInputRef = useRef(null);

  const acceptedFileTypes = {
    'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'],
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'text/plain': ['.txt']
  };

  const maxFileSize = 10 * 1024 * 1024; // 10MB
  const maxTotalSize = 50 * 1024 * 1024; // 50MB

  // Mock OCR processing simulation
  const processOCR = useCallback(async (file) => {
    const ocrProviders = ['Tesseract', 'ABBYY FineReader', 'Google Cloud Vision'];
    const randomProvider = ocrProviders[Math.floor(Math.random() * ocrProviders.length)];
    
    // Simulate OCR processing time
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
    
    const mockOcrResult = {
      provider: randomProvider,
      confidence: 85 + Math.random() * 15,
      extractedText: `Sample extracted text from ${file.name}\n\nDocument Type: ${file.type}\nProcessed by: ${randomProvider}\nConfidence: ${Math.round(85 + Math.random() * 15)}%\n\nThis is mock OCR data for demonstration purposes.`,
      detectedFields: [
        { field: 'Document Number', value: 'DOC-' + Math.random().toString(36).substr(2, 9).toUpperCase(), confidence: 92 },
        { field: 'Issue Date', value: new Date().toLocaleDateString(), confidence: 88 },
        { field: 'Name', value: 'Marcus Campbell', confidence: 95 }
      ]
    };

    setOcrResults(prev => ({
      ...prev,
      [file.name]: mockOcrResult
    }));

    return mockOcrResult;
  }, []);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const validateFile = (file) => {
    const errors = [];
    
    // Check file size
    if (file.size > maxFileSize) {
      errors.push(`File size exceeds ${maxFileSize / (1024 * 1024)}MB limit`);
    }
    
    // Check file type
    const isValidType = Object.keys(acceptedFileTypes).some(type => {
      if (type.includes('*')) {
        return file.type.startsWith(type.split('*')[0]);
      }
      return file.type === type;
    });
    
    if (!isValidType) {
      errors.push('File type not supported');
    }
    
    return errors;
  };

  const handleFiles = async (files) => {
    const validFiles = [];
    const errors = [];
    
    // Calculate total size including existing files
    const existingSize = uploadedDocuments.reduce((sum, doc) => sum + (doc.size || 0), 0);
    const newFilesSize = files.reduce((sum, file) => sum + file.size, 0);
    
    if (existingSize + newFilesSize > maxTotalSize) {
      errors.push(`Total file size would exceed ${maxTotalSize / (1024 * 1024)}MB limit`);
      return;
    }
    
    for (const file of files) {
      const fileErrors = validateFile(file);
      if (fileErrors.length === 0) {
        validFiles.push(file);
      } else {
        errors.push(`${file.name}: ${fileErrors.join(', ')}`);
      }
    }
    
    if (errors.length > 0) {
      console.error('File validation errors:', errors);
      return;
    }
    
    // Process valid files
    for (const file of validFiles) {
      const fileId = Date.now() + Math.random();
      const newDocument = {
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        file: file,
        uploadProgress: 0,
        status: 'uploading',
        uploadedAt: new Date(),
        thumbnail: null,
        ocrStatus: 'pending'
      };
      
      // Add to uploaded documents immediately
      onDocumentsChange([...uploadedDocuments, newDocument]);
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const currentProgress = prev[fileId] || 0;
          const newProgress = Math.min(currentProgress + Math.random() * 20, 100);
          
          if (newProgress >= 100) {
            clearInterval(progressInterval);
            
            // Update document status to uploaded
            onDocumentsChange(docs => docs.map(doc => 
              doc.id === fileId 
                ? { ...doc, status: 'uploaded', uploadProgress: 100, ocrStatus: 'processing' }
                : doc
            ));
            
            // Start OCR processing for images and PDFs
            if (file.type.startsWith('image/') || file.type === 'application/pdf') {
              processOCR(file).then(() => {
                onDocumentsChange(docs => docs.map(doc => 
                  doc.id === fileId 
                    ? { ...doc, ocrStatus: 'completed' }
                    : doc
                ));
              });
            }
            
            return { ...prev, [fileId]: 100 };
          }
          
          return { ...prev, [fileId]: newProgress };
        });
      }, 200);
      
      // Generate thumbnail for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          onDocumentsChange(docs => docs.map(doc => 
            doc.id === fileId 
              ? { ...doc, thumbnail: e.target.result }
              : doc
          ));
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const removeDocument = (documentId) => {
    onDocumentsChange(uploadedDocuments.filter(doc => doc.id !== documentId));
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[documentId];
      return newProgress;
    });
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getDocumentIcon = (type) => {
    if (type.startsWith('image/')) return 'Image';
    if (type === 'application/pdf') return 'FileText';
    if (type.includes('word')) return 'FileText';
    return 'File';
  };

  const getRequiredDocumentStatus = (docName) => {
    const uploaded = uploadedDocuments.find(doc => 
      doc.name.toLowerCase().includes(docName.toLowerCase()) ||
      doc.category === docName
    );
    return uploaded ? 'completed' : 'pending';
  };

  const totalSize = uploadedDocuments.reduce((sum, doc) => sum + (doc.size || 0), 0);

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
          Document Upload
        </h2>
        <p className="text-muted-foreground">
          Upload required documents for your {applicationType?.name || 'application'}
        </p>
      </div>

      {/* Required Documents Checklist */}
      {requiredDocuments.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-heading font-semibold text-foreground border-b border-border pb-2">
            Required Documents
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {requiredDocuments.map((doc, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                <Icon 
                  name={getRequiredDocumentStatus(doc) === 'completed' ? 'CheckCircle' : 'Circle'} 
                  size={20} 
                  className={getRequiredDocumentStatus(doc) === 'completed' ? 'text-success' : 'text-muted-foreground'}
                />
                <span className={`text-sm ${getRequiredDocumentStatus(doc) === 'completed' ? 'text-success' : 'text-foreground'}`}>
                  {doc}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Zone */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
          ${dragActive 
            ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50 hover:bg-muted/30'
          }
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={Object.keys(acceptedFileTypes).join(',')}
          onChange={handleFileInput}
          className="hidden"
        />
        
        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
            <Icon name="Upload" size={32} className="text-primary" />
          </div>
          
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
              {dragActive ? 'Drop files here' : 'Upload Documents'}
            </h3>
            <p className="text-muted-foreground mb-4">
              Drag and drop files here, or click to browse
            </p>
            
            <Button
              variant="outline"
              onClick={openFileDialog}
              iconName="FolderOpen"
              iconPosition="left"
              iconSize={16}
            >
              Browse Files
            </Button>
          </div>
          
          <div className="text-xs text-muted-foreground space-y-1">
            <p>Supported formats: JPG, PNG, PDF, DOC, DOCX, TXT</p>
            <p>Maximum file size: {maxFileSize / (1024 * 1024)}MB per file</p>
            <p>Maximum total size: {maxTotalSize / (1024 * 1024)}MB</p>
          </div>
        </div>
      </div>

      {/* Uploaded Documents */}
      {uploadedDocuments.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-heading font-semibold text-foreground">
              Uploaded Documents ({uploadedDocuments.length})
            </h3>
            <div className="text-sm text-muted-foreground">
              Total size: {formatFileSize(totalSize)} / {formatFileSize(maxTotalSize)}
            </div>
          </div>
          
          <div className="space-y-3">
            {uploadedDocuments.map((doc) => (
              <div key={doc.id} className="p-4 bg-card border border-border rounded-lg">
                <div className="flex items-start space-x-4">
                  {/* Thumbnail or Icon */}
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                    {doc.thumbnail ? (
                      <img 
                        src={doc.thumbnail} 
                        alt={doc.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Icon name={getDocumentIcon(doc.type)} size={20} className="text-muted-foreground" />
                    )}
                  </div>
                  
                  {/* Document Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-foreground truncate">
                        {doc.name}
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="X"
                        iconSize={16}
                        onClick={() => removeDocument(doc.id)}
                        className="text-error hover:text-error"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                      <span>{formatFileSize(doc.size)}</span>
                      <span>{doc.type}</span>
                      <span>{doc.uploadedAt.toLocaleTimeString()}</span>
                    </div>
                    
                    {/* Upload Progress */}
                    {doc.status === 'uploading' && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>Uploading...</span>
                          <span>{Math.round(uploadProgress[doc.id] || 0)}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-accent h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress[doc.id] || 0}%` }}
                          />
                        </div>
                      </div>
                    )}
                    
                    {/* Document Status */}
                    {doc.status === 'uploaded' && (
                      <div className="flex items-center justify-between">
                        <DocumentStatusIndicator
                          documentId={doc.id}
                          status="approved"
                          size="sm"
                        />
                        
                        {/* OCR Status */}
                        {(doc.type.startsWith('image/') || doc.type === 'application/pdf') && (
                          <div className="flex items-center space-x-2">
                            <Icon 
                              name={doc.ocrStatus === 'completed' ? 'Eye' : 'RefreshCw'} 
                              size={14} 
                              className={`${doc.ocrStatus === 'processing' ? 'animate-spin' : ''} text-muted-foreground`}
                            />
                            <span className="text-xs text-muted-foreground">
                              {doc.ocrStatus === 'completed' ? 'OCR Complete' : 
                               doc.ocrStatus === 'processing' ? 'Processing OCR...' : 'OCR Pending'}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* OCR Results */}
                    {ocrResults[doc.name] && (
                      <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-foreground">
                            OCR Results ({ocrResults[doc.name].provider})
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {Math.round(ocrResults[doc.name].confidence)}% confidence
                          </span>
                        </div>
                        <div className="space-y-1">
                          {ocrResults[doc.name].detectedFields.map((field, index) => (
                            <div key={index} className="flex justify-between text-xs">
                              <span className="text-muted-foreground">{field.field}:</span>
                              <span className="text-foreground font-medium">{field.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Camera Capture */}
      <div className="md:hidden">
        <Button
          variant="outline"
          fullWidth
          iconName="Camera"
          iconPosition="left"
          iconSize={16}
          onClick={() => {
            // Mobile camera capture would be implemented here
            console.log('Opening camera for document capture');
          }}
        >
          Capture Document with Camera
        </Button>
      </div>
    </div>
  );
};

export default DocumentUploadZone;