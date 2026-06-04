/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SportDetails, SurfaceMaterialDetails, SmartFeature, SubbaseDetails } from './types';

export const SPORT_PRESETS: Record<string, SportDetails> = {
  BASKETBALL: {
    id: 'BASKETBALL',
    name: 'Basketball Court',
    tagline: 'Precision Bounce & Iconic court aesthetics',
    description: 'Engage in fluid tournament play. Optimized for shock absorption, vertical bounce consistency, and anti-slip surface friction.',
    minDimensions: { length: 30, width: 30 }, // Half court
    defaultDimensions: { length: 94, width: 50 }, // Full NBA Court
    maxDimensions: { length: 120, width: 80 },
    iconName: 'Dribbble',
    basePricePerSqFt: 290.00,
  },
  TENNIS: {
    id: 'TENNIS',
    name: 'Tennis Court',
    tagline: 'Professional pace control & UV resistance',
    description: 'Designed to deliver true bounce velocities and high traction with multiple acrylic layers for Joint-Safe cushioning properties.',
    minDimensions: { length: 60, width: 30 },
    defaultDimensions: { length: 120, width: 60 }, // Full Standard Court
    maxDimensions: { length: 140, width: 70 },
    iconName: 'Activity',
    basePricePerSqFt: 350.00,
  },
  PICKLEBALL: {
    id: 'PICKLEBALL',
    name: 'Pickleball Arena',
    tagline: 'The fastest-growing sport in modern setups',
    description: 'Perfect traction, precise lines, and customized acoustics for high-energy fast-paced play. Suitable for backyard or commercial parks.',
    minDimensions: { length: 44, width: 20 }, // Standard singles/doubles size
    defaultDimensions: { length: 60, width: 30 }, // Recommended boundary size
    maxDimensions: { length: 80, width: 44 },
    iconName: 'Zap',
    basePricePerSqFt: 330.00,
  },
  FOOTBALL: {
    id: 'FOOTBALL',
    name: 'Football Turf',
    tagline: 'FIFA-Grade performance under all climates',
    description: 'Engineered multi-layered synthetic turf featuring high pile density, dynamic sub-drainage, and environment-safe organic infill materials.',
    minDimensions: { length: 80, width: 40 },
    defaultDimensions: { length: 150, width: 75 }, // Small-sided/Futsal field
    maxDimensions: { length: 360, width: 160 },
    iconName: 'Play',
    basePricePerSqFt: 450.00,
  },
  TRACK_FIELD: {
    id: 'TRACK_FIELD',
    name: 'Track & Running Fields',
    tagline: 'Seamless polyurethane sprint systems',
    description: 'High elasticity spikes-resistant surfaces that yield energy recovery for elite performance runners. Ultimate weatherproof construction.',
    minDimensions: { length: 100, width: 12 },
    defaultDimensions: { length: 200, width: 24 },
    maxDimensions: { length: 400, width: 48 },
    iconName: 'Flame',
    basePricePerSqFt: 510.00,
  },
  GYM: {
    id: 'GYM',
    name: 'Multi-Purpose Gym',
    tagline: 'Elite indoor workout & athletic floorings',
    description: 'Superior heavy-grade rubber and composite system designed for high loading, dynamic impact absorption, and acoustic dampening under weight loads.',
    minDimensions: { length: 20, width: 20 },
    defaultDimensions: { length: 50, width: 30 },
    maxDimensions: { length: 100, width: 60 },
    iconName: 'Dumbbell',
    basePricePerSqFt: 310.00,
  },
  CRICKET: {
    id: 'CRICKET',
    name: 'Box Cricket',
    tagline: 'High-density synthetic premium box cricket turf',
    description: 'Professional sub-base engineering with tournament-grade high-bounce box cricket turf. Designed for highly accurate ball bounce and consistent spin response.',
    minDimensions: { length: 40, width: 10 },
    defaultDimensions: { length: 80, width: 12 },
    maxDimensions: { length: 120, width: 40 },
    iconName: 'Target',
    basePricePerSqFt: 380.00,
  },
  BADMINTON: {
    id: 'BADMINTON',
    name: 'Badminton Court',
    tagline: 'Professional BWF-grade non-slip court designs',
    description: 'Premium cushioned PVC overlay layers for elastic foot spring and shock absorption. Perfectly painted white outlines tailored for high-speed matches.',
    minDimensions: { length: 44, width: 20 },
    defaultDimensions: { length: 50, width: 25 },
    maxDimensions: { length: 70, width: 35 },
    iconName: 'Trophy',
    basePricePerSqFt: 320.00,
  }
};

