import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CommunicationFeatures = ({ applicationId, applicantInfo }) => {
  const [activeTab, setActiveTab] = useState('contacts');
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);

  const contacts = [
    {
      id: 1,
      name: 'Marcus Thompson',
      role: 'Applicant',
      phone: '+1-876-555-0123',
      email: 'marcus.thompson@email.com',
      status: 'available',
      lastContact: new Date(Date.now() - 1800000)
    },
    {
      id: 2,
      name: 'Sarah Williams',
      role: 'Site Supervisor',
      phone: '+1-876-555-0456',
      email: 'sarah.williams@contractor.com',
      status: 'available',
      lastContact: new Date(Date.now() - 3600000)
    },
    {
      id: 3,
      name: 'Admin Office',
      role: 'JamGov Roads Office',
      phone: '+1-876-555-0789',
      email: 'admin@jamgovroads.gov.jm',
      status: 'available',
      lastContact: new Date(Date.now() - 7200000)
    },
    {
      id: 4,
      name: 'Emergency Services',
      role: 'Emergency Contact',
      phone: '+1-876-555-0911',
      email: 'emergency@jamgovroads.gov.jm',
      status: 'available',
      lastContact: null
    }
  ];

  const messageHistory = [
    {
      id: 1,
      sender: 'Field Agent #001',
      recipient: 'Marcus Thompson',
      message: 'Arriving at site in 10 minutes for scheduled inspection.',
      timestamp: new Date(Date.now() - 1800000),
      type: 'outgoing',
      status: 'delivered'
    },
    {
      id: 2,
      sender: 'Marcus Thompson',
      recipient: 'Field Agent #001',
      message: 'Thank you. I will be available on site to assist with the inspection.',
      timestamp: new Date(Date.now() - 1500000),
      type: 'incoming',
      status: 'read'
    },
    {
      id: 3,
      sender: 'Field Agent #001',
      recipient: 'Admin Office',
      message: 'Inspection completed. Minor compliance issues identified. Report will be submitted within 1 hour.',
      timestamp: new Date(Date.now() - 900000),
      type: 'outgoing',
      status: 'delivered'
    }
  ];

  const quickMessages = [
    "Arriving at site in 10 minutes",
    "Inspection completed successfully",
    "Minor issues identified, details to follow",
    "Additional documentation required",
    "Please contact me at your earliest convenience",
    "Site access required for inspection",
    "Weather conditions affecting inspection schedule",
    "Inspection rescheduled to next available slot"
  ];

  const handleCall = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  const handleEmail = (email) => {
    window.location.href = `mailto:${email}?subject=Inspection Update - ${applicationId}`;
  };

  const handleSendMessage = async (recipient, message) => {
    if (!message.trim()) return;

    setIsSending(true);
    
    // Simulate sending message
    setTimeout(() => {
      const newMessage = {
        id: messageHistory.length + 1,
        sender: 'Field Agent #001',
        recipient: recipient.name,
        message: message.trim(),
        timestamp: new Date(),
        type: 'outgoing',
        status: 'sending'
      };
      
      setMessageText('');
      setIsSending(false);
      
      // Simulate delivery status update
      setTimeout(() => {
        newMessage.status = 'delivered';
      }, 2000);
    }, 1000);
  };

  const handleQuickMessage = (message) => {
    setMessageText(message);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'text-success';
      case 'busy': return 'text-warning';
      case 'unavailable': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getMessageStatusIcon = (status) => {
    switch (status) {
      case 'sending': return 'Clock';
      case 'delivered': return 'Check';
      case 'read': return 'CheckCheck';
      case 'failed': return 'X';
      default: return 'Send';
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Never';
    
    const now = new Date();
    const diff = now - timestamp;
    
    if (diff < 3600000) { // Less than 1 hour
      return `${Math.floor(diff / 60000)} min ago`;
    } else if (diff < 86400000) { // Less than 24 hours
      return `${Math.floor(diff / 3600000)} hr ago`;
    } else {
      return timestamp.toLocaleDateString();
    }
  };

  const tabs = [
    { id: 'contacts', label: 'Contacts', icon: 'Users' },
    { id: 'messages', label: 'Messages', icon: 'MessageSquare' },
    { id: 'quick', label: 'Quick Actions', icon: 'Zap' }
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground">
            Communication
          </h3>
          <p className="text-sm text-muted-foreground">
            Application: {applicationId}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-success rounded-full" />
          <span className="text-sm text-success">Online</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors
              ${activeTab === tab.id
                ? 'border-primary text-primary bg-primary/5' :'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }
            `}
          >
            <Icon name={tab.icon} size={16} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-80">
        {activeTab === 'contacts' && (
          <div className="space-y-3">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className="p-4 bg-card border border-border rounded-lg"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-sm font-medium text-foreground">
                        {contact.name}
                      </h4>
                      <div className={`w-2 h-2 rounded-full ${
                        contact.status === 'available' ? 'bg-success' : 
                        contact.status === 'busy' ? 'bg-warning' : 'bg-error'
                      }`} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {contact.role}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Last contact: {formatTimestamp(contact.lastContact)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 mb-3">
                  <Icon name="Phone" size={14} className="text-muted-foreground" />
                  <span className="text-sm text-foreground font-mono">
                    {contact.phone}
                  </span>
                </div>

                <div className="flex items-center space-x-2 mb-4">
                  <Icon name="Mail" size={14} className="text-muted-foreground" />
                  <span className="text-sm text-foreground truncate">
                    {contact.email}
                  </span>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Phone"
                    iconPosition="left"
                    iconSize={14}
                    onClick={() => handleCall(contact.phone)}
                    className="flex-1"
                  >
                    Call
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Mail"
                    iconPosition="left"
                    iconSize={14}
                    onClick={() => handleEmail(contact.email)}
                    className="flex-1"
                  >
                    Email
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="MessageSquare"
                    iconSize={16}
                    onClick={() => setActiveTab('messages')}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="space-y-4">
            {/* Message History */}
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {messageHistory.map((message) => (
                <div
                  key={message.id}
                  className={`
                    flex ${message.type === 'outgoing' ? 'justify-end' : 'justify-start'}
                  `}
                >
                  <div className={`
                    max-w-xs p-3 rounded-lg
                    ${message.type === 'outgoing' ?'bg-primary text-primary-foreground' :'bg-muted text-foreground'
                    }
                  `}>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs opacity-80">
                        {message.type === 'outgoing' ? 'To' : 'From'}: {
                          message.type === 'outgoing' ? message.recipient : message.sender
                        }
                      </span>
                    </div>
                    <p className="text-sm">{message.message}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs opacity-70">
                        {formatTimestamp(message.timestamp)}
                      </span>
                      {message.type === 'outgoing' && (
                        <Icon 
                          name={getMessageStatusIcon(message.status)} 
                          size={12} 
                          className="opacity-70" 
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Messages */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Quick Messages
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {quickMessages.slice(0, 4).map((message, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickMessage(message)}
                    className="px-3 py-1 bg-muted text-sm text-muted-foreground rounded-full hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                  >
                    {message}
                  </button>
                ))}
              </div>
            </div>

            {/* Message Input */}
            <div className="space-y-3">
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="w-full h-20 px-3 py-2 bg-input border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                placeholder="Type your message..."
              />
              
              <div className="flex items-center space-x-2">
                <select className="flex-1 px-3 py-2 bg-input border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="">Select recipient...</option>
                  {contacts.map((contact) => (
                    <option key={contact.id} value={contact.id}>
                      {contact.name} ({contact.role})
                    </option>
                  ))}
                </select>
                
                <Button
                  variant="default"
                  iconName="Send"
                  iconSize={16}
                  onClick={() => handleSendMessage(contacts[0], messageText)}
                  loading={isSending}
                  disabled={!messageText.trim()}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'quick' && (
          <div className="space-y-4">
            {/* Emergency Actions */}
            <div className="p-4 bg-error/10 border border-error/20 rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <Icon name="AlertTriangle" size={16} className="text-error" />
                <h4 className="text-sm font-medium text-error">
                  Emergency Actions
                </h4>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Phone"
                  iconPosition="left"
                  iconSize={14}
                  onClick={() => handleCall('+1-876-555-0911')}
                  className="text-error border-error hover:bg-error hover:text-error-foreground"
                >
                  Emergency Call
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="AlertTriangle"
                  iconPosition="left"
                  iconSize={14}
                  className="text-error border-error hover:bg-error hover:text-error-foreground"
                >
                  Report Incident
                </Button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                variant="outline"
                iconName="Phone"
                iconPosition="left"
                iconSize={16}
                onClick={() => handleCall(applicantInfo?.phone || contacts[0].phone)}
                className="justify-start"
              >
                Call Applicant
              </Button>
              
              <Button
                variant="outline"
                iconName="Mail"
                iconPosition="left"
                iconSize={16}
                onClick={() => handleEmail(applicantInfo?.email || contacts[0].email)}
                className="justify-start"
              >
                Email Applicant
              </Button>
              
              <Button
                variant="outline"
                iconName="Phone"
                iconPosition="left"
                iconSize={16}
                onClick={() => handleCall(contacts[2].phone)}
                className="justify-start"
              >
                Call Office
              </Button>
              
              <Button
                variant="outline"
                iconName="MessageSquare"
                iconPosition="left"
                iconSize={16}
                onClick={() => {
                  setMessageText("Inspection update required for application " + applicationId);
                  setActiveTab('messages');
                }}
                className="justify-start"
              >
                Quick Update
              </Button>
            </div>

            {/* Status Broadcasting */}
            <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <Icon name="Radio" size={16} className="text-accent" />
                <h4 className="text-sm font-medium text-accent">
                  Broadcast Status
                </h4>
              </div>
              
              <p className="text-sm text-muted-foreground mb-3">
                Send status update to all relevant parties
              </p>
              
              <Button
                variant="outline"
                size="sm"
                iconName="Send"
                iconPosition="left"
                iconSize={14}
                className="text-accent border-accent hover:bg-accent hover:text-accent-foreground"
              >
                Broadcast Update
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunicationFeatures;