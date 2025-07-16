import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import ApplicationTypeSelector from './components/ApplicationTypeSelector';
import PersonalInformationForm from './components/PersonalInformationForm';
import ProjectDetailsForm from './components/ProjectDetailsForm';
import DocumentUploadZone from './components/DocumentUploadZone';
import FeeCalculator from './components/FeeCalculator';
import ApplicationProgressIndicator from './components/ApplicationProgressIndicator';
import ApplicationReviewSummary from './components/ApplicationReviewSummary';

const ApplicationSubmissionPortal = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedApplicationType, setSelectedApplicationType] = useState(null);
  const [personalInfo, setPersonalInfo] = useState({});
  const [projectDetails, setProjectDetails] = useState({});
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [calculatedFee, setCalculatedFee] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [language, setLanguage] = useState('en');

  const totalSteps = 5;
  const steps = [
    { title: 'Application Type', icon: 'FileText' },
    { title: 'Personal Info', icon: 'User' },
    { title: 'Project Details', icon: 'Settings' },
    { title: 'Documents', icon: 'Upload' },
    { title: 'Review & Submit', icon: 'CheckCircle' }
  ];

  // Auto-save functionality
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (selectedApplicationType || Object.keys(personalInfo).length > 0 || Object.keys(projectDetails).length > 0) {
        handleAutoSave();
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [selectedApplicationType, personalInfo, projectDetails, uploadedDocuments]);

  // Load saved data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('jamgov-application-draft');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setSelectedApplicationType(parsed.applicationType);
        setPersonalInfo(parsed.personalInfo || {});
        setProjectDetails(parsed.projectDetails || {});
        setCurrentStep(parsed.currentStep || 0);
      } catch (error) {
        console.error('Error loading saved application:', error);
      }
    }

    // Load language preference
    const savedLanguage = localStorage.getItem('jamgov-language') || 'en';
    setLanguage(savedLanguage);
  }, []);

  const handleAutoSave = async () => {
    setIsAutoSaving(true);
    
    const draftData = {
      applicationType: selectedApplicationType,
      personalInfo,
      projectDetails,
      currentStep,
      savedAt: new Date().toISOString()
    };

    try {
      localStorage.setItem('jamgov-application-draft', JSON.stringify(draftData));
      setLastSaved(new Date());
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setIsAutoSaving(false);
    }
  };

  const validateStep = (step) => {
    const errors = {};

    switch (step) {
      case 0:
        if (!selectedApplicationType) {
          errors.applicationType = 'Please select an application type';
        }
        break;
      
      case 1:
        if (!personalInfo.firstName) errors.firstName = 'First name is required';
        if (!personalInfo.lastName) errors.lastName = 'Last name is required';
        if (!personalInfo.email) errors.email = 'Email is required';
        if (!personalInfo.phone) errors.phone = 'Phone number is required';
        if (!personalInfo.address) errors.address = 'Address is required';
        if (!personalInfo.parish) errors.parish = 'Parish is required';
        if (!personalInfo.identificationType) errors.identificationType = 'ID type is required';
        if (!personalInfo.identificationNumber) errors.identificationNumber = 'ID number is required';
        if (!personalInfo.trn) errors.trn = 'TRN is required';
        if (!personalInfo.dateOfBirth) errors.dateOfBirth = 'Date of birth is required';
        break;
      
      case 2:
        if (!projectDetails.projectTitle) errors.projectTitle = 'Project title is required';
        if (!projectDetails.projectDescription) errors.projectDescription = 'Project description is required';
        if (!projectDetails.projectLocation) errors.projectLocation = 'Project location is required';
        if (!projectDetails.projectDuration) errors.projectDuration = 'Project duration is required';
        if (!projectDetails.startDate) errors.startDate = 'Start date is required';
        if (!projectDetails.endDate) errors.endDate = 'End date is required';
        if (!projectDetails.workSchedule) errors.workSchedule = 'Work schedule is required';
        if (!projectDetails.trafficImpact) errors.trafficImpact = 'Traffic impact level is required';
        break;
      
      case 3:
        if (uploadedDocuments.length === 0) {
          errors.documents = 'At least one document is required';
        }
        break;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(Math.min(currentStep + 1, totalSteps - 1));
      handleAutoSave();
    }
  };

  const handlePrevious = () => {
    setCurrentStep(Math.max(currentStep - 1, 0));
  };

  const handleStepEdit = (stepIndex) => {
    setCurrentStep(stepIndex);
  };

  const handleApplicationSubmit = async () => {
    try {
      // Simulate submission process
      const applicationId = 'APP-' + Date.now().toString(36).toUpperCase();
      
      // Clear saved draft
      localStorage.removeItem('jamgov-application-draft');
      
      // Navigate to success page or dashboard with application ID
      navigate('/citizen-dashboard', { 
        state: { 
          submittedApplication: {
            id: applicationId,
            type: selectedApplicationType.name,
            submittedAt: new Date(),
            status: 'submitted'
          }
        }
      });
    } catch (error) {
      console.error('Application submission failed:', error);
    }
  };

  const getRequiredDocuments = () => {
    if (!selectedApplicationType) return [];
    return selectedApplicationType.requirements || [];
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <ApplicationTypeSelector
            selectedType={selectedApplicationType}
            onTypeSelect={setSelectedApplicationType}
            className="max-w-4xl mx-auto"
          />
        );
      
      case 1:
        return (
          <PersonalInformationForm
            formData={personalInfo}
            onFormChange={setPersonalInfo}
            errors={formErrors}
            className="max-w-4xl mx-auto"
          />
        );
      
      case 2:
        return (
          <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ProjectDetailsForm
                formData={projectDetails}
                onFormChange={setProjectDetails}
                applicationType={selectedApplicationType}
                errors={formErrors}
              />
            </div>
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <FeeCalculator
                  applicationType={selectedApplicationType}
                  formData={projectDetails}
                  onFeeCalculated={setCalculatedFee}
                />
              </div>
            </div>
          </div>
        );
      
      case 3:
        return (
          <DocumentUploadZone
            uploadedDocuments={uploadedDocuments}
            onDocumentsChange={setUploadedDocuments}
            requiredDocuments={getRequiredDocuments()}
            applicationType={selectedApplicationType}
            className="max-w-4xl mx-auto"
          />
        );
      
      case 4:
        return (
          <ApplicationReviewSummary
            applicationType={selectedApplicationType}
            personalInfo={personalInfo}
            projectDetails={projectDetails}
            uploadedDocuments={uploadedDocuments}
            calculatedFee={calculatedFee}
            onEdit={handleStepEdit}
            onSubmit={handleApplicationSubmit}
            className="max-w-4xl mx-auto"
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Progress Indicator */}
        <div className="mb-8">
          <ApplicationProgressIndicator
            currentStep={currentStep}
            totalSteps={totalSteps}
            steps={steps}
          />
        </div>

        {/* Auto-save Status */}
        {(isAutoSaving || lastSaved) && (
          <div className="mb-6 flex items-center justify-center">
            <div className="flex items-center space-x-2 px-3 py-1 bg-muted/50 rounded-full text-sm text-muted-foreground">
              {isAutoSaving ? (
                <>
                  <Icon name="RefreshCw" size={14} className="animate-spin" />
                  <span>Saving draft...</span>
                </>
              ) : (
                <>
                  <Icon name="Check" size={14} className="text-success" />
                  <span>Draft saved at {lastSaved?.toLocaleTimeString()}</span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Step Content */}
        <div className="mb-8">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-card border border-border rounded-lg sticky bottom-4 shadow-elevation-2">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                iconName="ArrowLeft"
                iconPosition="left"
                iconSize={16}
              >
                Previous
              </Button>
              
              <div className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {totalSteps}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={handleAutoSave}
                iconName="Save"
                iconPosition="left"
                iconSize={16}
                disabled={isAutoSaving}
              >
                Save Draft
              </Button>
              
              {currentStep < totalSteps - 1 ? (
                <Button
                  variant="default"
                  onClick={handleNext}
                  iconName="ArrowRight"
                  iconPosition="right"
                  iconSize={16}
                >
                  Next
                </Button>
              ) : (
                <Button
                  variant="default"
                  onClick={() => validateStep(currentStep) && handleApplicationSubmit()}
                  iconName="Send"
                  iconPosition="right"
                  iconSize={16}
                  disabled={!validateStep(currentStep)}
                >
                  Submit Application
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Error Summary */}
        {Object.keys(formErrors).length > 0 && (
          <div className="max-w-4xl mx-auto mt-4 p-4 bg-error/10 border border-error/20 rounded-lg">
            <div className="flex items-start space-x-3">
              <Icon name="AlertTriangle" size={20} className="text-error mt-0.5" />
              <div>
                <h4 className="font-medium text-error mb-2">Please fix the following errors:</h4>
                <ul className="text-sm text-error/80 space-y-1">
                  {Object.values(formErrors).map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ApplicationSubmissionPortal;