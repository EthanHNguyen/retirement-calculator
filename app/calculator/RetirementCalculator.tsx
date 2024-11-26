"use client"

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { DollarSign, HelpCircle } from 'lucide-react';
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const RetirementCalculator = () => {
  const [age, setAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(65);
  const [annualIncome, setAnnualIncome] = useState(100000);
  const [currentSavings, setCurrentSavings] = useState(50000);
  const [hasCompanyMatch, setHasCompanyMatch] = useState(true);
  const [matchPercentage, setMatchPercentage] = useState(50);
  const [matchLimit, setMatchLimit] = useState(6);
  const [contributionPercent, setContributionPercent] = useState(10);
  const [includeSocialSecurity, setIncludeSocialSecurity] = useState(true);

  // Calculate estimated Social Security benefit
  const calculateSocialSecurity = (income) => {
    // Simplified calculation based on average earnings
    // Actual calculation is more complex and depends on lifetime earnings
    const baseAmount = Math.min(income, 160200) * 0.4; // 40% of income up to SS wage limit
    return baseAmount / 12; // Monthly amount
  };

  const formatInputNumber = (value) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  const parseInputNumber = (value) => {
    return Number(value.replace(/,/g, ''));
  };

  // Calculate contribution amounts
  const annualContribution = (annualIncome * contributionPercent) / 100;
  const matchAmount = hasCompanyMatch ? 
    Math.min(annualContribution, (annualIncome * matchLimit / 100)) * (matchPercentage / 100) : 0;

  // Generate timeline data
  const timelineData = useMemo(() => {
    const data = [];
    let totalAmount = currentSavings;
    const yearlyContribution = annualContribution + matchAmount;
    
    for (let currentAge = age; currentAge <= retirementAge; currentAge++) {
      totalAmount = totalAmount * (1 + 0.07) + yearlyContribution;
      data.push({
        age: currentAge,
        savings: Math.round(totalAmount)
      });
    }
    return data;
  }, [age, retirementAge, annualContribution, matchAmount, currentSavings]);

  // Calculate projected monthly retirement income
  const investmentMonthlyIncome = (timelineData[timelineData.length - 1]?.savings * 0.04) / 12;
  const socialSecurityBenefit = calculateSocialSecurity(annualIncome);
  const totalMonthlyIncome = includeSocialSecurity ? 
    investmentMonthlyIncome + socialSecurityBenefit : 
    investmentMonthlyIncome;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const LabelWithTooltip = ({ htmlFor, label, tooltip }) => (
    <div className="flex items-center gap-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      <TooltipProvider>
        <UITooltip>
          <TooltipTrigger>
            <HelpCircle className="h-4 w-4 text-gray-500" />
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p>{tooltip}</p>
          </TooltipContent>
        </UITooltip>
      </TooltipProvider>
    </div>
  );

  const totalAnnualContribution = annualContribution + matchAmount;

  return (
    <div className="space-y-8 max-w-5xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Retirement Savings Calculator</CardTitle>
          <CardDescription>Plan your future with smart investment decisions today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <LabelWithTooltip 
                  htmlFor="age"
                  label="Current Age"
                  tooltip="Your current age in years"
                />
                <Input 
                  id="age" 
                  type="number" 
                  min="18"
                  max="80"
                  value={age} 
                  onChange={(e) => setAge(Number(e.target.value))}
                />
              </div>
              
              <div>
                <LabelWithTooltip 
                  htmlFor="retirementAge"
                  label="Retirement Age"
                  tooltip="The age you plan to retire and start withdrawing from your retirement savings"
                />
                <Input 
                  id="retirementAge" 
                  type="number" 
                  min={age + 1}
                  max="90"
                  value={retirementAge} 
                  onChange={(e) => setRetirementAge(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <LabelWithTooltip 
                  htmlFor="annualIncome"
                  label="Annual Income (Before Tax)"
                  tooltip="Your total yearly salary before taxes and deductions"
                />
                <div className="relative">
                  <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input 
                    id="annualIncome" 
                    className="pl-8"
                    value={formatInputNumber(annualIncome)} 
                    onChange={(e) => setAnnualIncome(parseInputNumber(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <LabelWithTooltip 
                  htmlFor="currentSavings"
                  label="Current Retirement Savings"
                  tooltip="Total amount currently saved in all your retirement accounts (401(k), IRA, etc.)"
                />
                <div className="relative">
                  <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input 
                    id="currentSavings" 
                    className="pl-8"
                    value={formatInputNumber(currentSavings)} 
                    onChange={(e) => setCurrentSavings(parseInputNumber(e.target.value))}
                  />
                </div>
              </div>
            </div>

            <div>
              <LabelWithTooltip 
                htmlFor="contributionPercent"
                label="Your Contribution"
                tooltip="Percentage of your salary you'll contribute to retirement each year"
              />
              <div className="flex items-center gap-2">
                <Input 
                  id="contributionPercent" 
                  type="number"
                  min="0"
                  max="100"
                  value={contributionPercent} 
                  onChange={(e) => setContributionPercent(Number(e.target.value))}
                />
                <span className="text-sm font-medium">%</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {formatCurrency(annualContribution)} per year
              </p>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <LabelWithTooltip 
                  label="Employer Match"
                  tooltip="Enable if your employer offers matching contributions to your retirement plan"
                />
                <Switch
                  checked={hasCompanyMatch}
                  onCheckedChange={setHasCompanyMatch}
                />
              </div>

              {hasCompanyMatch && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <LabelWithTooltip 
                      htmlFor="matchPercentage"
                      label="Match Rate"
                      tooltip="For every dollar you contribute, your employer adds this percentage. Example: 50% means they add 50¢ for every $1 you contribute"
                    />
                    <div className="flex items-center gap-2">
                      <Input 
                        id="matchPercentage" 
                        type="number"
                        min="0"
                        max="100"
                        value={matchPercentage} 
                        onChange={(e) => setMatchPercentage(Number(e.target.value))}
                      />
                      <span className="text-sm font-medium">%</span>
                    </div>
                  </div>

                  <div>
                    <LabelWithTooltip 
                      htmlFor="matchLimit"
                      label="Match Up To"
                      tooltip="Maximum percentage of your salary that your employer will match. Example: 6% means they'll match your contributions up to 6% of your salary"
                    />
                    <div className="flex items-center gap-2">
                      <Input 
                        id="matchLimit" 
                        type="number"
                        min="0"
                        max="100"
                        value={matchLimit} 
                        onChange={(e) => setMatchLimit(Number(e.target.value))}
                      />
                      <span className="text-sm font-medium">%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <LabelWithTooltip 
                label="Include Social Security"
                tooltip="Include estimated Social Security benefits in retirement income projections"
              />
              <Switch
                checked={includeSocialSecurity}
                onCheckedChange={setIncludeSocialSecurity}
              />
            </div>

            {hasCompanyMatch && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-700">
                  Total Annual Contribution: {formatCurrency(totalAnnualContribution)} 
                  ({formatCurrency(annualContribution)} from you + {formatCurrency(matchAmount)} employer match)
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>Projected Growth Over Time</CardTitle>
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-gray-500" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Shows how your retirement savings could grow over time with compound interest</p>
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
          </div>
          <CardDescription>Assuming 7% average annual return</CardDescription>
        </CardHeader>
        <CardContent>
          <LineChart 
            width={800} 
            height={400} 
            data={timelineData} 
            margin={{ top: 20, right: 30, left: 80, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="age" 
              label={{ 
                value: 'Age', 
                position: 'bottom',
                offset: 0
              }}
            />
            <YAxis 
              tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
              label={{ 
                value: 'Total Savings (USD)', 
                angle: -90, 
                position: 'insideLeft',
                offset: -60,
                style: { textAnchor: 'middle' }
              }}
            />
            <Tooltip 
              formatter={(value) => formatCurrency(value)}
              labelFormatter={(value) => `Age ${value}`}
            />
            <Line 
              type="monotone" 
              dataKey="savings" 
              stroke="#4f46e5"
              strokeWidth={2}
            />
          </LineChart>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 justify-center">
            <CardTitle>Estimated Monthly Retirement Income</CardTitle>
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-gray-500" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Estimated monthly income during retirement using the 4% withdrawal rule and estimated Social Security benefits</p>
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
          </div>
          <CardDescription className="text-center">Based on the 4% annual withdrawal rule</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-4xl font-bold">
                {formatCurrency(totalMonthlyIncome)}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Total Monthly Income
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="text-center">
                <p className="text-xl font-semibold">
                  {formatCurrency(investmentMonthlyIncome)}
                </p>
                <p className="text-sm text-gray-500">
                  From Investments
                </p>
              </div>
              
              {includeSocialSecurity && (
                <div className="text-center">
                  <p className="text-xl font-semibold">
                    {formatCurrency(socialSecurityBenefit)}
                  </p>
                  <p className="text-sm text-gray-500">
                    Estimated Social Security
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RetirementCalculator;