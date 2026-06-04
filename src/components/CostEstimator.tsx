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
          <h3 className="font-bold text-base tracking-tight font-serif text-brand-stone select-none">Project Financial Spec</h3>
        </div>
        <div className="text-[10px] font-mono bg-brand-cream/80 px-2.5 py-1 rounded-full text-brand-sage border border-stone-200/40 uppercase font-semibold select-none">
          Live Estimate
        </div>
      </div>

      {/* Main Total Big Price */}
      <div className="bg-brand-cream/70 rounded-2xl p-5 border border-stone-100 mb-6 flex flex-col items-center text-center">
        <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500 mb-1 block">Project Budget Overview</span>
        <span className="text-3xl sm:text-4xl font-bold text-brand-sage font-mono animate-pulse">
          ₹{Math.round(totalEstimatedCost).toLocaleString('en-IN')}
        </span>
        <span className="text-[11px] text-stone-500 mt-2 flex items-center gap-1.5 justify-center">
          <HardHat className="h-3.5 w-3.5 text-brand-sage" />
          Est. Custom Earthwork &amp; Setup included
        </span>
      </div>

      {/* 📊 RECHARTS REAL-TIME DONUT COST BREAKDOWN */}
      <div className="border border-stone-150 rounded-2xl p-4 bg-stone-50/50 mb-6">
        <div className="flex items-center gap-1.5 mb-3">
          <PieIcon className="h-4 w-4 text-brand-sage" />
          <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 font-bold">Dynamic Cost Breakdown</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          
          {/* Donut Chart Canvas Container (5 cols) */}
          <div className="sm:col-span-5 h-[120px] w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={36}
                  outerRadius={50}
                  paddingAngle={3}
                  dataKey="value"
                  animationDuration={600}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Absolute Label inside Donut Hole */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
              <span className="text-[8px] font-mono uppercase text-stone-400 font-bold leading-none">Estimate</span>
              <span className="text-[13px] font-mono text-zinc-900 font-extrabold mt-0.5">Split</span>
            </div>
          </div>

          {/* Color-Coded Micro Legend with Live Percentages (7 cols) */}
          <div className="sm:col-span-7 space-y-1.5 text-[11px]">
            {chartData.map((item, index) => {
              const pct = ((item.value / totalEstimatedCost) * 100).toFixed(1);
              return (
                <div key={item.name} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 truncate">
                    <span 
                      className="h-2 w-2 rounded-full shrink-0" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-stone-600 truncate font-medium">{item.name}</span>
                  </div>
                  <span className="font-mono text-brand-stone font-bold text-xs shrink-0">
                    {pct}%
                  </span>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* Itemized list */}
      <div className="space-y-4 mb-6">
        {/* Dimensions info */}
        <div className="flex justify-between items-center text-xs text-stone-500 border-b border-stone-100 pb-2">
          <span>Active Dimension Area</span>
          <span className="font-mono text-brand-stone font-semibold">
            {length} &times; {width} ({areaSqFt.toLocaleString()} sq ft)
          </span>
        </div>

        {/* Part 1: Sub-Base Foundation */}
        <div className="flex justify-between items-start text-sm">
          <div>
            <span className="font-bold text-xs sm:text-sm block text-brand-stone">{subbaseDetails.name}</span>
            <span className="text-[11px] text-stone-500 block max-w-[240px] leading-tight">
              Sub-structure grading &amp; slab compression (₹{subbaseDetails.costPerSqFt.toLocaleString('en-IN')}/sq ft)
            </span>
          </div>
          <span className="font-mono font-bold text-xs sm:text-sm text-brand-stone-light">
            ₹{Math.round(subbaseCost).toLocaleString('en-IN')}
          </span>
        </div>

        {/* Part 2: Surface Architecture */}
        <div className="flex justify-between items-start text-sm">
          <div>
            <span className="font-bold text-xs sm:text-sm block text-brand-stone">{surfaceDetails.name}</span>
            <span className="text-[11px] text-stone-500 block max-w-[240px] leading-tight">
              Premium surface material layering (₹{surfaceDetails.costPerSqFt.toLocaleString('en-IN')}/sq ft)
            </span>
          </div>
          <span className="font-mono font-bold text-xs sm:text-sm text-brand-stone-light">
            ₹{Math.round(surfaceCost).toLocaleString('en-IN')}
          </span>
        </div>

        {/* Part 3: Line markings, game standards */}
        <div className="flex justify-between items-start text-sm">
          <div>
            <span className="font-bold text-xs sm:text-sm block text-brand-stone">Precision Sport Borders</span>
            <span className="text-[11px] text-stone-500 block max-w-[240px] leading-tight">
              Accurate lines paint, anchors, net fixtures, post hooks
            </span>
          </div>
          <span className="font-mono font-bold text-xs sm:text-sm text-brand-stone-light">
            ₹{Math.round(markingAndFittings).toLocaleString('en-IN')}
          </span>
        </div>

        {/* Part 4: Smart upgrades (Iconic tech element) */}
        <div className="flex justify-between items-start text-sm">
          <div>
            <span className="font-bold text-xs sm:text-sm block text-brand-stone">Iconic Premium Upgrades</span>
            <span className="text-[11px] text-stone-505 block max-w-[240px] leading-tight">
              {selectedSmartFeatures.length === 0 
                ? 'No high-end equipment chosen' 
                : `${selectedSmartFeatures.length} premium systems selected`}
            </span>
          </div>
          <span className="font-mono font-bold text-xs sm:text-sm text-brand-sage">
            {smartFeaturesCost > 0 ? `+₹${smartFeaturesCost.toLocaleString('en-IN')}` : '₹0'}
          </span>
        </div>

        {/* Part 5: Labor fees */}
        <div className="flex justify-between items-start text-sm">
          <div>
            <span className="font-bold text-xs sm:text-sm block text-brand-stone font-sans">Labor &amp; Heavy Machinery</span>
            <span className="text-[11px] text-stone-500 block max-w-[240px] leading-tight">
              Civil engineering team, concrete mixers, laser leveling
            </span>
          </div>
          <span className="font-mono font-bold text-xs sm:text-sm text-brand-stone-light">
            ₹{Math.round(installationLabor).toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Helpful quote contextual notice */}
      <div className="p-4 bg-brand-cream/80 text-[11px] leading-relaxed text-stone-600 rounded-2xl border border-stone-200/60 mb-2">
        <span className="font-bold text-brand-stone block mb-1">Architectural Disclaimer:</span>
        These values are live approximations tailored for typical grounds in Indian subcontinent regions. Terrain slope, rock formations, soil moisture, and specific drainage layouts will govern absolute earthwork rates. Request an official consultation below to freeze a final guaranteed catalog quote.
      </div>
    </div>
  );
};
