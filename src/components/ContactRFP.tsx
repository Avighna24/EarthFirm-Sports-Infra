/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CourtConfiguration } from '../types';
import { SPORT_PRESETS, SURFACE_MATERIALS, SUB_BASES, SMART_FEATURES } from '../constants';
import { Mail, Phone, MapPin, Sparkles, Clock, CheckCircle2, FileText, Download, Briefcase, Landmark } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { saveDocument } from './firebase';

interface ContactRFPProps {
  config: CourtConfiguration;
}

export const ContactRFP: React.FC<ContactRFPProps> = ({ config }) => {
  // Input states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [intendedUse, setIntendedUse] = useState<'Residential' | 'Commercial' | 'Educational' | 'Professional'>('Residential');
  const [timeline, setTimeline] = useState('Immediate (Next 30 days)');
  const [additionalNotes, setAdditionalNotes] = useState('');

  // Submit flow states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [proposalSubmitted, setProposalSubmitted] = useState(false);
  const [hashCode, setHashCode] = useState('');
  const [validationError, setValidationError] = useState('');

  // Calculations for submitted brief
  const areaSqFt = config.length * config.width;
  const sportDetails = SPORT_PRESETS[config.sportType];
  const surfaceDetails = SURFACE_MATERIALS[config.surfaceMaterial];
  const subbaseDetails = SUB_BASES[config.subbase];

  const surfaceCost = areaSqFt * surfaceDetails.costPerSqFt;
  const subbaseCost = areaSqFt * subbaseDetails.costPerSqFt;
  const smartFeaturesCost = config.selectedSmartFeatures.reduce((acc, featId) => {
    const feat = SMART_FEATURES.find(f => f.id === featId);
    return acc + (feat ? feat.cost : 0);
  }, 0);
  const markingAndFittings = 2500 + (sportDetails.basePricePerSqFt * areaSqFt * 0.15);
  const installationLabor = 5000 + (areaSqFt * 3.80);
  const totalCost = surfaceCost + subbaseCost + smartFeaturesCost + markingAndFittings + installationLabor;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !location) {
      setValidationError('Please compile the required client fields to calculate proposal!');
      return;
    }
    setValidationError('');

    setIsSubmitting(true);
    const randomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const code = `EFIC-${config.sportType.substring(0,3)}-${randomId}`;
    setHashCode(code);

    try {
      await saveDocument('interactive_consultations', code, {
        sportType: config.sportType,
        length: Number(config.length),
        width: Number(config.width),
        surfaceMaterial: config.surfaceMaterial,
        subbase: config.subbase,
        selectedSmartFeatures: config.selectedSmartFeatures || [],
        fullName: fullName,
        email: email,
        phone: phone || null,
        location: location,
        intendedUse: intendedUse,
        timeline: timeline,
        additionalNotes: additionalNotes || null,
        totalCost: Number(totalCost),
        hashCode: code
      });
    } catch (err) {
      console.error('Error saving interactive design RFP:', err);
    } finally {
      setIsSubmitting(false);
      setProposalSubmitted(true);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-brand-cream py-16 text-brand-stone border-b border-stone-250/60" id="assessment-rfp">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {!proposalSubmitted ? (
          <div className="bg-white rounded-3xl border border-stone-200/60 p-6 sm:p-10 shadow-md relative overflow-hidden">
            {/* Decorative layout elements */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-brand-sage/5 rounded-full blur-2xl pointer-events-none" />

            {/* Header */}
            <div className="mb-8 border-b border-stone-105 pb-5">
              <span className="text-xs uppercase tracking-[0.2em] text-brand-sage font-mono font-bold block mb-1">CONTRACT RFP ENGAGEMENT</span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-brand-stone mb-3">Request Arena Consultation</h2>
              <p className="text-stone-550 text-xs sm:text-sm leading-normal">
                Your configurations from the Interactive Customizer above are automatically attached to this request. Fill in your project location and contact parameters, and our civil design engineers will evaluate soil specifics and outline a final contract.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Active configuration snapshot */}
              <div className="p-4 bg-brand-cream rounded-2xl border border-stone-150 text-xs sm:text-sm text-stone-600">
                <span className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-widest block mb-1">Configuration attached</span>
                <div className="flex flex-wrap gap-4 justify-between items-center">
                  <div>
                    <span className="text-brand-stone font-bold block text-base leading-tight">{sportDetails.name}</span>
                    <span className="text-xs font-semibold text-stone-500">{surfaceDetails.name} &times; {subbaseDetails.name}</span>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-stone-400 block text-[9px] font-mono leading-none uppercase">Precalculated Area</span>
                    <span className="font-mono text-brand-sage text-base sm:text-lg font-bold">{config.length}&apos; &times; {config.width}&apos; ({areaSqFt.toLocaleString()} sq ft)</span>
                  </div>
                </div>
              </div>

              {/* Client Inputs fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Name */}
                <div>
                  <label htmlFor="rfp-name" className="text-xs font-mono font-bold text-stone-550 uppercase block mb-1.5">Full Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    id="rfp-name"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full bg-brand-cream/50 border border-stone-200 focus:border-brand-sage focus:bg-white rounded-xl px-4 py-3 text-brand-stone text-sm focus:outline-none transition"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="rfp-email" className="text-xs font-mono font-bold text-stone-550 uppercase block mb-1.5">Email Address <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    id="rfp-email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. john@universe.com"
                    className="w-full bg-brand-cream/50 border border-stone-200 focus:border-brand-sage focus:bg-white rounded-xl px-4 py-3 text-brand-stone text-sm focus:outline-none transition"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="rfp-phone" className="text-xs font-mono font-bold text-stone-550 uppercase block mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    id="rfp-phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +1 (555) 012-3456"
                    className="w-full bg-brand-cream/50 border border-stone-200 focus:border-brand-sage focus:bg-white rounded-xl px-4 py-3 text-brand-stone text-sm focus:outline-none transition"
                  />
                </div>

                {/* Location */}
                <div>
                  <label htmlFor="rfp-loc" className="text-xs font-mono font-bold text-stone-555 uppercase block mb-1.5">Project Location / Zip <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    id="rfp-loc"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Brooklyn, NY"
                    className="w-full bg-brand-cream/50 border border-stone-200 focus:border-brand-sage focus:bg-white rounded-xl px-4 py-3 text-brand-stone text-sm focus:outline-none transition"
                  />
                </div>

                {/* Intended Use Dropdown */}
                <div>
                  <label htmlFor="rfp-use" className="text-xs font-mono font-bold text-stone-550 uppercase block mb-1.5 font-bold">Arena Setting</label>
                  <select
                    id="rfp-use"
                    value={intendedUse}
                    onChange={(e) => setIntendedUse(e.target.value as any)}
                    className="w-full bg-brand-cream/50 border border-stone-200 focus:border-brand-sage focus:bg-white rounded-xl px-4 py-3 text-brand-stone text-sm focus:outline-none cursor-pointer transition select-none"
                  >
                    <option value="Residential">Residential Backyard Matchbox</option>
                    <option value="Commercial">Commercial / Club Facility</option>
                    <option value="Educational">Educational Gymnasium / Park</option>
                    <option value="Professional">Professional Tournament Arena</option>
                  </select>
                </div>

                {/* Construction Timeline dropdown */}
                <div>
                  <label htmlFor="rfp-timeline" className="text-xs font-mono font-bold text-stone-550 uppercase block mb-1.5 font-bold">Planned Timeline</label>
                  <select
                    id="rfp-timeline"
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    className="w-full bg-brand-cream/50 border border-stone-200 focus:border-brand-sage focus:bg-white rounded-xl px-4 py-3 text-brand-stone text-sm focus:outline-none cursor-pointer transition select-none"
                  >
                    <option value="Immediate (Next 30 days)">Immediate Construction (Next 30 days)</option>
                    <option value="Within 3 months">Standard (Within 3 months)</option>
                    <option value="Planning/Budget phase">Planning / Conceptual Budget exploration</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label htmlFor="rfp-notes" className="text-xs font-mono font-bold text-stone-550 uppercase block mb-1.5 font-bold">Geological Soil Notes & Custom Requests</label>
                <textarea
                  id="rfp-notes"
                  rows={3}
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="Tell us about trees nearby, slope levels, underground piping, or specific color layout guidelines..."
                  className="w-full bg-brand-cream/50 border border-stone-200 focus:border-brand-sage focus:bg-white rounded-xl px-4 py-3 text-brand-stone text-sm focus:outline-none transition resize-none"
                />
              </div>

              {validationError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-mono text-center">
                  {validationError}
                </div>
              )}

              {/* Action Button */}
              <button
                type="submit"
                id="rfp-submit-btn"
                disabled={isSubmitting}
                className="w-full py-4 text-center text-sm font-bold tracking-wider uppercase rounded-xl bg-brand-sage hover:bg-brand-sage-dark text-white disabled:bg-stone-200 disabled:text-stone-400 transition cursor-pointer flex justify-center items-center gap-2 shadow-md"
              >
                {isSubmitting ? (
                  <>
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Calculating structural load metrics...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 text-white" />
                    Request Comprehensive Arena Assessment
                  </>
                )}
              </button>

            </form>
          </div>
        ) : (
          /* CONGRATULATIONS SUBMITTED: GORGEOUS PRINTABLE CONCEPT CERTIFICATE BRIEF */
          <div className="bg-white rounded-3xl border border-stone-200/60 p-6 sm:p-10 shadow-lg space-y-8 animate-fade-in print:bg-white print:text-zinc-950 print:border-none print:shadow-none">
            
            {/* Header banner */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-100 pb-5 print:border-zinc-300">
              <div className="flex items-center gap-3">
                <BrandLogo lightMode={true} iconSize={36} showText={false} className="print:text-zinc-800" />
                <div>
                  <h2 className="text-xl font-serif font-bold tracking-tight text-brand-stone">Earthfirm Sports Infrastructures</h2>
                  <span className="text-[9px] font-mono text-stone-500 uppercase tracking-widest block font-bold leading-none">Engineering Spec Brief</span>
                </div>
              </div>
              <div className="text-stone-600 font-mono text-xs text-right print:text-zinc-600 bg-brand-cream px-3 py-1.5 rounded-xl border border-stone-201/40 print:bg-zinc-100">
                <span className="text-[8px] uppercase tracking-wider block text-stone-400">Design ID Token</span>
                <strong className="text-brand-sage font-extrabold print:text-zinc-800">{hashCode}</strong>
              </div>
            </div>

            {/* Assessment Statement */}
            <div className="flex gap-4 items-start p-5 bg-brand-sage-soft text-brand-stone rounded-2xl border border-brand-sage/10 print:bg-zinc-50 print:border-zinc-300 print:text-zinc-900">
              <CheckCircle2 className="h-6 w-6 text-brand-sage shrink-0 mt-0.5 print:text-emerald-600" />
              <div>
                <span className="text-sm font-bold block mb-1 text-brand-sage">Proposal registered successfully</span>
                <span className="text-stone-600 text-xs leading-relaxed block">
                  Dear <strong>{fullName}</strong>, your request for custom civil construction evaluation in <strong>{location}</strong> has been secured. Our lead structural engineer will reach you at <strong>{email}</strong> within 12 hours with structural schematics.
                </span>
              </div>
            </div>

            {/* Full Specifications Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-stone-105 print:border-zinc-200">
              
              {/* Core Physical System Details */}
              <div className="space-y-4">
                <h3 className="text-xs uppercase tracking-wider text-stone-500 font-mono font-bold block">01. Physical Spec Metrics</h3>
                
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between border-b border-stone-100 pb-1.5 print:border-zinc-200">
                    <span className="text-stone-550">Sport Layout Choice</span>
                    <span className="font-bold text-brand-stone print:text-zinc-900">{sportDetails.name}</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-100 pb-1.5 print:border-zinc-200">
                    <span className="text-stone-550">Dimensions Scale</span>
                    <span className="font-bold text-brand-stone print:text-zinc-900">{config.length}&apos; x {config.width}&apos;</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-100 pb-1.5 print:border-zinc-200">
                    <span className="text-stone-550">Total Play Surface Area</span>
                    <span className="font-mono font-bold text-brand-stone print:text-zinc-900">{areaSqFt.toLocaleString()} sq. ft</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-100 pb-1.5 print:border-zinc-200">
                    <span className="text-stone-550">Upper Cushion Floor</span>
                    <span className="font-bold text-brand-stone print:text-zinc-900">{surfaceDetails.name}</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-100 pb-1.5 print:border-zinc-200">
                    <span className="text-stone-550">Sub-base Civil Aggregate</span>
                    <span className="font-bold text-brand-stone print:text-zinc-900">{subbaseDetails.name}</span>
                  </div>
                </div>
              </div>

              {/* Client Info Summary */}
              <div className="space-y-4">
                <h3 className="text-xs uppercase tracking-wider text-stone-500 font-mono font-bold block">02. Client & Timeline Parameters</h3>
                
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between border-b border-stone-100 pb-1.5 print:border-zinc-200">
                    <span className="text-stone-545">Contract Requester</span>
                    <span className="font-bold text-brand-stone print:text-zinc-900">{fullName}</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-100 pb-1.5 print:border-zinc-200">
                    <span className="text-stone-545">Intended Setting</span>
                    <span className="font-bold text-brand-stone print:text-zinc-900">{intendedUse} Setting</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-100 pb-1.5 print:border-zinc-200">
                    <span className="text-stone-545">Region Registry</span>
                    <span className="font-bold text-brand-stone print:text-zinc-900">{location}</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-100 pb-1.5 print:border-zinc-200">
                    <span className="text-stone-545">Expected Mobilization</span>
                    <span className="font-bold text-brand-stone print:text-zinc-900">{timeline}</span>
                  </div>
                  {phone && (
                    <div className="flex justify-between border-b border-stone-100 pb-1.5 print:border-zinc-200">
                      <span className="text-stone-545">Inbound Telecom</span>
                      <span className="font-bold text-brand-stone print:text-zinc-900">{phone}</span>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Smart Addons list */}
            {config.selectedSmartFeatures.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs uppercase tracking-wider text-stone-500 font-mono font-bold block">03. Integrated Iconic Smart Upgrades</h3>
                <div className="flex flex-wrap gap-2">
                  {config.selectedSmartFeatures.map(featId => {
                    const feat = SMART_FEATURES.find(f => f.id === featId);
                    if (!feat) return null;
                    return (
                      <span key={featId} className="px-2.5 py-1 rounded bg-brand-cream border border-stone-200 text-xs text-stone-700 font-semibold tracking-tight print:bg-zinc-100 print:border-zinc-300 print:text-zinc-800 font-mono">
                        {feat.name}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Price section */}
            <div className="bg-brand-cream p-6 rounded-2xl border border-stone-200/40 text-center space-y-1 print:bg-zinc-100 print:border-zinc-300">
              <span className="text-[10px] font-mono tracking-widest text-stone-500 uppercase block">AGGREGATE CONTRACT ESTIMATE RANGE</span>
              <span className="text-3xl font-bold text-brand-sage font-mono print:text-zinc-900">
                ₹{Math.round(totalCost * 0.95).toLocaleString('en-IN')} - ₹{Math.round(totalCost * 1.05).toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-stone-500 block leading-normal pt-1.5 font-sans"> Includes heavy aggregate soil clearing, concrete framing pads, precision sport coatings lining, and structural engineers site assessment.</span>
            </div>

            {/* Notes if present */}
            {additionalNotes && (
              <div className="p-4 bg-brand-cream/40 text-xs text-stone-600 rounded-xl border border-stone-200/60 print:bg-white print:border-zinc-300">
                <span className="font-bold text-brand-stone block mb-1">Geological / Client Notes:</span>
                &quot;{additionalNotes}&quot;
              </div>
            )}

            {/* Actions for customer */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-stone-105 print:hidden justify-end">
              <button
                onClick={() => setProposalSubmitted(false)}
                id="btn-quote-reconfig"
                className="px-5 py-2.5 rounded-xl border border-stone-200 text-xs hover:bg-brand-cream transition cursor-pointer text-center text-stone-605 font-bold"
              >
                Modify Configuration
              </button>
              <button
                onClick={handlePrint}
                id="btn-quote-print"
                className="px-5 py-2.5 rounded-xl bg-brand-sage text-white hover:bg-brand-sage-dark text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 shadow"
              >
                <Download className="h-3.5 w-3.5 text-white" />
                Print Specification Brief
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
