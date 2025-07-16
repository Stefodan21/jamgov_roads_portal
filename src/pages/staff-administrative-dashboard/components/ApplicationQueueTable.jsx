import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import DocumentStatusIndicator from '../../../components/ui/DocumentStatusIndicator';

const ApplicationQueueTable = ({ onApplicationSelect, selectedApplications, onSelectionChange }) => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'priority', direction: 'desc' });
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    type: '',
    assignedTo: '',
    search: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Mock application data
  useEffect(() => {
    const mockApplications = [
      {
        id: 'APP-2025-001',
        applicantName: 'Marcus Campbell',
        type: 'Road Construction Permit',
        status: 'pending',
        priority: 'high',
        submittedDate: new Date('2025-01-15'),
        assignedTo: 'Sarah Johnson',
        estimatedCompletion: '2025-01-18',
        agingDays: 1,
        location: 'Kingston, St. Andrew',
        documents: 3,
        lastActivity: 'Document verification pending'
      },
      {
        id: 'APP-2025-002',
        applicantName: 'Jennifer Brown',
        type: 'Infrastructure License',
        status: 'processing',
        priority: 'medium',
        submittedDate: new Date('2025-01-14'),
        assignedTo: 'Michael Davis',
        estimatedCompletion: '2025-01-19',
        agingDays: 2,
        location: 'Spanish Town, St. Catherine',
        documents: 5,
        lastActivity: 'Under technical review'
      },
      {
        id: 'APP-2025-003',
        applicantName: 'David Wilson',
        type: 'Utility Connection',
        status: 'approved',
        priority: 'low',
        submittedDate: new Date('2025-01-13'),
        assignedTo: 'Lisa Thompson',
        estimatedCompletion: '2025-01-16',
        agingDays: 3,
        location: 'Montego Bay, St. James',
        documents: 2,
        lastActivity: 'Approved and processed'
      },
      {
        id: 'APP-2025-004',
        applicantName: 'Patricia Miller',
        type: 'Road Maintenance Request',
        status: 'rejected',
        priority: 'high',
        submittedDate: new Date('2025-01-12'),
        assignedTo: 'Robert Garcia',
        estimatedCompletion: '2025-01-17',
        agingDays: 4,
        location: 'Ocho Rios, St. Ann',
        documents: 4,
        lastActivity: 'Rejected - incomplete documentation'
      },
      {
        id: 'APP-2025-005',
        applicantName: 'Christopher Taylor',
        type: 'Traffic Signal Installation',
        status: 'pending',
        priority: 'medium',
        submittedDate: new Date('2025-01-11'),
        assignedTo: 'Amanda Rodriguez',
        estimatedCompletion: '2025-01-20',
        agingDays: 5,
        location: 'Mandeville, Manchester',
        documents: 6,
        lastActivity: 'Awaiting supervisor approval'
      }
    ];
    setApplications(mockApplications);
    setFilteredApplications(mockApplications);
  }, []);

  // Filter and search functionality
  useEffect(() => {
    let filtered = applications.filter(app => {
      return (
        (filters.status === '' || app.status === filters.status) &&
        (filters.priority === '' || app.priority === filters.priority) &&
        (filters.type === '' || app.type.toLowerCase().includes(filters.type.toLowerCase())) &&
        (filters.assignedTo === '' || app.assignedTo.toLowerCase().includes(filters.assignedTo.toLowerCase())) &&
        (filters.search === '' || 
          app.applicantName.toLowerCase().includes(filters.search.toLowerCase()) ||
          app.id.toLowerCase().includes(filters.search.toLowerCase()) ||
          app.location.toLowerCase().includes(filters.search.toLowerCase())
        )
      );
    });

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        
        if (sortConfig.key === 'submittedDate') {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    setFilteredApplications(filtered);
    setCurrentPage(1);
  }, [applications, filters, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      const currentPageItems = getCurrentPageItems().map(app => app.id);
      onSelectionChange([...selectedApplications, ...currentPageItems]);
    } else {
      const currentPageItems = getCurrentPageItems().map(app => app.id);
      onSelectionChange(selectedApplications.filter(id => !currentPageItems.includes(id)));
    }
  };

  const handleSelectApplication = (appId, checked) => {
    if (checked) {
      onSelectionChange([...selectedApplications, appId]);
    } else {
      onSelectionChange(selectedApplications.filter(id => id !== appId));
    }
  };

  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredApplications.slice(startIndex, startIndex + itemsPerPage);
  };

  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  const currentPageItems = getCurrentPageItems();

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-error bg-error/10';
      case 'medium': return 'text-warning bg-warning/10';
      case 'low': return 'text-success bg-success/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getAgingColor = (days) => {
    if (days >= 5) return 'text-error';
    if (days >= 3) return 'text-warning';
    return 'text-muted-foreground';
  };

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' }
  ];

  const priorityOptions = [
    { value: '', label: 'All Priorities' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg shadow-elevation-1">
      {/* Header and Filters */}
      <div className="p-6 border-b border-border">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
          <h2 className="text-xl font-heading font-semibold text-foreground">
            Application Queue
          </h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              {filteredApplications.length} applications
            </span>
            <Button
              variant="outline"
              size="sm"
              iconName="RefreshCw"
              iconPosition="left"
              iconSize={14}
              onClick={() => window.location.reload()}
            >
              Refresh
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Input
            type="search"
            placeholder="Search applications..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="lg:col-span-2"
          />
          
          <Select
            placeholder="Filter by status"
            options={statusOptions}
            value={filters.status}
            onChange={(value) => handleFilterChange('status', value)}
          />
          
          <Select
            placeholder="Filter by priority"
            options={priorityOptions}
            value={filters.priority}
            onChange={(value) => handleFilterChange('priority', value)}
          />
          
          <Input
            type="text"
            placeholder="Assigned to..."
            value={filters.assignedTo}
            onChange={(e) => handleFilterChange('assignedTo', e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="w-12 p-4">
                <input
                  type="checkbox"
                  checked={currentPageItems.length > 0 && currentPageItems.every(app => selectedApplications.includes(app.id))}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-border"
                />
              </th>
              <th className="text-left p-4 font-medium text-foreground">
                <button
                  onClick={() => handleSort('id')}
                  className="flex items-center space-x-1 hover:text-primary"
                >
                  <span>Application ID</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-foreground">
                <button
                  onClick={() => handleSort('applicantName')}
                  className="flex items-center space-x-1 hover:text-primary"
                >
                  <span>Applicant</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-foreground">Type</th>
              <th className="text-left p-4 font-medium text-foreground">Status</th>
              <th className="text-left p-4 font-medium text-foreground">
                <button
                  onClick={() => handleSort('priority')}
                  className="flex items-center space-x-1 hover:text-primary"
                >
                  <span>Priority</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-foreground">
                <button
                  onClick={() => handleSort('agingDays')}
                  className="flex items-center space-x-1 hover:text-primary"
                >
                  <span>Aging</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-foreground">Assigned To</th>
              <th className="text-left p-4 font-medium text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentPageItems.map((app) => (
              <tr key={app.id} className="border-b border-border hover:bg-muted/30">
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedApplications.includes(app.id)}
                    onChange={(e) => handleSelectApplication(app.id, e.target.checked)}
                    className="rounded border-border"
                  />
                </td>
                <td className="p-4">
                  <button
                    onClick={() => onApplicationSelect(app)}
                    className="font-mono text-sm text-primary hover:underline"
                  >
                    {app.id}
                  </button>
                </td>
                <td className="p-4">
                  <div>
                    <div className="font-medium text-foreground">{app.applicantName}</div>
                    <div className="text-sm text-muted-foreground">{app.location}</div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-sm text-foreground">{app.type}</span>
                </td>
                <td className="p-4">
                  <DocumentStatusIndicator status={app.status} size="sm" />
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(app.priority)}`}>
                    {app.priority.charAt(0).toUpperCase() + app.priority.slice(1)}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`text-sm font-medium ${getAgingColor(app.agingDays)}`}>
                    {app.agingDays} days
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-xs text-primary-foreground font-medium">
                        {app.assignedTo.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <span className="text-sm text-foreground">{app.assignedTo}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Eye"
                      iconSize={14}
                      onClick={() => onApplicationSelect(app)}
                      title="View details"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Edit"
                      iconSize={14}
                      title="Edit application"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="MessageSquare"
                      iconSize={14}
                      title="Contact applicant"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 border-t border-border">
          <div className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredApplications.length)} of {filteredApplications.length} applications
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="ChevronLeft"
              iconSize={14}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            >
              Previous
            </Button>
            <span className="text-sm text-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              iconName="ChevronRight"
              iconSize={14}
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationQueueTable;