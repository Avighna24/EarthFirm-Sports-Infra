/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Star, ShieldCheck, Quote, MapPin, Award } from 'lucide-react';

interface Testimonial {
  id: number;
  clientName: string;
  role: string;
  organization: string;
  location: string;
  projectType: string;
  rating: number;
  feedback: string;
  avatarLetter: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    clientName: "Rajesh Vardhan",
    role: "Director of Athletics & Facilities",
    organization: "The Royal Heritage International School",
    location: "Indore, MP",
    projectType: "Canadian Maple Indoor Basketball Court",
    rating: 5,
    feedback: "Earthfirm built our dream indoor Canadian Maple court in exactly 11 working days after the subbase dry period. The craftsmanship is world-class. Sound absorption from the anti-vibration shock pads is excellent, and the basketball bounce is uniform across every single inch.",
    avatarLetter: "R"
  },
  {
    id: 2,
    clientName: "Colonel S. K. Nair",
    role: "General Secretary & Chief Trustee",
    organization: "Southern Command Officers Club",
    location: "Pune, MH",
    projectType: "ITF Tournament Multi-Sport Acrylic Arena",
    rating: 5,
    feedback: "The level of precision in their application of cushion acrylic is phenomenal. They leveled the asphalt base using lasers, and the anti-glare finish with high-gloss border markings is highly praised by our competitive officers. Truly highly reliable and professional.",
    avatarLetter: "S"
  },
  {
    id: 3,
    clientName: "Vikram Sen",
    role: "Managing Director",
    organization: "Indore Greens Sports Club",
    location: "Indore, MP",
    projectType: "Professional Composite Football Turf",
    rating: 5,
    feedback: "From customized sub-base slope design for heavy monsoons to flawless seaming joint seaming tape adhesion, Earthfirm proved their sports engineering mastery. The silica sand and rubber infill dispersion keeps the turf grass extremely uniform and soft.",
    avatarLetter: "V"
  }
];

export function Testimonials() {
  return (
    <section className="bg-brand-cream/30 py-16 text-brand-stone border-b border-stone-200/60" id="client-testimonials">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.2em] text-brand-sage font-mono font-bold inline-flex items-center gap-1.5 mb-2">
            <Award className="h-4 w-4 text-brand-sage" />
            CLIENT TRUST & VALIDATION
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-brand-stone mb-4">
            Constructed for Champions, Certified by Authorities
          </h2>
          <p className="text-stone-550 text-sm sm:text-base leading-relaxed">
            Read direct feedback from corporate school athletic directors, championship clubs, and residential community boards across the subcontinent who chose Earthfirm's meticulous civil engineering.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial, idx) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.6, delay: idx * 0.15, ease: 'easeOut' }}
              className="bg-white border border-stone-200/60 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-sm transition-all duration-300 hover:shadow-md hover:border-brand-sage/20 relative"
            >
              <div>
                {/* Accent design bubble */}
                <div className="absolute top-6 right-6 text-stone-205/60 pointer-events-none">
                  <Quote className="h-10 w-10 text-stone-100 rotate-180" />
                </div>

                {/* Rating Stars */}
                <div className="flex items-center gap-0.5 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-[10px] text-stone-400 font-mono font-bold ml-2">5.0 SPEC</span>
                </div>

                {/* Feedback Body text */}
                <p className="text-stone-600 text-xs sm:text-[13px] leading-relaxed mb-6 font-sans italic">
                  "{testimonial.feedback}"
                </p>
              </div>

              {/* Client credentials footer */}
              <div className="border-t border-stone-100 pt-4 mt-auto">
                <div className="flex items-center gap-3">
                  {/* Initials badge */}
                  <div className="h-10 w-10 rounded-full bg-brand-sage/10 text-brand-sage font-mono font-extrabold flex items-center justify-center text-sm shrink-0 uppercase border border-brand-sage/20">
                    {testimonial.avatarLetter}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-serif font-black text-brand-stone truncate">
                        {testimonial.clientName}
                      </span>
                      <ShieldCheck className="h-4.5 w-4.5 text-brand-sage shrink-0" />
                    </div>
                    <span className="text-[10px] text-stone-500 font-medium block truncate max-w-[200px]">
                      {testimonial.role}
                    </span>
                    <span className="text-[10px] text-brand-sage font-semibold font-mono block truncate max-w-[200px] uppercase tracking-wider mt-0.5">
                      {testimonial.organization}
                    </span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-stone-50">
                  <span className="text-[9px] font-mono font-bold bg-brand-cream/80 text-brand-stone border border-stone-150 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-brand-sage shrink-0" />
                    {testimonial.location}
                  </span>
                  <span className="text-[9px] font-mono font-bold bg-stone-50 text-stone-500 border border-stone-150 px-2 py-0.5 rounded-full">
                    {testimonial.projectType}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quality Audit Stamp row */}
        <div className="mt-12 p-4 rounded-2xl bg-brand-cream/60 border border-stone-200/50 flex flex-col md:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <div className="flex items-center gap-2 text-center md:text-left">
            <span className="h-2 w-2 rounded-full bg-brand-sage animate-ping shrink-0" />
            <span>Certified compliance: All courts built to strictly exceed governing sports board dimensional specifications (ITF, FIBA, FIFA, BCCI).</span>
          </div>
          <span className="font-mono text-[9px] text-brand-stone font-black uppercase tracking-wider border border-stone-300 px-3 py-1 rounded-full whitespace-nowrap bg-white">
            ★ verified contractor
          </span>
        </div>

      </div>
    </section>
  );
}
