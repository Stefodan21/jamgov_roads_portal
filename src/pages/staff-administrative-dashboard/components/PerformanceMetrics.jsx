import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const PerformanceMetrics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  const [metrics, setMetrics] = useState({});
  const [chartData, setChartData] = useState({});

  const periodOptions = [
    { value: '24hours', label: 'Last 24 Hours' },
    { value: '7days', label: 'Last 7 Days' },
    { value: '30days', label: 'Last 30 Days' },
    { value: '90days', label: 'Last 90 Days' }
  ];

  useEffect(() => {
    // Mock performance data
    const mockMetrics = {
      totalApplications: 1247,
      processedToday: 89,
      averageProcessingTime: '2.4 hours',
      staffProductivity: 94,
      complianceScore: 98,
      citizenSatisfaction: 4.6,
      systemUptime: 99.8,
      documentAccuracy: 96.2
    };

    const mockChartData = {
      dailyApplications: [
        { date: '2025-01-10', submitted: 45, processed: 42, approved: 38 },
        { date: '2025-01-11', submitted: 52, processed: 48, approved: 44 },
        { date: '2025-01-12', submitted: 38, processed: 41, approved: 39 },
        { date: '2025-01-13', submitted: 61, processed: 55, approved: 51 },
        { date: '2025-01-14', submitted: 47, processed: 49, approved: 45 },
        { date: '2025-01-15', submitted: 55, processed: 52, approved: 48 },
        { date: '2025-01-16', submitted: 43, processed: 46, approved: 42 }
      ],
      processingTimes: [
        { hour: '08:00', avgTime: 1.2 },
        { hour: '09:00', avgTime: 1.8 },
        { hour: '10:00', avgTime: 2.1 },
        { hour: '11:00', avgTime: 2.4 },
        { hour: '12:00', avgTime: 3.2 },
        { hour: '13:00', avgTime: 2.8 },
        { hour: '14:00', avgTime: 2.3 },
        { hour: '15:00', avgTime: 2.0 },
        { hour: '16:00', avgTime: 1.9 },
        { hour: '17:00', avgTime: 1.5 }
      ],
      applicationTypes: [
        { name: 'Road Construction', value: 35, color: '#1B5E20' },
        { name: 'Infrastructure License', value: 28, color: '#FFC107' },
        { name: 'Utility Connection', value: 20, color: '#2196F3' },
        { name: 'Traffic Signal', value: 12, color: '#4CAF50' },
        { name: 'Other', value: 5, color: '#FF9800' }
      ]
    };

    setMetrics(mockMetrics);
    setChartData(mockChartData);
  }, [selectedPeriod]);

  const MetricCard = ({ title, value, change, icon, color = 'text-primary' }) => (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg ${color.replace('text-', 'bg-')}/10 flex items-center justify-center`}>
          <Icon name={icon} size={24} className={color} />
        </div>
        {change && (
          <div className={`flex items-center space-x-1 text-sm ${change > 0 ? 'text-success' : 'text-error'}`}>
            <Icon name={change > 0 ? 'TrendingUp' : 'TrendingDown'} size={16} />
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      <div>
        <h3 className="text-2xl font-heading font-bold text-foreground mb-1">{value}</h3>
        <p className="text-sm text-muted-foreground">{title}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-heading font-semibold text-foreground">
          Performance Metrics
        </h2>
        <div className="flex items-center space-x-3">
          <Select
            options={periodOptions}
            value={selectedPeriod}
            onChange={setSelectedPeriod}
            className="w-40"
          />
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconPosition="left"
            iconSize={14}
          >
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Applications"
          value={metrics.totalApplications?.toLocaleString()}
          change={12}
          icon="FileText"
          color="text-primary"
        />
        <MetricCard
          title="Processed Today"
          value={metrics.processedToday}
          change={8}
          icon="CheckCircle"
          color="text-success"
        />
        <MetricCard
          title="Avg Processing Time"
          value={metrics.averageProcessingTime}
          change={-15}
          icon="Clock"
          color="text-accent"
        />
        <MetricCard
          title="Staff Productivity"
          value={`${metrics.staffProductivity}%`}
          change={5}
          icon="Users"
          color="text-warning"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Applications Chart */}
        <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-heading font-semibold text-foreground">
              Daily Application Flow
            </h3>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <span className="text-muted-foreground">Submitted</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-accent rounded-full"></div>
                <span className="text-muted-foreground">Processed</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-success rounded-full"></div>
                <span className="text-muted-foreground">Approved</span>
              </div>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.dailyApplications}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="date" 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-JM', { month: 'short', day: 'numeric' })}
                />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--color-popover)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '6px'
                  }}
                />
                <Bar dataKey="submitted" fill="var(--color-primary)" radius={[2, 2, 0, 0]} />
                <Bar dataKey="processed" fill="var(--color-accent)" radius={[2, 2, 0, 0]} />
                <Bar dataKey="approved" fill="var(--color-success)" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Processing Times Chart */}
        <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-heading font-semibold text-foreground">
              Processing Times by Hour
            </h3>
            <div className="text-sm text-muted-foreground">
              Average hours
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData.processingTimes}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="hour" 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--color-popover)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '6px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="avgTime" 
                  stroke="var(--color-accent)" 
                  strokeWidth={3}
                  dot={{ fill: 'var(--color-accent)', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Application Types Distribution */}
        <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-6">
            Application Types
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData.applicationTypes}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.applicationTypes?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {chartData.applicationTypes?.map((type, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: type.color }}
                  ></div>
                  <span className="text-foreground">{type.name}</span>
                </div>
                <span className="text-muted-foreground">{type.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance Metrics */}
        <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-6">
            Compliance & Quality
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">Data Protection Act</span>
              <div className="flex items-center space-x-2">
                <div className="w-16 h-2 bg-muted rounded-full">
                  <div className="w-full h-2 bg-success rounded-full"></div>
                </div>
                <span className="text-sm font-medium text-success">{metrics.complianceScore}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">Document Accuracy</span>
              <div className="flex items-center space-x-2">
                <div className="w-16 h-2 bg-muted rounded-full">
                  <div className="w-[96%] h-2 bg-primary rounded-full"></div>
                </div>
                <span className="text-sm font-medium text-primary">{metrics.documentAccuracy}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">System Uptime</span>
              <div className="flex items-center space-x-2">
                <div className="w-16 h-2 bg-muted rounded-full">
                  <div className="w-[99.8%] h-2 bg-success rounded-full"></div>
                </div>
                <span className="text-sm font-medium text-success">{metrics.systemUptime}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">Citizen Satisfaction</span>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Icon
                    key={star}
                    name="Star"
                    size={16}
                    className={star <= Math.floor(metrics.citizenSatisfaction) ? 'text-warning fill-current' : 'text-muted-foreground'}
                  />
                ))}
                <span className="text-sm font-medium text-foreground ml-2">
                  {metrics.citizenSatisfaction}/5
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-6">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <Button
              variant="outline"
              fullWidth
              iconName="FileBarChart"
              iconPosition="left"
              iconSize={16}
              className="justify-start"
            >
              Generate Report
            </Button>
            <Button
              variant="outline"
              fullWidth
              iconName="Users"
              iconPosition="left"
              iconSize={16}
              className="justify-start"
            >
              Staff Performance
            </Button>
            <Button
              variant="outline"
              fullWidth
              iconName="Settings"
              iconPosition="left"
              iconSize={16}
              className="justify-start"
            >
              System Settings
            </Button>
            <Button
              variant="outline"
              fullWidth
              iconName="AlertTriangle"
              iconPosition="left"
              iconSize={16}
              className="justify-start"
            >
              View Alerts
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;