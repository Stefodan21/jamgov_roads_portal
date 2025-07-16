import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PhotoCaptureTools = ({ applicationId, onPhotosUpdate }) => {
  const [photos, setPhotos] = useState([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const mockExistingPhotos = [
    {
      id: 1,
      url: "https://images.pexels.com/photos/1109541/pexels-photo-1109541.jpeg?auto=compress&cs=tinysrgb&w=800",
      timestamp: new Date(Date.now() - 3600000),
      location: { lat: 18.0179, lng: -76.8099 },
      type: "site_overview",
      description: "Site overview - main entrance",
      size: "2.4 MB"
    },
    {
      id: 2,
      url: "https://images.pexels.com/photos/159306/construction-site-build-construction-work-159306.jpeg?auto=compress&cs=tinysrgb&w=800",
      timestamp: new Date(Date.now() - 1800000),
      location: { lat: 18.0179, lng: -76.8099 },
      type: "compliance_check",
      description: "Safety barriers installation",
      size: "3.1 MB"
    }
  ];

  const [allPhotos, setAllPhotos] = useState(mockExistingPhotos);

  const photoTypes = [
    { value: 'site_overview', label: 'Site Overview', icon: 'Camera' },
    { value: 'compliance_check', label: 'Compliance Check', icon: 'Shield' },
    { value: 'safety_inspection', label: 'Safety Inspection', icon: 'AlertTriangle' },
    { value: 'progress_update', label: 'Progress Update', icon: 'TrendingUp' },
    { value: 'issue_documentation', label: 'Issue Documentation', icon: 'AlertCircle' },
    { value: 'completion_proof', label: 'Completion Proof', icon: 'CheckCircle' }
  ];

  const handleFileSelect = (event, source = 'gallery') => {
    const files = Array.from(event.target.files);
    
    files.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newPhoto = {
            id: Date.now() + Math.random(),
            url: e.target.result,
            timestamp: new Date(),
            location: { lat: 18.0179, lng: -76.8099 }, // Mock GPS
            type: 'site_overview',
            description: `Photo captured from ${source}`,
            size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
            file: file,
            isNew: true
          };
          
          setAllPhotos(prev => [...prev, newPhoto]);
          onPhotosUpdate && onPhotosUpdate([...allPhotos, newPhoto]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleCameraCapture = () => {
    setIsCapturing(true);
    cameraInputRef.current?.click();
  };

  const handleGallerySelect = () => {
    fileInputRef.current?.click();
  };

  const handleDeletePhoto = (photoId) => {
    const updatedPhotos = allPhotos.filter(photo => photo.id !== photoId);
    setAllPhotos(updatedPhotos);
    onPhotosUpdate && onPhotosUpdate(updatedPhotos);
    setSelectedPhoto(null);
  };

  const handleUpdatePhotoType = (photoId, newType) => {
    const updatedPhotos = allPhotos.map(photo =>
      photo.id === photoId ? { ...photo, type: newType } : photo
    );
    setAllPhotos(updatedPhotos);
    onPhotosUpdate && onPhotosUpdate(updatedPhotos);
  };

  const handleUpdateDescription = (photoId, newDescription) => {
    const updatedPhotos = allPhotos.map(photo =>
      photo.id === photoId ? { ...photo, description: newDescription } : photo
    );
    setAllPhotos(updatedPhotos);
    onPhotosUpdate && onPhotosUpdate(updatedPhotos);
  };

  const getPhotoTypeConfig = (type) => {
    const config = photoTypes.find(t => t.value === type);
    return config || photoTypes[0];
  };

  const formatTimestamp = (timestamp) => {
    return timestamp.toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground">
            Photo Documentation
          </h3>
          <p className="text-sm text-muted-foreground">
            {allPhotos.length} photos • App ID: {applicationId}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Camera"
            iconPosition="left"
            iconSize={16}
            onClick={handleCameraCapture}
            disabled={isCapturing}
          >
            Camera
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="Image"
            iconPosition="left"
            iconSize={16}
            onClick={handleGallerySelect}
          >
            Gallery
          </Button>
        </div>
      </div>

      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => handleFileSelect(e, 'gallery')}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) => {
          handleFileSelect(e, 'camera');
          setIsCapturing(false);
        }}
        className="hidden"
      />

      {/* Photos Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {allPhotos.map((photo) => {
          const typeConfig = getPhotoTypeConfig(photo.type);
          
          return (
            <div
              key={photo.id}
              className="relative group cursor-pointer"
              onClick={() => setSelectedPhoto(photo)}
            >
              <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                <img
                  src={photo.url}
                  alt={photo.description}
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                />
              </div>
              
              {/* Overlay Info */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200 rounded-lg">
                <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="flex items-center space-x-1 bg-black/60 text-white px-2 py-1 rounded text-xs">
                    <Icon name={typeConfig.icon} size={12} />
                    <span>{typeConfig.label}</span>
                  </div>
                </div>
                
                <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <p className="text-white text-xs truncate bg-black/60 px-2 py-1 rounded">
                    {photo.description}
                  </p>
                </div>
              </div>

              {/* New Photo Indicator */}
              {photo.isNew && (
                <div className="absolute top-2 right-2 w-3 h-3 bg-success rounded-full border-2 border-white" />
              )}

              {/* Delete Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeletePhoto(photo.id);
                }}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-error text-error-foreground rounded-full p-1 hover:bg-error/80"
              >
                <Icon name="X" size={12} />
              </button>
            </div>
          );
        })}

        {/* Add Photo Placeholder */}
        <div
          onClick={handleGallerySelect}
          className="aspect-square border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors duration-200"
        >
          <Icon name="Plus" size={24} className="text-muted-foreground mb-2" />
          <span className="text-sm text-muted-foreground">Add Photo</span>
        </div>
      </div>

      {/* Photo Details Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-lg font-heading font-semibold text-foreground">
                Photo Details
              </h3>
              <Button
                variant="ghost"
                size="sm"
                iconName="X"
                iconSize={16}
                onClick={() => setSelectedPhoto(null)}
              />
            </div>

            {/* Photo Display */}
            <div className="p-4">
              <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-4">
                <img
                  src={selectedPhoto.url}
                  alt={selectedPhoto.description}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Photo Info */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Photo Type
                  </label>
                  <select
                    value={selectedPhoto.type}
                    onChange={(e) => handleUpdatePhotoType(selectedPhoto.id, e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-input border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {photoTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Description
                  </label>
                  <textarea
                    value={selectedPhoto.description}
                    onChange={(e) => handleUpdateDescription(selectedPhoto.id, e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-input border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    rows={3}
                    placeholder="Add photo description..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="text-muted-foreground">Timestamp</label>
                    <p className="text-foreground">
                      {formatTimestamp(selectedPhoto.timestamp)}
                    </p>
                  </div>
                  <div>
                    <label className="text-muted-foreground">File Size</label>
                    <p className="text-foreground">{selectedPhoto.size}</p>
                  </div>
                  <div>
                    <label className="text-muted-foreground">Location</label>
                    <p className="text-foreground font-mono text-xs">
                      {selectedPhoto.location.lat}, {selectedPhoto.location.lng}
                    </p>
                  </div>
                  <div>
                    <label className="text-muted-foreground">GPS Status</label>
                    <div className="flex items-center space-x-1">
                      <Icon name="MapPin" size={12} className="text-success" />
                      <span className="text-success text-xs">Verified</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end space-x-2 p-4 border-t border-border">
              <Button
                variant="outline"
                onClick={() => handleDeletePhoto(selectedPhoto.id)}
                iconName="Trash2"
                iconPosition="left"
                iconSize={16}
                className="text-error"
              >
                Delete
              </Button>
              <Button
                variant="default"
                onClick={() => setSelectedPhoto(null)}
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
        <div className="text-center">
          <div className="text-lg font-semibold text-foreground">
            {allPhotos.length}
          </div>
          <div className="text-sm text-muted-foreground">Total Photos</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-foreground">
            {allPhotos.filter(p => p.isNew).length}
          </div>
          <div className="text-sm text-muted-foreground">New Today</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-foreground">
            {allPhotos.reduce((acc, p) => acc + parseFloat(p.size), 0).toFixed(1)} MB
          </div>
          <div className="text-sm text-muted-foreground">Total Size</div>
        </div>
      </div>
    </div>
  );
};

export default PhotoCaptureTools;