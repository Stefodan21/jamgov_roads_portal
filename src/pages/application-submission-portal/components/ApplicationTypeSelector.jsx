import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';


const ApplicationTypeSelector = ({ selectedType, onTypeSelect, className = '' }) => {
  const [expandedCategory, setExpandedCategory] = useState(null);

  const applicationTypes = [
    {
      id: 'permits',
      title: 'Road & Construction Permits',
      icon: 'Construction',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      description: 'Permits for road work, construction, and infrastructure projects',
      applications: [
        {
          id: 'road-permit',
          name: 'Road Work Permit',
          description: 'For excavation, utility installation, or road repairs',
          fee: 'J$2,500.00',
          processingTime: '5-7 business days',
          requirements: ['Site plan', 'Traffic management plan', 'Insurance certificate']
        },
        {
          id: 'construction-permit',
          name: 'Construction Permit',
          description: 'For building construction affecting public roads',
          fee: 'J$5,000.00',
          processingTime: '10-14 business days',
          requirements: ['Building plans', 'Engineering report', 'Environmental clearance']
        },
        {
          id: 'utility-permit',
          name: 'Utility Installation Permit',
          description: 'For installing utilities under or across roads',
          fee: 'J$3,000.00',
          processingTime: '7-10 business days',
          requirements: ['Utility plans', 'Restoration bond', 'Technical specifications']
        }
      ]
    },
    {
      id: 'licenses',
      title: 'Transportation Licenses',
      icon: 'Truck',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      description: 'Licenses for commercial transportation and heavy vehicle operations',
      applications: [
        {
          id: 'heavy-vehicle',
          name: 'Heavy Vehicle License',
          description: 'For vehicles exceeding standard weight limits',
          fee: 'J$4,000.00',
          processingTime: '3-5 business days',
          requirements: ['Vehicle registration', 'Weight certificate', 'Route plan']
        },
        {
          id: 'commercial-transport',
          name: 'Commercial Transport License',
          description: 'For commercial passenger or freight services',
          fee: 'J$6,000.00',
          processingTime: '14-21 business days',
          requirements: ['Business registration', 'Insurance policy', 'Safety inspection']
        }
      ]
    },
    {
      id: 'infrastructure',
      title: 'Infrastructure Services',
      icon: 'MapPin',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      description: 'Services related to public infrastructure and maintenance',
      applications: [
        {
          id: 'maintenance-request',
          name: 'Road Maintenance Request',
          description: 'Report road damage or request maintenance',
          fee: 'Free',
          processingTime: '1-3 business days',
          requirements: ['Location details', 'Photo evidence', 'Contact information']
        },
        {
          id: 'signage-permit',
          name: 'Road Signage Permit',
          description: 'For installing or modifying road signs',
          fee: 'J$1,500.00',
          processingTime: '5-7 business days',
          requirements: ['Sign specifications', 'Location survey', 'Safety assessment']
        }
      ]
    }
  ];

  const handleCategoryToggle = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const handleApplicationSelect = (application, category) => {
    onTypeSelect({
      ...application,
      category: category.title,
      categoryId: category.id
    });
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
          Select Application Type
        </h2>
        <p className="text-muted-foreground">
          Choose the type of application you want to submit
        </p>
      </div>

      <div className="grid gap-4 md:gap-6">
        {applicationTypes.map((category) => (
          <div key={category.id} className="bg-card border border-border rounded-lg overflow-hidden">
            {/* Category Header */}
            <button
              onClick={() => handleCategoryToggle(category.id)}
              className="w-full p-6 text-left hover:bg-muted/50 transition-colors duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-lg ${category.bgColor} flex items-center justify-center`}>
                    <Icon name={category.icon} size={24} className={category.color} />
                  </div>
                  <div>
                    <h3 className="text-lg font-heading font-semibold text-foreground">
                      {category.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {category.description}
                    </p>
                  </div>
                </div>
                <Icon 
                  name={expandedCategory === category.id ? 'ChevronUp' : 'ChevronDown'} 
                  size={20} 
                  className="text-muted-foreground"
                />
              </div>
            </button>

            {/* Applications List */}
            {expandedCategory === category.id && (
              <div className="border-t border-border bg-muted/20">
                <div className="p-4 space-y-4">
                  {category.applications.map((application) => (
                    <div
                      key={application.id}
                      className={`
                        p-4 bg-card border rounded-lg cursor-pointer transition-all duration-200
                        hover:border-primary hover:shadow-elevation-1
                        ${selectedType?.id === application.id ? 'border-primary bg-primary/5' : 'border-border'}
                      `}
                      onClick={() => handleApplicationSelect(application, category)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-heading font-semibold text-foreground">
                              {application.name}
                            </h4>
                            {selectedType?.id === application.id && (
                              <Icon name="CheckCircle" size={16} className="text-success" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {application.description}
                          </p>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center space-x-2">
                              <Icon name="DollarSign" size={14} className="text-muted-foreground" />
                              <span className="text-foreground font-medium">
                                {application.fee}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Icon name="Clock" size={14} className="text-muted-foreground" />
                              <span className="text-foreground">
                                {application.processingTime}
                              </span>
                            </div>
                          </div>

                          <div className="mt-3">
                            <p className="text-xs text-muted-foreground mb-2">Required documents:</p>
                            <div className="flex flex-wrap gap-1">
                              {application.requirements.map((req, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-muted text-xs text-muted-foreground rounded"
                                >
                                  {req}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedType && (
        <div className="mt-8 p-4 bg-success/10 border border-success/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="CheckCircle" size={20} className="text-success" />
            <div>
              <p className="font-medium text-success">
                {selectedType.name} selected
              </p>
              <p className="text-sm text-success/80">
                Click "Next" to continue with your application
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationTypeSelector;