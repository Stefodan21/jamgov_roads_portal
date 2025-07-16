import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';


const StaffTrainingModule = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [staffProgress, setStaffProgress] = useState({});
  const [certifications, setCertifications] = useState([]);
  const [trainingResources, setTrainingResources] = useState([]);

  const mockCourses = [
    {
      id: 'COURSE-001',
      title: 'Data Protection Act Compliance',
      description: 'Understanding Jamaica\'s Data Protection Act requirements for government systems',
      duration: '2 hours',
      difficulty: 'Intermediate',
      category: 'Compliance',
      progress: 75,
      status: 'in-progress',
      modules: 8,
      completedModules: 6,
      dueDate: '2025-01-25',
      instructor: 'Dr. Patricia Williams',
      rating: 4.8
    },
    {
      id: 'COURSE-002',
      title: 'Amanda 7 System Administration',
      description: 'Complete guide to managing permits and licenses in Amanda 7',
      duration: '4 hours',
      difficulty: 'Advanced',
      category: 'Technical',
      progress: 100,
      status: 'completed',
      modules: 12,
      completedModules: 12,
      completedDate: '2025-01-10',
      instructor: 'Michael Thompson',
      rating: 4.9
    },
    {
      id: 'COURSE-003',
      title: 'Citizen Service Excellence',
      description: 'Best practices for providing exceptional citizen services',
      duration: '1.5 hours',
      difficulty: 'Beginner',
      category: 'Service',
      progress: 0,
      status: 'not-started',
      modules: 6,
      completedModules: 0,
      dueDate: '2025-02-15',
      instructor: 'Sarah Johnson',
      rating: 4.7
    },
    {
      id: 'COURSE-004',
      title: 'Document Processing & OCR',
      description: 'Advanced techniques for document verification and OCR result validation',
      duration: '3 hours',
      difficulty: 'Advanced',
      category: 'Technical',
      progress: 45,
      status: 'in-progress',
      modules: 10,
      completedModules: 4,
      dueDate: '2025-01-30',
      instructor: 'Robert Garcia',
      rating: 4.6
    }
  ];

  const mockCertifications = [
    {
      id: 'CERT-001',
      name: 'Data Protection Officer',
      issueDate: '2024-12-15',
      expiryDate: '2025-12-15',
      status: 'active',
      credentialId: 'DPO-JM-2024-001'
    },
    {
      id: 'CERT-002',
      name: 'Amanda 7 Certified Administrator',
      issueDate: '2025-01-10',
      expiryDate: '2026-01-10',
      status: 'active',
      credentialId: 'AMD-ADM-2025-001'
    },
    {
      id: 'CERT-003',
      name: 'Government Service Excellence',
      issueDate: '2024-11-20',
      expiryDate: '2025-11-20',
      status: 'expiring-soon',
      credentialId: 'GSE-JM-2024-001'
    }
  ];

  const mockResources = [
    {
      id: 'RES-001',
      title: 'Data Protection Act 2020 - Full Text',
      type: 'document',
      category: 'Legal',
      downloadUrl: '#',
      size: '2.4 MB',
      lastUpdated: '2025-01-15'
    },
    {
      id: 'RES-002',
      title: 'Amanda 7 User Manual',
      type: 'manual',
      category: 'Technical',
      downloadUrl: '#',
      size: '15.7 MB',
      lastUpdated: '2025-01-12'
    },
    {
      id: 'RES-003',
      title: 'Citizen Service Standards Video',
      type: 'video',
      category: 'Training',
      downloadUrl: '#',
      duration: '45 minutes',
      lastUpdated: '2025-01-08'
    }
  ];

  useEffect(() => {
    setStaffProgress({
      totalCourses: mockCourses.length,
      completedCourses: mockCourses.filter(c => c.status === 'completed').length,
      inProgressCourses: mockCourses.filter(c => c.status === 'in-progress').length,
      overallProgress: Math.round(mockCourses.reduce((acc, course) => acc + course.progress, 0) / mockCourses.length)
    });
    setCertifications(mockCertifications);
    setTrainingResources(mockResources);
  }, []);

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
  };

  const handleStartCourse = (courseId) => {
    console.log('Starting course:', courseId);
  };

  const handleContinueCourse = (courseId) => {
    console.log('Continuing course:', courseId);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-success bg-success/10';
      case 'in-progress': return 'text-accent bg-accent/10';
      case 'not-started': return 'text-muted-foreground bg-muted';
      case 'overdue': return 'text-error bg-error/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'text-success';
      case 'Intermediate': return 'text-warning';
      case 'Advanced': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getCertificationStatus = (cert) => {
    const today = new Date();
    const expiryDate = new Date(cert.expiryDate);
    const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) return { status: 'expired', color: 'text-error bg-error/10' };
    if (daysUntilExpiry <= 30) return { status: 'expiring-soon', color: 'text-warning bg-warning/10' };
    return { status: 'active', color: 'text-success bg-success/10' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="GraduationCap" size={20} className="text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-heading font-semibold text-foreground">
              Staff Training Module
            </h2>
            <p className="text-sm text-muted-foreground">
              Professional development and certification tracking
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          iconName="Plus"
          iconPosition="left"
          iconSize={16}
        >
          Enroll in Course
        </Button>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Icon name="BookOpen" size={16} className="text-primary" />
            <span className="text-xs text-muted-foreground">Total</span>
          </div>
          <div className="text-2xl font-bold text-foreground">{staffProgress.totalCourses}</div>
          <div className="text-sm text-muted-foreground">Courses</div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Icon name="CheckCircle" size={16} className="text-success" />
            <span className="text-xs text-muted-foreground">Completed</span>
          </div>
          <div className="text-2xl font-bold text-foreground">{staffProgress.completedCourses}</div>
          <div className="text-sm text-muted-foreground">Courses</div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Icon name="Clock" size={16} className="text-accent" />
            <span className="text-xs text-muted-foreground">In Progress</span>
          </div>
          <div className="text-2xl font-bold text-foreground">{staffProgress.inProgressCourses}</div>
          <div className="text-sm text-muted-foreground">Courses</div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Icon name="TrendingUp" size={16} className="text-warning" />
            <span className="text-xs text-muted-foreground">Overall</span>
          </div>
          <div className="text-2xl font-bold text-foreground">{staffProgress.overallProgress}%</div>
          <div className="text-sm text-muted-foreground">Progress</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course Catalog */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-heading font-semibold text-foreground">
              Available Courses
            </h3>
            <Select
              options={[
                { value: 'all', label: 'All Categories' },
                { value: 'compliance', label: 'Compliance' },
                { value: 'technical', label: 'Technical' },
                { value: 'service', label: 'Service' }
              ]}
              value="all"
              onChange={() => {}}
              className="w-40"
            />
          </div>

          <div className="space-y-4">
            {mockCourses.map((course) => (
              <div
                key={course.id}
                className="border border-border rounded-lg p-4 hover:shadow-elevation-1 transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground mb-1">{course.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{course.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span className="flex items-center space-x-1">
                        <Icon name="Clock" size={12} />
                        <span>{course.duration}</span>
                      </span>
                      <span className={`flex items-center space-x-1 ${getDifficultyColor(course.difficulty)}`}>
                        <Icon name="BarChart3" size={12} />
                        <span>{course.difficulty}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Icon name="Star" size={12} />
                        <span>{course.rating}</span>
                      </span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
                    {course.status.replace('-', ' ')}
                  </span>
                </div>

                {course.progress > 0 && (
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Progress</span>
                      <span>{course.completedModules}/{course.modules} modules</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    Instructor: {course.instructor}
                  </div>
                  <div className="flex items-center space-x-2">
                    {course.status === 'not-started' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStartCourse(course.id)}
                      >
                        Start Course
                      </Button>
                    )}
                    {course.status === 'in-progress' && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleContinueCourse(course.id)}
                      >
                        Continue
                      </Button>
                    )}
                    {course.status === 'completed' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Download"
                        iconSize={14}
                      >
                        Certificate
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications and Resources */}
        <div className="space-y-6">
          {/* Certifications */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-heading font-semibold text-foreground mb-6">
              My Certifications
            </h3>
            <div className="space-y-4">
              {certifications.map((cert) => {
                const certStatus = getCertificationStatus(cert);
                return (
                  <div key={cert.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{cert.name}</h4>
                        <p className="text-sm text-muted-foreground font-mono">
                          {cert.credentialId}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${certStatus.color}`}>
                        {certStatus.status.replace('-', ' ')}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                      <div>
                        <span>Issued: </span>
                        <span className="text-foreground">
                          {new Date(cert.issueDate).toLocaleDateString('en-JM')}
                        </span>
                      </div>
                      <div>
                        <span>Expires: </span>
                        <span className="text-foreground">
                          {new Date(cert.expiryDate).toLocaleDateString('en-JM')}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Training Resources */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-heading font-semibold text-foreground mb-6">
              Training Resources
            </h3>
            <div className="space-y-3">
              {trainingResources.map((resource) => (
                <div key={resource.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Icon 
                      name={resource.type === 'document' ? 'FileText' : 
                            resource.type === 'video' ? 'Play' : 'Book'} 
                      size={16} 
                      className="text-primary" 
                    />
                    <div>
                      <h4 className="text-sm font-medium text-foreground">{resource.title}</h4>
                      <p className="text-xs text-muted-foreground">
                        {resource.size || resource.duration} • Updated {new Date(resource.lastUpdated).toLocaleDateString('en-JM')}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Download"
                    iconSize={14}
                    title="Download resource"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffTrainingModule;