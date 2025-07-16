import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DocumentUploadZone = ({ onUpload, acceptedTypes = [], maxSize = 10485760 }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = async (files) => {
    const validFiles = files.filter(file => {
      if (acceptedTypes.length > 0 && !acceptedTypes.includes(file.type)) {
        alert(`File type ${file.type} is not supported`);
        return false;
      }
      if (file.size > maxSize) {
        alert(`File ${file.name} is too large. Maximum size is ${formatFileSize(maxSize)}`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setIsUploading(true);
    
    for (const file of validFiles) {
      await uploadFile(file);
    }
    
    setIsUploading(false);
  };

  const uploadFile = async (file) => {
    const fileId = Math.random().toString(36).substr(2, 9);
    
    // Simulate upload progress
    setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));
    
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        const currentProgress = prev[fileId] || 0;
        if (currentProgress >= 100) {
          clearInterval(progressInterval);
          return prev;
        }
        return { ...prev, [fileId]: currentProgress + Math.random() * 20 };
      });
    }, 200);

    // Simulate upload completion
    setTimeout(() => {
      clearInterval(progressInterval);
      setUploadProgress(prev => ({ ...prev, [fileId]: 100 }));
      
      // Create document object
      const document = {
        id: fileId,
        name: file.name,
        type: file.type.split('/')[1] || 'unknown',
        size: file.size,
        uploadDate: new Date().toISOString(),
        status: 'processing',
        category: detectCategory(file.name),
        thumbnail: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
      };
      
      onUpload(document);
      
      // Remove progress after delay
      setTimeout(() => {
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[fileId];
          return newProgress;
        });
      }, 2000);
    }, 2000 + Math.random() * 1000);
  };

  const detectCategory = (filename) => {
    const name = filename.toLowerCase();
    if (name.includes('id') || name.includes('license') || name.includes('passport')) return 'identification';
    if (name.includes('permit') || name.includes('certificate')) return 'permits';
    if (name.includes('plan') || name.includes('blueprint') || name.includes('drawing')) return 'plans';
    if (name.includes('photo') || name.includes('image')) return 'photos';
    return 'other';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const openCameraDialog = () => {
    cameraInputRef.current?.click();
  };

  const uploadingFiles = Object.keys(uploadProgress);

  return (
    <div className="space-y-4">
      {/* Main Upload Zone */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
          ${isDragOver 
            ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50 hover:bg-muted/50'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
            <Icon 
              name={isDragOver ? "Upload" : "CloudUpload"} 
              size={32} 
              className={isDragOver ? "text-primary" : "text-muted-foreground"} 
            />
          </div>
          
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
              {isDragOver ? "Drop files here" : "Upload Documents"}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Drag and drop files here, or click to browse
            </p>
            
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              <Button
                variant="default"
                iconName="Upload"
                iconPosition="left"
                iconSize={16}
                onClick={openFileDialog}
                disabled={isUploading}
              >
                Browse Files
              </Button>
              
              <Button
                variant="outline"
                iconName="Camera"
                iconPosition="left"
                iconSize={16}
                onClick={openCameraDialog}
                disabled={isUploading}
              >
                Take Photo
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground">
              Supported formats: PDF, JPG, PNG, DOC, DOCX • Max size: {formatFileSize(maxSize)}
            </p>
          </div>
        </div>

        {/* Hidden File Inputs */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Upload Progress */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Uploading Files</h4>
          {uploadingFiles.map(fileId => (
            <div key={fileId} className="bg-card border border-border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Icon name="File" size={16} className="text-muted-foreground" />
                  <span className="text-sm text-foreground">Uploading...</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {Math.round(uploadProgress[fileId] || 0)}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress[fileId] || 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Guidelines */}
      <div className="bg-muted/50 border border-border rounded-lg p-4">
        <h4 className="text-sm font-medium text-foreground mb-2 flex items-center">
          <Icon name="Info" size={16} className="mr-2 text-accent" />
          Upload Guidelines
        </h4>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Ensure documents are clear and readable</li>
          <li>• All text should be visible and not cut off</li>
          <li>• Avoid blurry or low-quality images</li>
          <li>• Use proper lighting for photos</li>
          <li>• File names should be descriptive</li>
        </ul>
      </div>
    </div>
  );
};

export default DocumentUploadZone;