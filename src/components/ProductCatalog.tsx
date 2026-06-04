/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SURFACE_MATERIALS } from '../constants';
import { SurfaceMaterialType } from '../types';
import { Layers, Shield, Award, Calendar, HelpCircle, HardHat, Sparkles } from 'lucide-react';

export const ProductCatalog: React.FC = () => {
  const [activeMaterialId, setActiveMaterialId] = useState<SurfaceMaterialType>('CANADIAN_MAPLE');
  const [hoveredLayerIndex, setHoveredLayerIndex] = useState<number | null>(null);

  const material = SURFACE_MATERIALS[activeMaterialId];

  return (
    <div className="bg-brand-cream py-16 text-brand-stone border-b border-stone-250/60" id="materials-portfolio">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <span className="text-xs uppercase tracking-[0.2em] text-brand-sage font-mono font-bold block mb-2">Layer Engineering Laboratory</span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-brand-stone mb-4">
            Material Specs <span className="italic font-light text-brand-sage">&amp; Lab Portfolio</span>
          </h2>
          <p className="text-stone-650 text-sm sm:text-base leading-relaxed">
            Elite sports performance starts deep beneath the finish line. We build fully engineered systems layer-by-layer with specialized shock pads, moisture shields, and organic polymer aggregate composites.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap gap-2 border-b border-stone-200 w-full mb-8">
          {Object.values(SURFACE_MATERIALS).map((mat) => {
            const isSelected = mat.id === activeMaterialId;
            return (
              <button
                key={mat.id}
                onClick={() => {
                  setActiveMaterialId(mat.id);
                  setHoveredLayerIndex(null);
                }}
                id={`catalog-tab-${mat.id}`}
                className={`pb-3 px-4 text-xs uppercase tracking-wider font-bold border-b-2 transition cursor-pointer ${
                  isSelected 
                    ? 'border-brand-sage text-brand-sage' 
                    : 'border-transparent text-stone-500 hover:text-brand-stone-light'
                }`}
              >
                {mat.name}
              </button>
            );
          })}
        </div>

        {/* Dynamic Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* LEFT COLUMN: SPEC AND SYSTEM DESCRIPTION (col-span-5) */}
          <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
            <div className="space-y-4 text-left">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase ${
                  material.category === 'Indoor' 
                    ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                    : 'bg-stone-200/50 text-brand-stone border border-stone-300/60'
                }`}>{material.category} Class System</span>
                <span className="text-stone-500 text-xs font-mono">Thickness: {material.thickness}</span>
              </div>

              <h3 className="text-2xl font-serif italic font-semibold tracking-tight text-brand-stone">{material.name} Specifications</h3>
              <p className="text-stone-600 text-sm leading-relaxed">{material.description}</p>

              {/* Bullet Features */}
              <div className="space-y-2.5 pt-4">
                {material.features.map((feature, i) => (
                  <div key={i} className="flex gap-2 text-stone-700 text-xs leading-relaxed">
                    <Award className="h-4 w-4 text-brand-sage flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quality Badges footer */}
            <div className="grid grid-cols-2 gap-4 pt-8 border-t border-stone-200 mt-6 lg:mt-0">
              <div className="bg-white/80 p-4 rounded-2xl border border-stone-200/60 shadow-sm">
                <Shield className="h-5 w-5 text-brand-sage mb-2" />
                <span className="text-[9px] text-stone-500 font-mono uppercase block">Warranty Standard</span>
                <span className="text-xs font-bold text-brand-stone">{material.warranty}</span>
              </div>
              <div className="bg-white/80 p-4 rounded-2xl border border-stone-200/60 shadow-sm">
                <Calendar className="h-5 w-5 text-brand-sage mb-2" />
                <span className="text-[9px] text-stone-500 font-mono uppercase block">Construction Period</span>
                <span className="text-xs font-bold text-brand-stone">5 - 12 Working Days</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: INTERACTIVE LAYER EXPLODER GRID (col-span-7) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/60 shadow-md flex flex-col justify-center">
            
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-brand-sage" />
                <span className="text-sm font-bold tracking-tight text-brand-stone font-mono">Sandwich Cross-Section specs</span>
              </div>
              <span className="text-[9px] text-stone-500 font-mono uppercase italic hidden sm:inline">Hover Layers to Explode Specifications</span>
            </div>

            {/* Exploder Stack */}
            <div className="space-y-2.5">
              {material.crossSectionLayers.map((layer, idx) => {
                const isHovered = hoveredLayerIndex === idx;
                return (
                  <div
                    key={idx}
                    onMouseEnter={() => setHoveredLayerIndex(idx)}
                    onMouseLeave={() => setHoveredLayerIndex(null)}
                    style={{
                      transform: isHovered ? 'scale(1.015) translateY(-1.5px)' : 'scale(1)'
                    }}
                    className={`p-3.5 rounded-xl border transition-all duration-300 cursor-pointer select-none relative ${
                      isHovered 
                        ? 'bg-brand-sage-soft border-brand-sage' 
                        : 'bg-brand-cream/60 border-stone-200/60'
                    }`}
                  >
                    <div className="flex justify-between items-center gap-4">
                      <div className="flex items-center gap-3">
                        <span className={`h-5 w-5 rounded font-mono text-[10px] font-bold flex items-center justify-center transition-colors ${
                          isHovered ? 'bg-brand-sage text-white' : 'bg-stone-200 text-stone-650'
                        }`}>{material.crossSectionLayers.length - idx}</span>
                        <div>
                          <span className="font-bold text-xs sm:text-sm text-brand-stone block">{layer.name}</span>
                          {isHovered && <span className="text-[11px] text-stone-600 mt-0.5 block leading-tight">{layer.desc}</span>}
                        </div>
                      </div>
                      <span className="text-[11px] font-mono text-stone-500 opacity-85 shrink-0">{layer.thickness}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Exploder dynamic caption fallback card */}
            <div className="mt-5 p-3.5 bg-brand-cream border border-stone-200 rounded-xl text-[11px] text-stone-600 text-center leading-normal">
              {hoveredLayerIndex !== null ? (
                <span>
                  Showing layer specifications of <strong className="text-brand-sage">{material.crossSectionLayers[hoveredLayerIndex].name}</strong>.
                </span>
              ) : (
                <span>
                  Tip: Rest your cursor on any structural layer block above to preview its sub-base composition and thickness properties.
                </span>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

