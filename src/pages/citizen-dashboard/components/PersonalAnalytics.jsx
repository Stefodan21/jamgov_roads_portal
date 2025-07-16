import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PersonalAnalytics = ({ className = '' }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('6months');

  const applicationStats = {
    totalApplications: 12,
    averageProcessingTime: '5.2 days',
    successRate: 83,
    totalFeesPaid: 156000,
    pendingApplications: 2,
    approvedApplications: 10
  };

  const monthlyData = [
    { month: 'Jan', applications: 2, approved: 2, rejected: 0 },
    { month: 'Feb', applications: 1, approved: 1, rejected: 0 },
    { month: 'Mar', applications: 3, approved: 2, rejected: 1 },
    { month: 'Apr', applications: 2, approved: 2, rejected: 0 },
    { month: 'May', applications: 1, approved: 1, rejected: 0 },
    { month: 'Jun', applications: 2, approved: 1, rejected: 1 },
    { month: 'Jul', applications: 1, approved: 1, rejected: 0 }
  ];

  const applicationTypeData = [
    { name: 'Road Permits', value: 5, color: '#1B5E20' },
    { name: 'Construction Licenses', value: 4, color: '#FFC107' },
    { name: 'Infrastructure Requests', value: 2, color: '#2196F3' },
    { name: 'Building Permits', value: 1, color: '#4CAF50' }
  ];

  const processingTimeData = [
    { type: 'Road Permits', avgTime: 4.2, target: 5.0 },
    { type: 'Construction', avgTime: 8.5, target: 10.0 },
    { type: 'Infrastructure', avgTime: 2.8, target: 3.0 },
    { type: 'Building', avgTime: 12.0, target: 14.0 }
  ];

  const periodOptions = [
    { value: '3months', label: '3 Months' },
    { value: '6months', label: '6 Months' },
    { value: '1year', label: '1 Year' },
    { value: 'all', label: 'All Time' }
  ];

  const formatCurrency = (amount) => {
    return `J$${amount.toLocaleString()}`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-elevation-2">
          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-heading font-semibold text-foreground">
            Personal Analytics
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Your application history and performance insights
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {periodOptions.map((option) => (
            <Button
              key={option.value}
              variant={selectedPeriod === option.value ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedPeriod(option.value)}
              className="text-xs"
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="FileText" size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Applications</p>
              <p className="text-xl font-semibold text-foreground">{applicationStats.totalApplications}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <Icon name="CheckCircle" size={20} className="text-success" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Success Rate</p>
              <p className="text-xl font-semibold text-foreground">{applicationStats.successRate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
              <Icon name="Clock" size={20} className="text-accent" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Avg Processing</p>
              <p className="text-xl font-semibold text-foreground">{applicationStats.averageProcessingTime}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
              <Icon name="DollarSign" size={20} className="text-secondary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Fees Paid</p>
              <p className="text-xl font-semibold text-foreground">{formatCurrency(applicationStats.totalFeesPaid)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Applications Chart */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-heading font-semibold text-foreground">
              Monthly Applications
            </h3>
            <Icon name="BarChart3" size={20} className="text-muted-foreground" />
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="month" 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="applications" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="approved" fill="var(--color-success)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Application Types Distribution */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-heading font-semibold text-foreground">
              Application Types
            </h3>
            <Icon name="PieChart" size={20} className="text-muted-foreground" />
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={applicationTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {applicationTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            {applicationTypeData.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-muted-foreground truncate">
                  {item.name} ({item.value})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Processing Time Comparison */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-heading font-semibold text-foreground">
            Processing Time vs Target
          </h3>
          <Icon name="Target" size={20} className="text-muted-foreground" />
        </div>
        
        <div className="space-y-4">
          {processingTimeData.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-foreground font-medium">{item.type}</span>
                <div className="flex items-center space-x-4">
                  <span className="text-muted-foreground">
                    Actual: {item.avgTime} days
                  </span>
                  <span className="text-muted-foreground">
                    Target: {item.target} days
                  </span>
                </div>
              </div>
              
              <div className="relative">
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      item.avgTime <= item.target ? 'bg-success' : 'bg-warning'
                    }`}
                    style={{ width: `${Math.min((item.avgTime / item.target) * 100, 100)}%` }}
                  />
                </div>
                <div 
                  className="absolute top-0 w-0.5 h-2 bg-primary"
                  style={{ left: `${(item.target / Math.max(item.avgTime, item.target)) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Insights */}
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-border rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Icon name="TrendingUp" size={24} className="text-primary" />
          <h3 className="text-lg font-heading font-semibold text-foreground">
            Performance Insights
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Icon name="CheckCircle" size={16} className="text-success" />
              <span className="text-sm text-foreground">
                Your applications are processed 15% faster than average
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Award" size={16} className="text-secondary" />
              <span className="text-sm text-foreground">
                High success rate indicates good document preparation
              </span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Icon name="Calendar" size={16} className="text-accent" />
              <span className="text-sm text-foreground">
                Most applications submitted on weekdays
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Clock" size={16} className="text-warning" />
              <span className="text-sm text-foreground">
                Consider submitting earlier in the month for faster processing
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalAnalytics;