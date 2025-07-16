import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const FormCompletionInterface = ({ applicationId, onFormSubmit }) => {
  const [activeSection, setActiveSection] = useState('checklist');
  const [formData, setFormData] = useState({
    checklist: {},
    measurements: {},
    observations: '',
    recommendations: '',
    signature: null,
    inspectorNotes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inspectionChecklist = [
    {
      category: 'Safety Compliance',
      items: [
        { id: 'safety_barriers', label: 'Safety barriers properly installed', required: true },
        { id: 'warning_signs', label: 'Warning signs visible and compliant', required: true },
        { id: 'traffic_control', label: 'Traffic control measures in place', required: true },
        { id: 'worker_safety', label: 'Worker safety equipment verified', required: true }
      ]
    },
    {
      category: 'Technical Standards',
      items: [
        { id: 'material_quality', label: 'Materials meet specified standards', required: true },
        { id: 'construction_method', label: 'Construction method approved', required: true },
        { id: 'dimensions_correct', label: 'Dimensions within tolerance', required: true },
        { id: 'drainage_adequate', label: 'Drainage systems adequate', required: false }
      ]
    },
    {
      category: 'Environmental Compliance',
      items: [
        { id: 'environmental_impact', label: 'Environmental impact minimized', required: true },
        { id: 'waste_management', label: 'Waste management plan followed', required: true },
        { id: 'noise_levels', label: 'Noise levels within limits', required: false },
        { id: 'dust_control', label: 'Dust control measures active', required: false }
      ]
    }
  ];

  const measurementFields = [
    { id: 'length', label: 'Length (meters)', type: 'number', unit: 'm' },
    { id: 'width', label: 'Width (meters)', type: 'number', unit: 'm' },
    { id: 'depth', label: 'Depth (meters)', type: 'number', unit: 'm' },
    { id: 'area', label: 'Area (square meters)', type: 'number', unit: 'm²' },
    { id: 'volume', label: 'Volume (cubic meters)', type: 'number', unit: 'm³' }
  ];

  const handleChecklistChange = (itemId, checked) => {
    setFormData(prev => ({
      ...prev,
      checklist: {
        ...prev.checklist,
        [itemId]: checked
      }
    }));
  };

  const handleMeasurementChange = (fieldId, value) => {
    setFormData(prev => ({
      ...prev,
      measurements: {
        ...prev.measurements,
        [fieldId]: value
      }
    }));
  };

  const handleTextChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSignatureCapture = () => {
    // Simulate signature capture
    const mockSignature = {
      data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      timestamp: new Date(),
      inspector: 'Field Agent #001'
    };
    
    setFormData(prev => ({
      ...prev,
      signature: mockSignature
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      onFormSubmit && onFormSubmit({
        applicationId,
        formData,
        submittedAt: new Date(),
        status: 'completed'
      });
      setIsSubmitting(false);
    }, 2000);
  };

  const getCompletionPercentage = () => {
    const totalItems = inspectionChecklist.reduce((acc, cat) => acc + cat.items.length, 0);
    const completedItems = Object.keys(formData.checklist).length;
    const hasSignature = formData.signature ? 1 : 0;
    const hasObservations = formData.observations.trim() ? 1 : 0;
    
    return Math.round(((completedItems + hasSignature + hasObservations) / (totalItems + 2)) * 100);
  };

  const sections = [
    { id: 'checklist', label: 'Checklist', icon: 'CheckSquare' },
    { id: 'measurements', label: 'Measurements', icon: 'Ruler' },
    { id: 'observations', label: 'Observations', icon: 'FileText' },
    { id: 'signature', label: 'Signature', icon: 'PenTool' }
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground">
            Inspection Form
          </h3>
          <p className="text-sm text-muted-foreground">
            Application: {applicationId}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="text-sm text-muted-foreground">
            {getCompletionPercentage()}% Complete
          </div>
          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${getCompletionPercentage()}%` }}
            />
          </div>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex overflow-x-auto border-b border-border">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`
              flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
              ${activeSection === section.id
                ? 'border-primary text-primary bg-primary/5' :'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }
            `}
          >
            <Icon name={section.icon} size={16} />
            <span>{section.label}</span>
          </button>
        ))}
      </div>

      {/* Section Content */}
      <div className="min-h-96">
        {activeSection === 'checklist' && (
          <div className="space-y-6">
            {inspectionChecklist.map((category) => (
              <div key={category.category} className="space-y-3">
                <h4 className="text-base font-medium text-foreground border-b border-border pb-2">
                  {category.category}
                </h4>
                
                <div className="space-y-3">
                  {category.items.map((item) => (
                    <div key={item.id} className="flex items-start space-x-3 p-3 bg-muted rounded-lg">
                      <Checkbox
                        checked={formData.checklist[item.id] || false}
                        onChange={(e) => handleChecklistChange(item.id, e.target.checked)}
                        className="mt-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-foreground">
                            {item.label}
                          </span>
                          {item.required && (
                            <span className="text-xs text-error">Required</span>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Camera"
                        iconSize={14}
                        title="Add photo evidence"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeSection === 'measurements' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {measurementFields.map((field) => (
                <div key={field.id}>
                  <Input
                    label={field.label}
                    type={field.type}
                    value={formData.measurements[field.id] || ''}
                    onChange={(e) => handleMeasurementChange(field.id, e.target.value)}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    description={`Unit: ${field.unit}`}
                  />
                </div>
              ))}
            </div>
            
            <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
              <div className="flex items-start space-x-2">
                <Icon name="Info" size={16} className="text-accent mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-accent mb-1">Measurement Guidelines</p>
                  <p className="text-muted-foreground">
                    All measurements should be taken using calibrated equipment. Record measurements to the nearest centimeter for accuracy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'observations' && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                General Observations
              </label>
              <textarea
                value={formData.observations}
                onChange={(e) => handleTextChange('observations', e.target.value)}
                className="w-full h-32 px-3 py-2 bg-input border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                placeholder="Record your observations about the site, work quality, compliance issues, or any other relevant details..."
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Recommendations
              </label>
              <textarea
                value={formData.recommendations}
                onChange={(e) => handleTextChange('recommendations', e.target.value)}
                className="w-full h-32 px-3 py-2 bg-input border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                placeholder="Provide recommendations for improvements, next steps, or actions required..."
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Inspector Notes (Internal)
              </label>
              <textarea
                value={formData.inspectorNotes}
                onChange={(e) => handleTextChange('inspectorNotes', e.target.value)}
                className="w-full h-24 px-3 py-2 bg-input border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                placeholder="Internal notes for office staff..."
              />
            </div>
          </div>
        )}

        {activeSection === 'signature' && (
          <div className="space-y-4">
            <div className="text-center">
              <h4 className="text-base font-medium text-foreground mb-2">
                Digital Signature
              </h4>
              <p className="text-sm text-muted-foreground mb-6">
                Your signature confirms the accuracy of this inspection report
              </p>
              
              {formData.signature ? (
                <div className="space-y-4">
                  <div className="w-full h-32 bg-muted border-2 border-dashed border-border rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Icon name="CheckCircle" size={32} className="text-success mx-auto mb-2" />
                      <p className="text-sm text-success font-medium">Signature Captured</p>
                      <p className="text-xs text-muted-foreground">
                        {formData.signature.timestamp.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    onClick={handleSignatureCapture}
                    iconName="RefreshCw"
                    iconPosition="left"
                    iconSize={16}
                  >
                    Re-capture Signature
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-full h-32 bg-muted border-2 border-dashed border-border rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Icon name="PenTool" size={32} className="text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No signature captured</p>
                    </div>
                  </div>
                  
                  <Button
                    variant="default"
                    onClick={handleSignatureCapture}
                    iconName="PenTool"
                    iconPosition="left"
                    iconSize={16}
                  >
                    Capture Signature
                  </Button>
                </div>
              )}
            </div>

            <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
              <div className="flex items-start space-x-2">
                <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-warning mb-1">Legal Notice</p>
                  <p className="text-muted-foreground">
                    By signing this form, you certify that the inspection was conducted in accordance with Jamaica's building codes and safety regulations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Submit Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
        <Button
          variant="outline"
          iconName="Save"
          iconPosition="left"
          iconSize={16}
          className="flex-1"
          disabled={isSubmitting}
        >
          Save Draft
        </Button>
        
        <Button
          variant="default"
          iconName="Send"
          iconPosition="left"
          iconSize={16}
          onClick={handleSubmit}
          loading={isSubmitting}
          disabled={getCompletionPercentage() < 80}
          className="flex-1"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Report'}
        </Button>
      </div>

      {getCompletionPercentage() < 80 && (
        <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="AlertCircle" size={16} className="text-warning" />
            <p className="text-sm text-warning">
              Complete at least 80% of the form to submit the report.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormCompletionInterface;