import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import ApplicationCard from './ApplicationCard';

const MyApplicationsSection = ({ className = '' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const applications = [
    {
      id: 'APP-2024-001',
      type: 'Road Work Permit',
      status: 'under-review',
      submissionDate: '2024-07-14',
      referenceNumber: 'RWP-240714-001',
      location: 'Spanish Town Road, Kingston',
      currentStage: 'Document Verification',
      assignedOfficer: 'Officer M. Campbell',
      estimatedCompletion: '3-5 business days',
      fee: 15000
    },
    {
      id: 'APP-2024-002',
      type: 'Construction License',
      status: 'pending-payment',
      submissionDate: '2024-07-12',
      referenceNumber: 'CL-240712-002',
      location: 'New Kingston, St. Andrew',
      currentStage: 'Payment Processing',
      assignedOfficer: 'Officer D. Brown',
      estimatedCompletion: 'Pending payment',
      fee: 45000
    },
    {
      id: 'APP-2024-003',
      type: 'Infrastructure Request',
      status: 'approved',
      submissionDate: '2024-07-10',
      referenceNumber: 'IR-240710-003',
      location: 'Half Way Tree, St. Andrew',
      currentStage: 'Completed',
      assignedOfficer: 'Officer S. Johnson',
      estimatedCompletion: 'Completed',
      fee: 8000
    },
    {
      id: 'APP-2024-004',
      type: 'Road Permit',
      status: 'rejected',
      submissionDate: '2024-07-08',
      referenceNumber: 'RP-240708-004',
      location: 'Mandeville, Manchester',
      currentStage: 'Rejected - Missing Documents',
      assignedOfficer: 'Officer K. Williams',
      estimatedCompletion: 'Resubmission required',
      fee: 12000
    },
    {
      id: 'APP-2024-005',
      type: 'Building Permit',
      status: 'submitted',
      submissionDate: '2024-07-16',
      referenceNumber: 'BP-240716-005',
      location: 'Portmore, St. Catherine',
      currentStage: 'Initial Review',
      assignedOfficer: 'Officer T. Davis',
      estimatedCompletion: '7-10 business days',
      fee: 25000
    }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Applications' },
    { value: 'submitted', label: 'Submitted' },
    { value: 'under-review', label: 'Under Review' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'pending-payment', label: 'Payment Required' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'status', label: 'By Status' },
    { value: 'type', label: 'By Type' }
  ];

  const filteredApplications = applications
    .filter(app => {
      const matchesSearch = app.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           app.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           app.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.submissionDate) - new Date(b.submissionDate);
        case 'status':
          return a.status.localeCompare(b.status);
        case 'type':
          return a.type.localeCompare(b.type);
        default: // newest
          return new Date(b.submissionDate) - new Date(a.submissionDate);
      }
    });

  const getStatusCounts = () => {
    const counts = applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {});
    return counts;
  };

  const statusCounts = getStatusCounts();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-heading font-semibold text-foreground">
            My Applications
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Track and manage your submitted applications
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="RefreshCw"
            iconPosition="left"
            iconSize={14}
          >
            Refresh
          </Button>
          <Button
            variant="default"
            size="sm"
            iconName="Plus"
            iconPosition="left"
            iconSize={14}
          >
            New Application
          </Button>
        </div>
      </div>

      {/* Status Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-card border border-border rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <Icon name="FileText" size={16} className="text-accent" />
            <div>
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-lg font-semibold text-foreground">{applications.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={16} className="text-warning" />
            <div>
              <p className="text-xs text-muted-foreground">Pending</p>
              <p className="text-lg font-semibold text-foreground">
                {(statusCounts.submitted || 0) + (statusCounts['under-review'] || 0)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <Icon name="CheckCircle" size={16} className="text-success" />
            <div>
              <p className="text-xs text-muted-foreground">Approved</p>
              <p className="text-lg font-semibold text-foreground">{statusCounts.approved || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <Icon name="XCircle" size={16} className="text-error" />
            <div>
              <p className="text-xs text-muted-foreground">Rejected</p>
              <p className="text-lg font-semibold text-foreground">{statusCounts.rejected || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <Icon name="CreditCard" size={16} className="text-warning" />
            <div>
              <p className="text-xs text-muted-foreground">Payment</p>
              <p className="text-lg font-semibold text-foreground">{statusCounts['pending-payment'] || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Search by reference number, type, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="flex gap-2">
          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="Filter by status"
            className="w-48"
          />
          
          <Select
            options={sortOptions}
            value={sortBy}
            onChange={setSortBy}
            placeholder="Sort by"
            className="w-40"
          />
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.length > 0 ? (
          filteredApplications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
            />
          ))
        ) : (
          <div className="text-center py-12 bg-card border border-border rounded-lg">
            <Icon name="FileX" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
              No Applications Found
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== 'all' ?'Try adjusting your search or filter criteria' :'You haven\'t submitted any applications yet'
              }
            </p>
            <Button
              variant="outline"
              iconName="Plus"
              iconPosition="left"
              iconSize={16}
            >
              Submit New Application
            </Button>
          </div>
        )}
      </div>

      {/* Load More */}
      {filteredApplications.length > 0 && (
        <div className="text-center pt-4">
          <Button
            variant="outline"
            iconName="ChevronDown"
            iconPosition="right"
            iconSize={16}
          >
            Load More Applications
          </Button>
        </div>
      )}
    </div>
  );
};

export default MyApplicationsSection;