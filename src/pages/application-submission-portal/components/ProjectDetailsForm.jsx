import React, { useState, useEffect } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const ProjectDetailsForm = ({ formData, onFormChange, applicationType, errors = {}, className = '' }) => {
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [estimatedCost, setEstimatedCost] = useState(0);

  const projectTypes = {
    'road-permit': [
      { value: 'excavation', label: 'Road Excavation' },
      { value: 'utility-installation', label: 'Utility Installation' },
      { value: 'road-repair', label: 'Road Repair' },
      { value: 'sidewalk-work', label: 'Sidewalk Work' },
      { value: 'drainage-work', label: 'Drainage Work' }
    ],
    'construction-permit': [
      { value: 'residential', label: 'Residential Construction' },
      { value: 'commercial', label: 'Commercial Construction' },
      { value: 'industrial', label: 'Industrial Construction' },
      { value: 'renovation', label: 'Renovation/Extension' }
    ],
    'utility-permit': [
      { value: 'water-line', label: 'Water Line Installation' },
      { value: 'sewer-line', label: 'Sewer Line Installation' },
      { value: 'gas-line', label: 'Gas Line Installation' },
      { value: 'electrical', label: 'Electrical Infrastructure' },
      { value: 'telecommunications', label: 'Telecommunications' }
    ]
  };

  const urgencyLevels = [
    { value: 'standard', label: 'Standard Processing (10-14 days)' },
    { value: 'expedited', label: 'Expedited Processing (5-7 days) - Additional J$1,000' },
    { value: 'emergency', label: 'Emergency Processing (1-3 days) - Additional J$2,500' }
  ];

  const workSchedules = [
    { value: 'business-hours', label: 'Business Hours Only (8 AM - 5 PM)' },
    { value: 'extended-hours', label: 'Extended Hours (6 AM - 8 PM)' },
    { value: 'night-work', label: 'Night Work (8 PM - 6 AM) - Requires special approval' },
    { value: 'weekend-work', label: 'Weekend Work - Additional fees apply' }
  ];

  const trafficImpactLevels = [
    { value: 'minimal', label: 'Minimal Impact - No lane closures' },
    { value: 'moderate', label: 'Moderate Impact - Partial lane closures' },
    { value: 'significant', label: 'Significant Impact - Full lane closures' },
    { value: 'major', label: 'Major Impact - Road diversions required' }
  ];

  useEffect(() => {
    // Calculate estimated cost based on project details
    let baseCost = 0;
    const urgencyMultiplier = {
      'standard': 1,
      'expedited': 1.4,
      'emergency': 2
    };

    const impactMultiplier = {
      'minimal': 1,
      'moderate': 1.2,
      'significant': 1.5,
      'major': 2
    };

    if (applicationType?.fee) {
      baseCost = parseFloat(applicationType.fee.replace(/[J$,]/g, ''));
    }

    const urgency = urgencyMultiplier[formData.urgencyLevel] || 1;
    const impact = impactMultiplier[formData.trafficImpact] || 1;
    const duration = parseInt(formData.projectDuration) || 1;
    
    const calculated = baseCost * urgency * impact * (duration > 30 ? 1.5 : 1);
    setEstimatedCost(calculated);
  }, [formData, applicationType]);

  const handleInputChange = (field, value) => {
    onFormChange({
      ...formData,
      [field]: value
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-JM', {
      style: 'currency',
      currency: 'JMD',
      minimumFractionDigits: 2
    }).format(amount).replace('JMD', 'J$');
  };

  const currentProjectTypes = projectTypes[applicationType?.id] || [];

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
          Project Details
        </h2>
        <p className="text-muted-foreground">
          Provide detailed information about your {applicationType?.name || 'project'}
        </p>
      </div>

      {/* Project Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-heading font-semibold text-foreground border-b border-border pb-2">
          Basic Project Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Project Title"
            type="text"
            placeholder="Enter a descriptive project title"
            value={formData.projectTitle || ''}
            onChange={(e) => handleInputChange('projectTitle', e.target.value)}
            error={errors.projectTitle}
            required
          />

          {currentProjectTypes.length > 0 && (
            <Select
              label="Project Type"
              placeholder="Select project type"
              options={currentProjectTypes}
              value={formData.projectType || ''}
              onChange={(value) => handleInputChange('projectType', value)}
              error={errors.projectType}
              required
            />
          )}

          <Input
            label="Project Description"
            type="text"
            placeholder="Detailed description of the work to be performed"
            value={formData.projectDescription || ''}
            onChange={(e) => handleInputChange('projectDescription', e.target.value)}
            error={errors.projectDescription}
            description="Minimum 50 characters"
            required
          />

          <Input
            label="Estimated Project Duration (days)"
            type="number"
            placeholder="Number of days"
            value={formData.projectDuration || ''}
            onChange={(e) => handleInputChange('projectDuration', e.target.value)}
            error={errors.projectDuration}
            min="1"
            max="365"
            required
          />
        </div>
      </div>

      {/* Location Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-heading font-semibold text-foreground border-b border-border pb-2">
          Project Location
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Street Address/Location"
            type="text"
            placeholder="Exact location where work will be performed"
            value={formData.projectLocation || ''}
            onChange={(e) => handleInputChange('projectLocation', e.target.value)}
            error={errors.projectLocation}
            required
          />

          <Input
            label="Nearest Landmark"
            type="text"
            placeholder="e.g., Near Half Way Tree Square"
            value={formData.nearestLandmark || ''}
            onChange={(e) => handleInputChange('nearestLandmark', e.target.value)}
            error={errors.nearestLandmark}
          />

          <Input
            label="GPS Coordinates (Optional)"
            type="text"
            placeholder="18.0179° N, 76.8099° W"
            value={formData.gpsCoordinates || ''}
            onChange={(e) => handleInputChange('gpsCoordinates', e.target.value)}
            error={errors.gpsCoordinates}
            description="Latitude, Longitude format"
          />

          <Select
            label="Parish"
            placeholder="Select parish"
            options={[
              { value: 'kingston', label: 'Kingston' },
              { value: 'st-andrew', label: 'St. Andrew' },
              { value: 'st-thomas', label: 'St. Thomas' },
              { value: 'portland', label: 'Portland' },
              { value: 'st-mary', label: 'St. Mary' },
              { value: 'st-ann', label: 'St. Ann' },
              { value: 'trelawny', label: 'Trelawny' },
              { value: 'st-james', label: 'St. James' },
              { value: 'hanover', label: 'Hanover' },
              { value: 'westmoreland', label: 'Westmoreland' },
              { value: 'st-elizabeth', label: 'St. Elizabeth' },
              { value: 'manchester', label: 'Manchester' },
              { value: 'clarendon', label: 'Clarendon' },
              { value: 'st-catherine', label: 'St. Catherine' }
            ]}
            value={formData.projectParish || ''}
            onChange={(value) => handleInputChange('projectParish', value)}
            error={errors.projectParish}
            required
          />
        </div>
      </div>

      {/* Schedule and Impact */}
      <div className="space-y-4">
        <h3 className="text-lg font-heading font-semibold text-foreground border-b border-border pb-2">
          Schedule and Impact Assessment
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Proposed Start Date"
            type="date"
            value={formData.startDate || ''}
            onChange={(e) => handleInputChange('startDate', e.target.value)}
            error={errors.startDate}
            min={new Date().toISOString().split('T')[0]}
            required
          />

          <Input
            label="Proposed End Date"
            type="date"
            value={formData.endDate || ''}
            onChange={(e) => handleInputChange('endDate', e.target.value)}
            error={errors.endDate}
            min={formData.startDate || new Date().toISOString().split('T')[0]}
            required
          />

          <Select
            label="Work Schedule"
            placeholder="Select work schedule"
            options={workSchedules}
            value={formData.workSchedule || ''}
            onChange={(value) => handleInputChange('workSchedule', value)}
            error={errors.workSchedule}
            required
          />

          <Select
            label="Traffic Impact Level"
            placeholder="Select expected traffic impact"
            options={trafficImpactLevels}
            value={formData.trafficImpact || ''}
            onChange={(value) => handleInputChange('trafficImpact', value)}
            error={errors.trafficImpact}
            required
          />
        </div>
      </div>

      {/* Processing Options */}
      <div className="space-y-4">
        <h3 className="text-lg font-heading font-semibold text-foreground border-b border-border pb-2">
          Processing Options
        </h3>
        
        <Select
          label="Processing Urgency"
          placeholder="Select processing speed"
          options={urgencyLevels}
          value={formData.urgencyLevel || 'standard'}
          onChange={(value) => handleInputChange('urgencyLevel', value)}
          error={errors.urgencyLevel}
          description="Expedited processing requires additional fees"
          required
        />
      </div>

      {/* Advanced Options */}
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
          className="flex items-center space-x-2 text-accent hover:text-accent/80 transition-colors duration-200"
        >
          <Icon name={showAdvancedOptions ? 'ChevronUp' : 'ChevronDown'} size={16} />
          <span className="text-sm font-medium">Advanced Options</span>
        </button>

        {showAdvancedOptions && (
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Contractor Name"
                type="text"
                placeholder="Name of contracting company"
                value={formData.contractorName || ''}
                onChange={(e) => handleInputChange('contractorName', e.target.value)}
                error={errors.contractorName}
              />

              <Input
                label="Contractor License Number"
                type="text"
                placeholder="Contractor license number"
                value={formData.contractorLicense || ''}
                onChange={(e) => handleInputChange('contractorLicense', e.target.value)}
                error={errors.contractorLicense}
              />

              <Input
                label="Insurance Policy Number"
                type="text"
                placeholder="Insurance policy number"
                value={formData.insurancePolicy || ''}
                onChange={(e) => handleInputChange('insurancePolicy', e.target.value)}
                error={errors.insurancePolicy}
              />

              <Input
                label="Project Budget (J$)"
                type="number"
                placeholder="Total project budget"
                value={formData.projectBudget || ''}
                onChange={(e) => handleInputChange('projectBudget', e.target.value)}
                error={errors.projectBudget}
                min="0"
              />
            </div>

            <div className="space-y-3">
              <Checkbox
                label="Environmental impact assessment required"
                checked={formData.environmentalAssessment || false}
                onChange={(e) => handleInputChange('environmentalAssessment', e.target.checked)}
              />

              <Checkbox
                label="Heritage site considerations"
                checked={formData.heritageSite || false}
                onChange={(e) => handleInputChange('heritageSite', e.target.checked)}
              />

              <Checkbox
                label="Utility coordination required"
                checked={formData.utilityCoordination || false}
                onChange={(e) => handleInputChange('utilityCoordination', e.target.checked)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Cost Estimation */}
      <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-heading font-semibold text-foreground">
              Estimated Application Fee
            </h4>
            <p className="text-sm text-muted-foreground">
              Based on project details and processing options
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-heading font-bold text-primary">
              {formatCurrency(estimatedCost)}
            </div>
            <p className="text-xs text-muted-foreground">
              Final fee calculated at submission
            </p>
          </div>
        </div>
      </div>

      {/* Additional Notes */}
      <div className="space-y-4">
        <h3 className="text-lg font-heading font-semibold text-foreground border-b border-border pb-2">
          Additional Information
        </h3>
        
        <Input
          label="Special Requirements or Notes"
          type="text"
          placeholder="Any special requirements, concerns, or additional information"
          value={formData.specialRequirements || ''}
          onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
          error={errors.specialRequirements}
          description="Optional - Provide any additional context that may help with processing"
        />
      </div>
    </div>
  );
};

export default ProjectDetailsForm;