export const SURFACE_MATERIALS: Record<string, SurfaceMaterialDetails> = {
  CANADIAN_MAPLE: {
    id: 'CANADIAN_MAPLE',
    name: 'Canadian Maple Hardwood',
    category: 'Indoor',
    description: 'The elite hardwood system certified for FIBA-compliant indoor arenas. Deeply polished, highly resilient multi-layered shock structure.',
    costPerSqFt: 1200.00,
    thickness: '22mm (7/8") Solid Maple',
    warranty: '15 Years Premium Guarantee',
    features: [
      'FIBA Approved',
      'Patented Air-Flex Subfloor Shock Pads',
      'Ultra-protective, non-yellowing sport polyurethane finish',
      'Perfect ball-bounce restitution (above 96%)'
    ],
    crossSectionLayers: [
      { name: 'Double Polyurethane Sport Armor', thickness: '1.2mm', desc: 'Satin gloss, anti-marking wear barrier' },
      { name: 'Select Grade MFMA Hard Maple Wood', thickness: '22mm', desc: 'Premium dense tongue-and-groove boards' },
      { name: 'Cushioned Plywood Subfloor Layer', thickness: '15mm', desc: 'Dynamic load distribution' },
      { name: 'Air-Flex Bio-foam Cushion Plates', thickness: '10mm', desc: 'Joint protection and acoustics absorption' },
      { name: 'Heavy Polyethylene Moisture Shield', thickness: '6mil', desc: 'Complete sub-base vapor barrier' }
    ]
  },
  PRO_ACRYLIC: {
    id: 'PRO_ACRYLIC',
    name: 'Pro-Acrylic Multi-Coat',
    category: 'Outdoor',
    description: 'Ultimate cushioned acrylic system with integrated microscopic silica aggregates. Exceptional pace, UV resistance, and vibrant custom colors.',
    costPerSqFt: 655.00,
    thickness: '8mm Multi-layer Composition',
    warranty: '10 Years Weatherproof Guarantee',
    features: [
      'Zero glare finish',
      'Anti-slippery wet/dry playability',
      'Integrated heavy-weight acrylic filler cushion sheets',
      'Zero fading under intense direct solar exposure'
    ],
    crossSectionLayers: [
      { name: 'Vibrant Acrylic Sport Lines', thickness: '0.1mm', desc: 'Heavy textured structural sports paint' },
      { name: 'High-Purity Pigment Surface Coats', thickness: '1.5mm', desc: 'UV resistant protective colors' },
      { name: 'Rubber-Filled Acrylic Cushion Layer', thickness: '4.0mm', desc: 'Flexible, high energy-return impact reducer' },
      { name: 'Squeegee Acrylic Resurfacer Base', thickness: '2.4mm', desc: 'Bridges pores, forms flawless bonding' },
      { name: 'Adhesive Concrete/Asphalt Primer', thickness: '0.5mm', desc: 'Full moisture seal and mechanical anchorage to sub-base' }
    ]
  },
  PP_TILES: {
    id: 'PP_TILES',
    name: 'Iconic Matrix Interlocking Tiles',
    category: 'All-Weather',
    description: 'Advanced copolymer polypropylene tiles with self-draining structural patterns and vertical/lateral shock-absorption joints.',
    costPerSqFt: 790.00,
    thickness: '16mm High-Impact Tiles',
    warranty: '12 Years UV & Durability Guarantee',
    features: [
      'Interlocking multi-point joints that eliminate thermal buckling',
      'Special honeycomb surface for instantly venting rainwater',
      'High impact resistance, supports intense weight and light vehicles',
      'Minimal sub-base preparation requirements'
    ],
    crossSectionLayers: [
      { name: 'Anti-Slip Polymeric Matrix Mesh', thickness: '3.0mm', desc: 'Highly textured top surface' },
      { name: 'High-Impact Copolymer Core', thickness: '13.0mm', desc: 'Contains UV inhibitors and severe impact-resistant lattice' },
      { name: 'Multi-directional Suspension Legs', thickness: 'Flexible Support', desc: 'Lateral expansion absorption and shock attenuation' }
    ]
  },
  COMPOSITE_TURF: {
    id: 'COMPOSITE_TURF',
    name: 'FIFA-Grade Organic Turf',
    category: 'All-Weather',
    description: 'Top-tier luxury synthetic grass. Packed with heavyweight, self-standing blades, coupled with a sub-base dynamic organic cooling infill.',
    costPerSqFt: 930.00,
    thickness: '40mm (1.5") Heavy Weight Pile',
    warranty: '10 Years FIFA Star Certification Standard',
    features: [
      'Engineered non-abrasive soft monofilament spine blades',
      'Bio-Cool environment-safe walnut shell and olive stone infill',
      'Heavy-duty double primary backing with anti-mold drainage pores',
      'Over 60 inches are drained per hour under rainstorms'
    ],
    crossSectionLayers: [
      { name: 'Soft UV-Inhibited Spine Blades', thickness: '40mm', desc: 'Mimics real blade blade strength and ball physics' },
      { name: 'Organic Geo-Infill Layer (Eco-friendly)', thickness: '18mm', desc: 'Maintains optimal surface cool and non-slip sliding traction' },
      { name: 'Primary Polypropylene Non-Woven backing', thickness: '5mm', desc: 'Secure tufting grid' },
      { name: 'Elastic Shockpad Underlayment (E-Layer)', thickness: '10mm', desc: 'Ultimate safety padding on aggregate layers' }
    ]
  }
};

