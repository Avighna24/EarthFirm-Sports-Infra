/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CourtConfiguration } from '../types';
import { SPORT_PRESETS, SURFACE_MATERIALS, SUB_BASES, SMART_FEATURES } from '../constants';
import { Receipt, HardHat, PieChart as PieIcon } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

interface CostEstimatorProps {
  config: CourtConfiguration;
}

export const CostEstimator: React.FC<CostEstimatorProps> = ({ config }) => {
  const { sportType, length, width, surfaceMaterial, subbase, selectedSmartFeatures } = config;

  // Calculators
  const areaSqFt = length * width;

  const sportDetails = SPORT_PRESETS[sportType];
  const surfaceDetails = SURFACE_MATERIALS[surfaceMaterial];
  const subbaseDetails = SUB_BASES[subbase];

  // Base material costs
  const surfaceCost = areaSqFt * surfaceDetails.costPerSqFt;
  const subbaseCost = areaSqFt * subbaseDetails.costPerSqFt;

  // Smart features aggregate
  const smartFeaturesCost = selectedSmartFeatures.reduce((acc, featId) => {
    const feat = SMART_FEATURES.find(f => f.id === featId);
    return acc + (feat ? feat.cost : 0);
  }, 0);

  // Markings, fitting equipment (nets, poles) - simple standard metric
  const markingAndFittings = 120000 + (sportDetails.basePricePerSqFt * areaSqFt * 0.15);

  // Professional installation labor cost: ₹180 per sqft + fixed base of ₹250000
  const installationLabor = 250000 + (areaSqFt * 180);

  const totalEstimatedCost = surfaceCost + subbaseCost + smartFeaturesCost + markingAndFittings + installationLabor;

  // Recharts Chart Specific Data (Filtered to ignore 0-value segments gracefully)
  const chartData = [
    { name: 'Sub-structure', value: Math.round(subbaseCost), color: '#3F3F46' }, // Dark metallic stone (Zinc-700)
    { name: 'Surface layering', value: Math.round(surfaceCost), color: '#8A9A86' }, // Soft Sage (Brand-Sage)
    { name: 'Nets & Markings', value: Math.round(markingAndFittings), color: '#71717A' }, // Slate gray (Zinc-500)
    ...(smartFeaturesCost > 0 ? [{ name: 'Premium Tech', value: Math.round(smartFeaturesCost), color: '#D97706' }] : []), // Amber accent for optional high-tech
    { name: 'Machinery & Labor', value: Math.round(installationLabor), color: '#18181B' } // Carbon black (Zinc-900)
  ];

  // Custom tooltips for Recharts hover state
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.value / totalEstimatedCost) * 100).toFixed(1);
      return (
        <div className="bg-zinc-900 text-white text-[11px] p-2 rounded-xl font-mono shadow-xl border border-zinc-700/50">
          <p className="font-sans font-bold text-zinc-100">{data.name}</p>
          <p className="text-brand-sage font-black mt-0.5">₹{data.value.toLocaleString('en-IN')}</p>
          <p className="text-zinc-400 text-[10px] mt-0.5">{percentage}% of total</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border border-stone-200/60 rounded-3xl p-6 shadow-md text-brand-stone font-sans">
      
      {/* Head */}
      <div className="flex items-center justify-between border-b border-stone-100 pb-4 mb-5">
        <div className="flex items-center gap-2">
          <Receipt className="h-5 w-5 text-brand-sage" />
          <h3 className="font-bold text-base tracking-tight font-serif text-brand-stone select-none">Project Consultation</h3>
        </div>
      </div>

      <div className="bg-brand-cream/70 rounded-2xl p-6 border border-stone-100 mb-6 flex flex-col items-center text-center">
        <h4 className="text-xl font-bold text-brand-stone mb-2">Ready to Start?</h4>
        <p className="text-sm text-stone-600 mb-6">Request a personalized consultation with our engineering team to receive a tailored project proposal.</p>
        <button 
          onClick={() => {
            const contactSection = document.getElementById('contact-us-section');
            contactSection?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="bg-brand-sage text-white px-6 py-3 rounded-xl font-bold"
        >
          Request Consultation
        </button>
      </div>

    </div>
  );
};
