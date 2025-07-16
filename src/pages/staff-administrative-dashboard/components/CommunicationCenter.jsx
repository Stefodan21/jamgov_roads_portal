import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

const CommunicationCenter = () => {
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [inquiries, setInquiries] = useState([]);
  const [responseTemplates, setResponseTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const mockInquiries = [
    {
      id: 'INQ-2025-001',
      citizenName: 'Marcus Campbell',
      citizenEmail: 'marcus.campbell@email.com',
      applicationId: 'APP-2025-001',
      subject: 'Status Update Request',
      message: 'Good morning, I submitted my road construction permit application last week and would like to know the current status. The application ID is APP-2025-001. Thank you.',
      status: 'new',
      priority: 'medium',
      category: 'status-inquiry',
      submittedDate: new Date('2025-01-16T09:30:00'),
      assignedTo: null,
      responseTime: null
    },
    {
      id: 'INQ-2025-002',
      citizenName: 'Jennifer Brown',
      citizenEmail: 'jennifer.brown@email.com',
      applicationId: 'APP-2025-002',
      subject: 'Document Clarification',
      message: 'Hello, I received a notification that additional documents are required for my infrastructure license application. Could you please specify which documents are needed? I want to ensure I submit everything correctly.',
      status: 'in-progress',
      priority: 'high',
      category: 'document-request',
      submittedDate: new Date('2025-01-16T08:15:00'),
      assignedTo: 'Sarah Johnson',
      responseTime: '2 hours'
    },
    {
      id: 'INQ-2025-003',
      citizenName: 'David Wilson',
      citizenEmail: 'david.wilson@email.com',
      applicationId: 'APP-2025-003',
      subject: 'Application Fee Payment',
      message: 'Hi, I completed my utility connection application but I\'m having trouble with the payment process. The payment page keeps showing an error. Can someone assist me with this?',
      status: 'responded',
      priority: 'high',
      category: 'payment-issue',
      submittedDate: new Date('2025-01-15T16:45:00'),
      assignedTo: 'Michael Davis',
      responseTime: '1 hour'
    },
    {
      id: 'INQ-2025-004',
      citizenName: 'Patricia Miller',
      citizenEmail: 'patricia.miller@email.com',
      applicationId: null,
      subject: 'General Information Request',
      message: 'Good afternoon, I would like to know what documents are required for a road maintenance request application. Also, what is the typical processing time? Thank you for your assistance.',
      status: 'new',
      priority: 'low',
      category: 'general-info',
      submittedDate: new Date('2025-01-15T14:20:00'),
      assignedTo: null,
      responseTime: null
    }
  ];

  const mockTemplates = [
    {
      id: 'TEMP-001',
      name: 'Status Update Response',
      category: 'status-inquiry',
      subject: 'Re: Status Update Request - Application {applicationId}',
      content: `Dear {citizenName},

Thank you for your inquiry regarding application {applicationId}.

Your application is currently being processed and is at the following stage: {currentStage}

Estimated completion time: {estimatedCompletion}

You will receive an email notification once your application status changes.

If you have any further questions, please don't hesitate to contact us.

Best regards,
JamGov Roads Portal Support Team`
    },
    {
      id: 'TEMP-002',name: 'Document Request Response',category: 'document-request',subject: 'Re: Additional Documents Required - Application {applicationId}',
      content: `Dear {citizenName},

Thank you for your prompt response regarding your application {applicationId}.

The following documents are required to complete your application:

{documentList}

Please upload these documents through your citizen portal at your earliest convenience.

Once all documents are received, processing will continue within 2-3 business days.

Best regards,
JamGov Roads Portal Support Team`
    },
    {
      id: 'TEMP-003',name: 'Payment Issue Resolution',category: 'payment-issue',subject: 'Re: Payment Processing Assistance - Application {applicationId}',
      content: `Dear {citizenName},

We apologize for the inconvenience with the payment process for application {applicationId}.

Our technical team has resolved the payment gateway issue. Please try the following steps:

1. Clear your browser cache and cookies
2. Try using a different browser or device
3. Ensure your payment method has sufficient funds

If you continue to experience issues, please contact our support team at (876) 123-4567.

Best regards,
JamGov Roads Portal Support Team`
    }
  ];

  useEffect(() => {
    setInquiries(mockInquiries);
    setResponseTemplates(mockTemplates);
  }, []);

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesStatus = filterStatus === 'all' || inquiry.status === filterStatus;
    const matchesSearch = searchQuery === '' || 
      inquiry.citizenName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const handleInquirySelect = (inquiry) => {
    setSelectedInquiry(inquiry);
    setResponseMessage('');
    setSelectedTemplate('');
  };

  const handleTemplateSelect = (templateId) => {
    setSelectedTemplate(templateId);
    const template = responseTemplates.find(t => t.id === templateId);
    if (template && selectedInquiry) {
      let content = template.content
        .replace(/{citizenName}/g, selectedInquiry.citizenName)
        .replace(/{applicationId}/g, selectedInquiry.applicationId || 'N/A')
        .replace(/{currentStage}/g, 'Document Review')
        .replace(/{estimatedCompletion}/g, '3-5 business days')
        .replace(/{documentList}/g, '• Valid ID\n• Proof of Address\n• Technical Drawings');
      
      setResponseMessage(content);
    }
  };

  const handleSendResponse = () => {
    if (!selectedInquiry || !responseMessage.trim()) return;
    
    // Update inquiry status
    setInquiries(prev => 
      prev.map(inquiry => 
        inquiry.id === selectedInquiry.id 
          ? { ...inquiry, status: 'responded', assignedTo: 'Current User' }
          : inquiry
      )
    );
    
    setResponseMessage('');
    setSelectedTemplate('');
    console.log('Response sent to:', selectedInquiry.citizenEmail);
  };

  const handleAssignInquiry = (inquiryId, staffMember) => {
    setInquiries(prev => 
      prev.map(inquiry => 
        inquiry.id === inquiryId 
          ? { ...inquiry, assignedTo: staffMember, status: 'in-progress' }
          : inquiry
      )
    );
  };

  const handleEscalateInquiry = (inquiryId) => {
    setInquiries(prev => 
      prev.map(inquiry => 
        inquiry.id === inquiryId 
          ? { ...inquiry, priority: 'high', status: 'escalated' }
          : inquiry
      )
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'text-accent bg-accent/10';
      case 'in-progress': return 'text-warning bg-warning/10';
      case 'responded': return 'text-success bg-success/10';
      case 'escalated': return 'text-error bg-error/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-error';
      case 'medium': return 'text-warning';
      case 'low': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const formatTime = (date) => {
    return date.toLocaleString('en-JM', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const statusOptions = [
    { value: 'all', label: 'All Inquiries' },
    { value: 'new', label: 'New' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'responded', label: 'Responded' },
    { value: 'escalated', label: 'Escalated' }
  ];

  const templateOptions = [
    { value: '', label: 'Select Template' },
    ...responseTemplates.map(template => ({
      value: template.id,
      label: template.name
    }))
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="MessageSquare" size={20} className="text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-heading font-semibold text-foreground">
              Communication Center
            </h2>
            <p className="text-sm text-muted-foreground">
              Manage citizen inquiries and responses
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="RefreshCw"
            iconSize={14}
          >
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="Settings"
            iconSize={14}
          >
            Templates
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inquiries List */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-heading font-semibold text-foreground">
              Citizen Inquiries
            </h3>
            <span className="text-sm text-muted-foreground">
              {filteredInquiries.length} inquiries
            </span>
          </div>

          <div className="space-y-4 mb-4">
            <Input
              type="search"
              placeholder="Search inquiries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            
            <Select
              options={statusOptions}
              value={filterStatus}
              onChange={setFilterStatus}
            />
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredInquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                onClick={() => handleInquirySelect(inquiry)}
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-elevation-1 ${
                  selectedInquiry?.id === inquiry.id 
                    ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground truncate">{inquiry.subject}</h4>
                    <p className="text-sm text-muted-foreground">{inquiry.citizenName}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon 
                      name="Flag" 
                      size={12} 
                      className={getPriorityColor(inquiry.priority)} 
                    />
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(inquiry.status)}`}>
                      {inquiry.status.replace('-', ' ')}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{formatTime(inquiry.submittedDate)}</span>
                  {inquiry.applicationId && (
                    <span className="font-mono">{inquiry.applicationId}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inquiry Details */}
        <div className="bg-card border border-border rounded-lg p-6">
          {selectedInquiry ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-heading font-semibold text-foreground">
                  Inquiry Details
                </h3>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="UserPlus"
                    iconSize={14}
                    onClick={() => handleAssignInquiry(selectedInquiry.id, 'Current User')}
                    title="Assign to me"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="AlertTriangle"
                    iconSize={14}
                    onClick={() => handleEscalateInquiry(selectedInquiry.id)}
                    title="Escalate"
                  />
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Inquiry ID:</span>
                    <div className="font-mono text-foreground">{selectedInquiry.id}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <div className={`font-medium ${getStatusColor(selectedInquiry.status).split(' ')[0]}`}>
                      {selectedInquiry.status.replace('-', ' ')}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Priority:</span>
                    <div className={`font-medium ${getPriorityColor(selectedInquiry.priority)}`}>
                      {selectedInquiry.priority.charAt(0).toUpperCase() + selectedInquiry.priority.slice(1)}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Category:</span>
                    <div className="text-foreground">{selectedInquiry.category.replace('-', ' ')}</div>
                  </div>
                </div>

                <div>
                  <span className="text-sm text-muted-foreground">Citizen Information:</span>
                  <div className="mt-1">
                    <div className="font-medium text-foreground">{selectedInquiry.citizenName}</div>
                    <div className="text-sm text-muted-foreground">{selectedInquiry.citizenEmail}</div>
                  </div>
                </div>

                {selectedInquiry.applicationId && (
                  <div>
                    <span className="text-sm text-muted-foreground">Related Application:</span>
                    <div className="font-mono text-primary">{selectedInquiry.applicationId}</div>
                  </div>
                )}

                <div>
                  <span className="text-sm text-muted-foreground">Message:</span>
                  <div className="mt-2 p-3 bg-muted/30 rounded-lg text-sm text-foreground">
                    {selectedInquiry.message}
                  </div>
                </div>

                <div className="text-xs text-muted-foreground">
                  Submitted: {formatTime(selectedInquiry.submittedDate)}
                  {selectedInquiry.assignedTo && (
                    <span className="ml-4">Assigned to: {selectedInquiry.assignedTo}</span>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <Icon name="MessageSquare" size={48} className="text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Select an inquiry to view details
              </p>
            </div>
          )}
        </div>

        {/* Response Interface */}
        <div className="bg-card border border-border rounded-lg p-6">
          {selectedInquiry ? (
            <>
              <h3 className="text-lg font-heading font-semibold text-foreground mb-6">
                Response
              </h3>

              <div className="space-y-4">
                <Select
                  label="Response Template"
                  options={templateOptions}
                  value={selectedTemplate}
                  onChange={handleTemplateSelect}
                />

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Response Message
                  </label>
                  <textarea
                    value={responseMessage}
                    onChange={(e) => setResponseMessage(e.target.value)}
                    placeholder="Type your response here..."
                    className="w-full px-3 py-2 border border-border rounded-md text-foreground bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                    rows={12}
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <Button
                    variant="default"
                    fullWidth
                    iconName="Send"
                    iconPosition="left"
                    iconSize={16}
                    onClick={handleSendResponse}
                    disabled={!responseMessage.trim()}
                  >
                    Send Response
                  </Button>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Save"
                    iconSize={14}
                  >
                    Save Draft
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Eye"
                    iconSize={14}
                  >
                    Preview
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Paperclip"
                    iconSize={14}
                  >
                    Attach
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <Icon name="Send" size={48} className="text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Select an inquiry to compose a response
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunicationCenter;