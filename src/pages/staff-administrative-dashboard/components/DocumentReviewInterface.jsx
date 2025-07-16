import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Image from '../../../components/AppImage';

const DocumentReviewInterface = () => {
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [ocrResults, setOcrResults] = useState([]);
  const [verificationStatus, setVerificationStatus] = useState({});
  const [qualityScore, setQualityScore] = useState(0);
  const [manualCorrections, setManualCorrections] = useState({});
  const [reviewNotes, setReviewNotes] = useState('');

  const mockDocuments = [
    {
      id: 'DOC-2025-001',
      name: 'National ID - Marcus Campbell',
      type: 'identification',
      applicationId: 'APP-2025-001',
      uploadDate: '2025-01-16T08:30:00',
      fileSize: '2.4 MB',
      format: 'PDF',
      ocrEngine: 'Google Cloud Vision AI',
      qualityScore: 94,
      status: 'pending-review',
      imageUrl: 'https://images.pexels.com/photos/6863183/pexels-photo-6863183.jpeg'
    },
    {
      id: 'DOC-2025-002',
      name: 'Construction License - Jennifer Brown',
      type: 'license',
      applicationId: 'APP-2025-002',
      uploadDate: '2025-01-16T09:15:00',
      fileSize: '1.8 MB',
      format: 'JPEG',
      ocrEngine: 'ABBYY FineReader',
      qualityScore: 87,
      status: 'verified',
      imageUrl: 'https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg'
    },
    {
      id: 'DOC-2025-003',
      name: 'Property Deed - David Wilson',
      type: 'property',
      applicationId: 'APP-2025-003',
      uploadDate: '2025-01-16T10:45:00',
      fileSize: '3.1 MB',
      format: 'PDF',
      ocrEngine: 'Tesseract',
      qualityScore: 76,
      status: 'needs-correction',
      imageUrl: 'https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg'
    }
  ];

  const mockOcrResults = {
    'DOC-2025-001': [
      {
        field: 'Full Name',
        extractedValue: 'Marcus Campbell',
        confidence: 0.98,
        boundingBox: { x: 120, y: 45, width: 180, height: 25 },
        verified: true
      },
      {
        field: 'ID Number',
        extractedValue: '1234567890123',
        confidence: 0.95,
        boundingBox: { x: 120, y: 85, width: 150, height: 20 },
        verified: true
      },
      {
        field: 'Date of Birth',
        extractedValue: '15/03/1985',
        confidence: 0.92,
        boundingBox: { x: 120, y: 125, width: 100, height: 20 },
        verified: false
      },
      {
        field: 'Address',
        extractedValue: '123 Main Street, Kingston, Jamaica',
        confidence: 0.89,
        boundingBox: { x: 120, y: 165, width: 250, height: 40 },
        verified: false
      }
    ]
  };

  useEffect(() => {
    if (selectedDocument) {
      setOcrResults(mockOcrResults[selectedDocument.id] || []);
      setQualityScore(selectedDocument.qualityScore);
    }
  }, [selectedDocument]);

  const handleDocumentSelect = (document) => {
    setSelectedDocument(document);
    setManualCorrections({});
    setReviewNotes('');
  };

  const handleFieldVerification = (fieldIndex, verified) => {
    setVerificationStatus(prev => ({
      ...prev,
      [fieldIndex]: verified
    }));
  };

  const handleManualCorrection = (fieldIndex, correctedValue) => {
    setManualCorrections(prev => ({
      ...prev,
      [fieldIndex]: correctedValue
    }));
  };

  const handleApproveDocument = () => {
    console.log('Document approved:', selectedDocument.id);
    // Update document status
  };

  const handleRejectDocument = () => {
    console.log('Document rejected:', selectedDocument.id);
    // Update document status
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'text-success bg-success/10';
      case 'pending-review': return 'text-warning bg-warning/10';
      case 'needs-correction': return 'text-error bg-error/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.9) return 'text-success';
    if (confidence >= 0.7) return 'text-warning';
    return 'text-error';
  };

  const getQualityColor = (score) => {
    if (score >= 90) return 'text-success';
    if (score >= 70) return 'text-warning';
    return 'text-error';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-heading font-semibold text-foreground">
          Document Review Interface
        </h2>
        <div className="flex items-center space-x-2">
          <Select
            options={[
              { value: 'all', label: 'All Documents' },
              { value: 'pending-review', label: 'Pending Review' },
              { value: 'needs-correction', label: 'Needs Correction' }
            ]}
            value="all"
            onChange={() => {}}
            className="w-40"
          />
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Document List */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
            Documents Queue
          </h3>
          <div className="space-y-3">
            {mockDocuments.map((doc) => (
              <div
                key={doc.id}
                onClick={() => handleDocumentSelect(doc)}
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-elevation-1 ${
                  selectedDocument?.id === doc.id 
                    ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground truncate">{doc.name}</h4>
                    <p className="text-sm text-muted-foreground">{doc.type}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                    {doc.status.replace('-', ' ')}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{doc.format} • {doc.fileSize}</span>
                  <div className="flex items-center space-x-1">
                    <Icon name="Eye" size={12} />
                    <span className={getQualityColor(doc.qualityScore)}>
                      {doc.qualityScore}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Document Viewer */}
        <div className="bg-card border border-border rounded-lg p-6">
          {selectedDocument ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-heading font-semibold text-foreground">
                  Document Viewer
                </h3>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="ZoomIn"
                    iconSize={14}
                    title="Zoom in"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="ZoomOut"
                    iconSize={14}
                    title="Zoom out"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="RotateCw"
                    iconSize={14}
                    title="Rotate"
                  />
                </div>
              </div>

              <div className="relative bg-muted/30 rounded-lg overflow-hidden mb-4" style={{ height: '400px' }}>
                <Image
                  src={selectedDocument.imageUrl}
                  alt={selectedDocument.name}
                  className="w-full h-full object-contain"
                />
                
                {/* OCR Bounding Boxes Overlay */}
                {ocrResults.map((result, index) => (
                  <div
                    key={index}
                    className={`absolute border-2 ${
                      verificationStatus[index] === true ? 'border-success' :
                      verificationStatus[index] === false ? 'border-error': 'border-accent'
                    }`}
                    style={{
                      left: `${result.boundingBox.x}px`,
                      top: `${result.boundingBox.y}px`,
                      width: `${result.boundingBox.width}px`,
                      height: `${result.boundingBox.height}px`
                    }}
                    title={`${result.field}: ${result.extractedValue}`}
                  />
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">OCR Engine:</span>
                  <div className="font-medium text-foreground">{selectedDocument.ocrEngine}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Quality Score:</span>
                  <div className={`font-medium ${getQualityColor(qualityScore)}`}>
                    {qualityScore}%
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">File Size:</span>
                  <div className="font-medium text-foreground">{selectedDocument.fileSize}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Format:</span>
                  <div className="font-medium text-foreground">{selectedDocument.format}</div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Select a document to view and review
              </p>
            </div>
          )}
        </div>

        {/* OCR Results and Verification */}
        <div className="bg-card border border-border rounded-lg p-6">
          {selectedDocument ? (
            <>
              <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
                OCR Results
              </h3>
              
              <div className="space-y-4 mb-6">
                {ocrResults.map((result, index) => (
                  <div key={index} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-foreground">{result.field}</span>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs ${getConfidenceColor(result.confidence)}`}>
                          {Math.round(result.confidence * 100)}%
                        </span>
                        <Checkbox
                          checked={verificationStatus[index] === true}
                          onChange={(e) => handleFieldVerification(index, e.target.checked)}
                          size="sm"
                        />
                      </div>
                    </div>
                    
                    <div className="text-sm text-foreground mb-2">
                      {result.extractedValue}
                    </div>
                    
                    <input
                      type="text"
                      placeholder="Manual correction..."
                      value={manualCorrections[index] || ''}
                      onChange={(e) => handleManualCorrection(index, e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Review Notes
                  </label>
                  <textarea
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    placeholder="Add review notes..."
                    className="w-full px-3 py-2 border border-border rounded-md text-foreground bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                    rows={3}
                  />
                </div>

                <div className="flex space-x-3">
                  <Button
                    variant="default"
                    fullWidth
                    iconName="CheckCircle"
                    iconPosition="left"
                    iconSize={16}
                    onClick={handleApproveDocument}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    fullWidth
                    iconName="XCircle"
                    iconPosition="left"
                    iconSize={16}
                    onClick={handleRejectDocument}
                  >
                    Reject
                  </Button>
                </div>

                <Button
                  variant="outline"
                  fullWidth
                  iconName="MessageSquare"
                  iconPosition="left"
                  iconSize={16}
                >
                  Request Clarification
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Select a document to view OCR results
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentReviewInterface;