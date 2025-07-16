import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import DocumentStatusIndicator from '../../../components/ui/DocumentStatusIndicator';

const ApplicationReviewSummary = ({ 
  applicationType,
  personalInfo,
  projectDetails,
  uploadedDocuments,
  calculatedFee,
  onEdit,
  onSubmit,
  className = '' 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-JM', {
      style: 'currency',
      currency: 'JMD',
      minimumFractionDigits: 2
    }).format(amount).replace('JMD', 'J$');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-JM', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleSubmit = async () => {
    if (!agreedToTerms) {
      alert('Please agree to the terms and conditions before submitting.');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate submission process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    onSubmit();
    setIsSubmitting(false);
  };

  const getCompletionStatus = () => {
    const requiredSections = [
      { name: 'Application Type', completed: !!applicationType },
      { name: 'Personal Information', completed: !!(personalInfo?.firstName && personalInfo?.lastName && personalInfo?.email) },
      { name: 'Project Details', completed: !!(projectDetails?.projectTitle && projectDetails?.projectLocation) },
      { name: 'Documents', completed: uploadedDocuments?.length > 0 }
    ];

    const completedCount = requiredSections.filter(section => section.completed).length;
    const completionPercentage = (completedCount / requiredSections.length) * 100;

    return { requiredSections, completedCount, completionPercentage };
  };

  const { requiredSections, completedCount, completionPercentage } = getCompletionStatus();
  const isReadyToSubmit = completionPercentage === 100;

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
          Review & Submit Application
        </h2>
        <p className="text-muted-foreground">
          Please review all information before submitting your application
        </p>
      </div>

      {/* Completion Status */}
      <div className="p-4 bg-card border border-border rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-heading font-semibold text-foreground">
            Application Completion
          </h3>
          <span className={`text-sm font-medium ${isReadyToSubmit ? 'text-success' : 'text-warning'}`}>
            {Math.round(completionPercentage)}% Complete
          </span>
        </div>
        
        <div className="w-full bg-muted rounded-full h-2 mb-4">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${isReadyToSubmit ? 'bg-success' : 'bg-warning'}`}
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {requiredSections.map((section, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Icon 
                name={section.completed ? 'CheckCircle' : 'Circle'} 
                size={16} 
                className={section.completed ? 'text-success' : 'text-muted-foreground'}
              />
              <span className={`text-sm ${section.completed ? 'text-success' : 'text-muted-foreground'}`}>
                {section.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Application Type Summary */}
      {applicationType && (
        <div className="p-4 bg-card border border-border rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-heading font-semibold text-foreground">
              Application Type
            </h3>
            <Button
              variant="ghost"
              size="sm"
              iconName="Edit"
              iconSize={14}
              onClick={() => onEdit(0)}
            >
              Edit
            </Button>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <Icon name="FileText" size={20} className="text-primary" />
              <div>
                <p className="font-medium text-foreground">{applicationType.name}</p>
                <p className="text-sm text-muted-foreground">{applicationType.description}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
              <div>
                <span className="text-muted-foreground">Processing Time:</span>
                <p className="font-medium text-foreground">{applicationType.processingTime}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Base Fee:</span>
                <p className="font-medium text-foreground">{applicationType.fee}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Personal Information Summary */}
      {personalInfo && (
        <div className="p-4 bg-card border border-border rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-heading font-semibold text-foreground">
              Personal Information
            </h3>
            <Button
              variant="ghost"
              size="sm"
              iconName="Edit"
              iconSize={14}
              onClick={() => onEdit(1)}
            >
              Edit
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Full Name:</span>
              <p className="font-medium text-foreground">
                {personalInfo.firstName} {personalInfo.lastName}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Email:</span>
              <p className="font-medium text-foreground">{personalInfo.email}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Phone:</span>
              <p className="font-medium text-foreground">{personalInfo.phone}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Parish:</span>
              <p className="font-medium text-foreground capitalize">
                {personalInfo.parish?.replace('-', ' ')}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Address:</span>
              <p className="font-medium text-foreground">
                {personalInfo.address}, {personalInfo.city}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">TRN:</span>
              <p className="font-medium text-foreground font-mono">{personalInfo.trn}</p>
            </div>
          </div>
        </div>
      )}

      {/* Project Details Summary */}
      {projectDetails && (
        <div className="p-4 bg-card border border-border rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-heading font-semibold text-foreground">
              Project Details
            </h3>
            <Button
              variant="ghost"
              size="sm"
              iconName="Edit"
              iconSize={14}
              onClick={() => onEdit(2)}
            >
              Edit
            </Button>
          </div>
          
          <div className="space-y-4">
            <div>
              <span className="text-muted-foreground text-sm">Project Title:</span>
              <p className="font-medium text-foreground">{projectDetails.projectTitle}</p>
            </div>
            
            <div>
              <span className="text-muted-foreground text-sm">Description:</span>
              <p className="text-foreground">{projectDetails.projectDescription}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Location:</span>
                <p className="font-medium text-foreground">{projectDetails.projectLocation}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Duration:</span>
                <p className="font-medium text-foreground">{projectDetails.projectDuration} days</p>
              </div>
              <div>
                <span className="text-muted-foreground">Start Date:</span>
                <p className="font-medium text-foreground">{formatDate(projectDetails.startDate)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">End Date:</span>
                <p className="font-medium text-foreground">{formatDate(projectDetails.endDate)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Documents Summary */}
      <div className="p-4 bg-card border border-border rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-heading font-semibold text-foreground">
            Uploaded Documents ({uploadedDocuments?.length || 0})
          </h3>
          <Button
            variant="ghost"
            size="sm"
            iconName="Edit"
            iconSize={14}
            onClick={() => onEdit(3)}
          >
            Edit
          </Button>
        </div>
        
        {uploadedDocuments && uploadedDocuments.length > 0 ? (
          <div className="space-y-3">
            {uploadedDocuments.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Icon name="FileText" size={16} className="text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground text-sm">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(doc.size / 1024 / 1024).toFixed(2)} MB • Uploaded {doc.uploadedAt?.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <DocumentStatusIndicator
                  documentId={doc.id}
                  status="approved"
                  size="sm"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <Icon name="Upload" size={32} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No documents uploaded</p>
          </div>
        )}
      </div>

      {/* Fee Summary */}
      {calculatedFee && (
        <div className="p-4 bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20 rounded-lg">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-3">
            Fee Summary
          </h3>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Total Application Fee</p>
              <p className="text-xs text-muted-foreground">All taxes and fees included</p>
            </div>
            <div className="text-2xl font-heading font-bold text-primary">
              {formatCurrency(calculatedFee.total)}
            </div>
          </div>
        </div>
      )}

      {/* Terms and Conditions */}
      <div className="p-4 bg-muted/30 border border-border rounded-lg">
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="terms"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="mt-1"
          />
          <label htmlFor="terms" className="text-sm text-foreground">
            <span className="font-medium">I agree to the terms and conditions</span>
            <p className="text-muted-foreground mt-1">
              By submitting this application, I confirm that all information provided is accurate and complete. 
              I understand that providing false information may result in application rejection and potential legal consequences. 
              I agree to comply with all applicable laws and regulations related to this application.
            </p>
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border">
        <Button
          variant="outline"
          onClick={() => onEdit(completedCount - 1)}
          iconName="ArrowLeft"
          iconPosition="left"
          iconSize={16}
          className="sm:w-auto"
        >
          Back to Edit
        </Button>
        
        <Button
          variant="default"
          onClick={handleSubmit}
          disabled={!isReadyToSubmit || !agreedToTerms || isSubmitting}
          loading={isSubmitting}
          iconName={isSubmitting ? 'RefreshCw' : 'Send'}
          iconPosition="right"
          iconSize={16}
          className="sm:flex-1"
        >
          {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
        </Button>
      </div>

      {/* Submission Notice */}
      {!isReadyToSubmit && (
        <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="AlertTriangle" size={20} className="text-warning" />
            <div>
              <p className="font-medium text-warning">Application Incomplete</p>
              <p className="text-sm text-warning/80">
                Please complete all required sections before submitting your application.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationReviewSummary;