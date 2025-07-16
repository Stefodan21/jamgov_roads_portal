import React, { useState, useEffect } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const PersonalInformationForm = ({ formData, onFormChange, errors = {}, className = '' }) => {
  const [isAutoFilled, setIsAutoFilled] = useState(false);

  // Mock user profile data for auto-population
  const mockUserProfile = {
    firstName: 'Marcus',
    lastName: 'Campbell',
    email: 'marcus.campbell@email.com',
    phone: '+1-876-555-0123',
    address: '15 Hope Road',
    city: 'Kingston',
    parish: 'kingston',
    postalCode: 'JMAKN01'
  };

  const parishes = [
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
  ];

  const identificationTypes = [
    { value: 'national-id', label: 'National ID' },
    { value: 'passport', label: 'Passport' },
    { value: 'drivers-license', label: 'Driver\'s License' },
    { value: 'voter-id', label: 'Voter ID' }
  ];

  useEffect(() => {
    // Auto-populate from user profile if form is empty
    if (!formData.firstName && !isAutoFilled) {
      onFormChange({
        ...formData,
        ...mockUserProfile
      });
      setIsAutoFilled(true);
    }
  }, [formData, onFormChange, isAutoFilled]);

  const handleInputChange = (field, value) => {
    onFormChange({
      ...formData,
      [field]: value
    });
  };

  const handleAutoFill = () => {
    onFormChange({
      ...formData,
      ...mockUserProfile
    });
    setIsAutoFilled(true);
  };

  const validateTRN = (trn) => {
    // Basic TRN validation for Jamaica (9 digits)
    const trnRegex = /^\d{9}$/;
    return trnRegex.test(trn.replace(/\D/g, ''));
  };

  const validatePhone = (phone) => {
    // Jamaica phone number validation
    const phoneRegex = /^(\+1-876|876)[-\s]?\d{3}[-\s]?\d{4}$/;
    return phoneRegex.test(phone);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
            Personal Information
          </h2>
          <p className="text-muted-foreground">
            Please provide your personal details for the application
          </p>
        </div>
        
        {!isAutoFilled && (
          <button
            onClick={handleAutoFill}
            className="flex items-center space-x-2 px-4 py-2 bg-accent/10 text-accent rounded-lg hover:bg-accent/20 transition-colors duration-200"
          >
            <Icon name="User" size={16} />
            <span className="text-sm font-medium">Auto-fill from profile</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-heading font-semibold text-foreground border-b border-border pb-2">
            Basic Information
          </h3>
          
          <Input
            label="First Name"
            type="text"
            placeholder="Enter your first name"
            value={formData.firstName || ''}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            error={errors.firstName}
            required
          />

          <Input
            label="Last Name"
            type="text"
            placeholder="Enter your last name"
            value={formData.lastName || ''}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            error={errors.lastName}
            required
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="your.email@example.com"
            value={formData.email || ''}
            onChange={(e) => handleInputChange('email', e.target.value)}
            error={errors.email}
            description="We'll send application updates to this email"
            required
          />

          <Input
            label="Phone Number"
            type="tel"
            placeholder="+1-876-555-0123"
            value={formData.phone || ''}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            error={errors.phone || (!validatePhone(formData.phone || '') && formData.phone ? 'Please enter a valid Jamaica phone number' : '')}
            description="Include country code (+1-876)"
            required
          />
        </div>

        {/* Address Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-heading font-semibold text-foreground border-b border-border pb-2">
            Address Information
          </h3>
          
          <Input
            label="Street Address"
            type="text"
            placeholder="Enter your street address"
            value={formData.address || ''}
            onChange={(e) => handleInputChange('address', e.target.value)}
            error={errors.address}
            required
          />

          <Input
            label="City/Town"
            type="text"
            placeholder="Enter your city or town"
            value={formData.city || ''}
            onChange={(e) => handleInputChange('city', e.target.value)}
            error={errors.city}
            required
          />

          <Select
            label="Parish"
            placeholder="Select your parish"
            options={parishes}
            value={formData.parish || ''}
            onChange={(value) => handleInputChange('parish', value)}
            error={errors.parish}
            required
          />

          <Input
            label="Postal Code"
            type="text"
            placeholder="Enter postal code"
            value={formData.postalCode || ''}
            onChange={(e) => handleInputChange('postalCode', e.target.value)}
            error={errors.postalCode}
          />
        </div>
      </div>

      {/* Identification Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-heading font-semibold text-foreground border-b border-border pb-2">
          Identification Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Identification Type"
            placeholder="Select ID type"
            options={identificationTypes}
            value={formData.identificationType || ''}
            onChange={(value) => handleInputChange('identificationType', value)}
            error={errors.identificationType}
            required
          />

          <Input
            label="Identification Number"
            type="text"
            placeholder="Enter ID number"
            value={formData.identificationNumber || ''}
            onChange={(e) => handleInputChange('identificationNumber', e.target.value)}
            error={errors.identificationNumber}
            required
          />

          <Input
            label="Tax Registration Number (TRN)"
            type="text"
            placeholder="123-456-789"
            value={formData.trn || ''}
            onChange={(e) => handleInputChange('trn', e.target.value)}
            error={errors.trn || (!validateTRN(formData.trn || '') && formData.trn ? 'Please enter a valid 9-digit TRN' : '')}
            description="9-digit Tax Registration Number"
            required
          />

          <Input
            label="Date of Birth"
            type="date"
            value={formData.dateOfBirth || ''}
            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
            error={errors.dateOfBirth}
            required
          />
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="space-y-4">
        <h3 className="text-lg font-heading font-semibold text-foreground border-b border-border pb-2">
          Emergency Contact (Optional)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Contact Name"
            type="text"
            placeholder="Emergency contact name"
            value={formData.emergencyContactName || ''}
            onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
            error={errors.emergencyContactName}
          />

          <Input
            label="Contact Phone"
            type="tel"
            placeholder="+1-876-555-0123"
            value={formData.emergencyContactPhone || ''}
            onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
            error={errors.emergencyContactPhone}
          />

          <Input
            label="Relationship"
            type="text"
            placeholder="e.g., Spouse, Parent, Sibling"
            value={formData.emergencyContactRelationship || ''}
            onChange={(e) => handleInputChange('emergencyContactRelationship', e.target.value)}
            error={errors.emergencyContactRelationship}
          />
        </div>
      </div>

      {/* Data Protection Notice */}
      <div className="p-4 bg-muted/50 border border-border rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="Shield" size={20} className="text-primary mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-foreground mb-1">
              Data Protection Notice
            </p>
            <p className="text-muted-foreground">
              Your personal information is protected under Jamaica's Data Protection Act. 
              We collect this information solely for processing your application and will not 
              share it with third parties without your consent.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInformationForm;