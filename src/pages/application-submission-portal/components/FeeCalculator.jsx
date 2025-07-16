import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FeeCalculator = ({ 
  applicationType, 
  formData, 
  onFeeCalculated,
  className = '' 
}) => {
  const [calculatedFee, setCalculatedFee] = useState(0);
  const [feeBreakdown, setFeeBreakdown] = useState([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const baseFees = {
    'road-permit': 2500,
    'construction-permit': 5000,
    'utility-permit': 3000,
    'heavy-vehicle': 4000,
    'commercial-transport': 6000,
    'maintenance-request': 0,
    'signage-permit': 1500
  };

  const urgencyMultipliers = {
    'standard': { multiplier: 1, label: 'Standard Processing', additionalFee: 0 },
    'expedited': { multiplier: 1, label: 'Expedited Processing', additionalFee: 1000 },
    'emergency': { multiplier: 1, label: 'Emergency Processing', additionalFee: 2500 }
  };

  const impactMultipliers = {
    'minimal': { multiplier: 1, label: 'Minimal Impact' },
    'moderate': { multiplier: 1.2, label: 'Moderate Impact' },
    'significant': { multiplier: 1.5, label: 'Significant Impact' },
    'major': { multiplier: 2, label: 'Major Impact' }
  };

  const scheduleMultipliers = {
    'business-hours': { multiplier: 1, label: 'Business Hours' },
    'extended-hours': { multiplier: 1.1, label: 'Extended Hours' },
    'night-work': { multiplier: 1.5, label: 'Night Work' },
    'weekend-work': { multiplier: 1.3, label: 'Weekend Work' }
  };

  useEffect(() => {
    calculateFee();
  }, [applicationType, formData]);

  const calculateFee = async () => {
    if (!applicationType?.id) return;

    setIsCalculating(true);
    
    // Simulate calculation delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const baseFee = baseFees[applicationType.id] || 0;
    const breakdown = [];
    let totalFee = baseFee;

    // Base application fee
    breakdown.push({
      item: `${applicationType.name} - Base Fee`,
      amount: baseFee,
      type: 'base'
    });

    // Urgency fee
    const urgencyConfig = urgencyMultipliers[formData.urgencyLevel] || urgencyMultipliers.standard;
    if (urgencyConfig.additionalFee > 0) {
      breakdown.push({
        item: urgencyConfig.label,
        amount: urgencyConfig.additionalFee,
        type: 'urgency'
      });
      totalFee += urgencyConfig.additionalFee;
    }

    // Traffic impact multiplier
    const impactConfig = impactMultipliers[formData.trafficImpact];
    if (impactConfig && impactConfig.multiplier > 1) {
      const impactFee = baseFee * (impactConfig.multiplier - 1);
      breakdown.push({
        item: `${impactConfig.label} Surcharge`,
        amount: impactFee,
        type: 'impact'
      });
      totalFee += impactFee;
    }

    // Work schedule multiplier
    const scheduleConfig = scheduleMultipliers[formData.workSchedule];
    if (scheduleConfig && scheduleConfig.multiplier > 1) {
      const scheduleFee = baseFee * (scheduleConfig.multiplier - 1);
      breakdown.push({
        item: `${scheduleConfig.label} Surcharge`,
        amount: scheduleFee,
        type: 'schedule'
      });
      totalFee += scheduleFee;
    }

    // Duration-based fee (for projects longer than 30 days)
    const duration = parseInt(formData.projectDuration) || 0;
    if (duration > 30) {
      const durationFee = Math.ceil((duration - 30) / 30) * 500;
      breakdown.push({
        item: `Extended Duration Fee (${duration} days)`,
        amount: durationFee,
        type: 'duration'
      });
      totalFee += durationFee;
    }

    // Environmental assessment fee
    if (formData.environmentalAssessment) {
      const envFee = 1500;
      breakdown.push({
        item: 'Environmental Assessment Fee',
        amount: envFee,
        type: 'environmental'
      });
      totalFee += envFee;
    }

    // Heritage site fee
    if (formData.heritageSite) {
      const heritageFee = 2000;
      breakdown.push({
        item: 'Heritage Site Consideration Fee',
        amount: heritageFee,
        type: 'heritage'
      });
      totalFee += heritageFee;
    }

    // Government processing fee (5% of total)
    const processingFee = Math.round(totalFee * 0.05);
    breakdown.push({
      item: 'Government Processing Fee (5%)',
      amount: processingFee,
      type: 'processing'
    });
    totalFee += processingFee;

    // GCT (General Consumption Tax) - 16.5%
    const gct = Math.round(totalFee * 0.165);
    breakdown.push({
      item: 'GCT (16.5%)',
      amount: gct,
      type: 'tax'
    });
    totalFee += gct;

    setCalculatedFee(totalFee);
    setFeeBreakdown(breakdown);
    setIsCalculating(false);

    // Notify parent component
    if (onFeeCalculated) {
      onFeeCalculated({
        total: totalFee,
        breakdown: breakdown,
        currency: 'JMD'
      });
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-JM', {
      style: 'currency',
      currency: 'JMD',
      minimumFractionDigits: 2
    }).format(amount).replace('JMD', 'J$');
  };

  const getFeeTypeIcon = (type) => {
    switch (type) {
      case 'base': return 'FileText';
      case 'urgency': return 'Clock';
      case 'impact': return 'AlertTriangle';
      case 'schedule': return 'Calendar';
      case 'duration': return 'Timer';
      case 'environmental': return 'Leaf';
      case 'heritage': return 'Landmark';
      case 'processing': return 'Settings';
      case 'tax': return 'Receipt';
      default: return 'DollarSign';
    }
  };

  const getFeeTypeColor = (type) => {
    switch (type) {
      case 'base': return 'text-primary';
      case 'urgency': return 'text-warning';
      case 'impact': return 'text-error';
      case 'schedule': return 'text-accent';
      case 'duration': return 'text-secondary';
      case 'environmental': return 'text-success';
      case 'heritage': return 'text-primary';
      case 'processing': return 'text-muted-foreground';
      case 'tax': return 'text-error';
      default: return 'text-foreground';
    }
  };

  if (!applicationType) {
    return (
      <div className={`p-6 bg-muted/30 border border-border rounded-lg ${className}`}>
        <div className="text-center">
          <Icon name="Calculator" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-heading font-semibold text-muted-foreground mb-2">
            Fee Calculator
          </h3>
          <p className="text-sm text-muted-foreground">
            Select an application type to calculate fees
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
          Fee Calculator
        </h2>
        <p className="text-muted-foreground">
          Estimated fees for your {applicationType.name}
        </p>
      </div>

      {/* Main Fee Display */}
      <div className="p-6 bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground mb-1">
              Total Application Fee
            </h3>
            <p className="text-sm text-muted-foreground">
              {isCalculating ? 'Calculating...' : 'All fees and taxes included'}
            </p>
          </div>
          
          <div className="text-right">
            {isCalculating ? (
              <div className="flex items-center space-x-2">
                <Icon name="RefreshCw" size={24} className="text-primary animate-spin" />
                <span className="text-lg font-heading font-semibold text-primary">
                  Calculating...
                </span>
              </div>
            ) : (
              <div className="text-3xl font-heading font-bold text-primary">
                {formatCurrency(calculatedFee)}
              </div>
            )}
          </div>
        </div>

        {!isCalculating && (
          <div className="mt-4 pt-4 border-t border-border/50">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowBreakdown(!showBreakdown)}
              iconName={showBreakdown ? 'ChevronUp' : 'ChevronDown'}
              iconPosition="right"
              iconSize={16}
            >
              {showBreakdown ? 'Hide' : 'Show'} Fee Breakdown
            </Button>
          </div>
        )}
      </div>

      {/* Fee Breakdown */}
      {showBreakdown && !isCalculating && (
        <div className="space-y-4">
          <h3 className="text-lg font-heading font-semibold text-foreground border-b border-border pb-2">
            Fee Breakdown
          </h3>
          
          <div className="space-y-3">
            {feeBreakdown.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-card border border-border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Icon 
                    name={getFeeTypeIcon(item.type)} 
                    size={16} 
                    className={getFeeTypeColor(item.type)}
                  />
                  <span className="text-sm text-foreground">
                    {item.item}
                  </span>
                </div>
                <span className="text-sm font-medium text-foreground">
                  {formatCurrency(item.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment Information */}
      <div className="p-4 bg-accent/5 border border-accent/20 rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={20} className="text-accent mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-accent mb-2">
              Payment Information
            </p>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Payment is required before application processing begins</li>
              <li>• Accepted payment methods: Credit/Debit cards, Bank transfer, Mobile money</li>
              <li>• Fees are non-refundable once processing begins</li>
              <li>• Additional fees may apply for amendments or resubmissions</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Recalculate Button */}
      <div className="flex justify-center">
        <Button
          variant="outline"
          onClick={calculateFee}
          iconName="RefreshCw"
          iconPosition="left"
          iconSize={16}
          disabled={isCalculating}
        >
          Recalculate Fees
        </Button>
      </div>
    </div>
  );
};

export default FeeCalculator;