export const SUB_BASES: Record<string, SubbaseDetails> = {
  POST_TENSION_CONCRETE: {
    id: 'POST_TENSION_CONCRETE',
    name: 'Premium Post-Tensioned Concrete',
    description: 'Monolithic concrete slab compressed under massive internal steel cable tension. Eliminates 99% of future structural settling cracks or level variations.',
    costPerSqFt: 1000.00,
    durability: 'Extreme - Over 50 Years lifespan',
    bestFor: 'Ultimate High-End Residential Basketball & Hard Tennis'
  },
  ASPHALT: {
    id: 'ASPHALT',
    name: 'Super-Dense Professional Asphalt',
    description: 'Hot-mix asphalt laid and deeply rolled on compacted aggregate. Yields a flexible, slightly continuous surface giving excellent bounce controls.',
    costPerSqFt: 700.00,
    durability: 'High - 15 to 25 Years (Requires periodic seal coating)',
    bestFor: 'Outdoor Tennis & Multi-Sport Recreational Venues'
  },
  COMPACTED_STONE: {
    id: 'COMPACTED_STONE',
    name: 'Dynamic Fine Aggregate Stone System',
    description: 'Crushed limestone layers graded and hydraulically pressed. Equipped with localized perforated drainage pipes. Best for synthetic fields.',
    costPerSqFt: 415.00,
    durability: 'Great - Over 20 Years (Fully porous system)',
    bestFor: 'FIFA Football Turfs, Athletics, and Interlocking Tiles'
  },
  SUSPENDED_DECK: {
    id: 'SUSPENDED_DECK',
    name: 'Interlocking Suspended Air Deck',
    description: 'Eco-innovative elevated grid panels that can block moisture and can be laid directly onto existing soils or imperfect hard surfaces.',
    costPerSqFt: 600.00,
    durability: 'Excellent - Portable & reusable platform',
    bestFor: 'Fast temporary installations, rooftops, or slope-prone spots'
  }
};

export const SMART_FEATURES: SmartFeature[] = [
  {
    id: 'PERIPHERAL_FENCING',
    name: 'Peripheral Fencing and Netting',
    description: 'Heavy-duty steel wire boundary fencing coupled with upper-level soft mesh safety netting to isolate balls and elevate structural safety.',
    cost: 150000,
    category: 'Hardware'
  },
  {
    id: 'SMART_FLOODLIGHTS',
    name: 'Solar-Charged Smart LED Floodlights',
    description: 'Quad solar-integrated columns throwing over 50,000 lumens. Features automated darkness sensors, smartphone brightness limits, and structural tilt control.',
    cost: 480000,
    category: 'Lighting'
  }
];

export const COLORS = [
  { name: 'Imperial Blue', hex: '#1E3A8A', value: 'blue' },
  { name: 'Emerald High-Performance', hex: '#065F46', value: 'emerald' },
  { name: 'Classic Terracotta', hex: '#C2410C', value: 'orange' },
  { name: 'Cosmic Slate Gray', hex: '#374151', value: 'gray' },
  { name: 'Neon Electric Green', hex: '#10B981', value: 'green' },
  { name: 'Signature Purple', hex: '#6D28D9', value: 'purple' },
  { name: 'Vibrant Sunshine Yellow', hex: '#F59E0B', value: 'yellow' },
  { name: 'Absolute Cyber Black', hex: '#111827', value: 'black' }
];
