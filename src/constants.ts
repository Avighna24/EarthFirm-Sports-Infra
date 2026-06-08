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
    name: 'Cricket Turf',
    tagline: 'High-density synthetic premium cricket turf',
    description: 'Professional sub-base engineering with tournament-grade high-bounce cricket turf. Designed for highly accurate ball bounce and consistent spin response.',
    minDimensions: { length: 100, width: 60 },
    defaultDimensions: { length: 110, width: 70 },
    maxDimensions: { length: 125, width: 80 },
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
  },
  SWIMMING_POOL: {
    id: 'SWIMMING_POOL',
    name: 'Swimming Pool',
    tagline: 'Custom premium pools & integrated thermal systems',
    description: 'Bespoke high-end swimming pools fitted with state-of-the-art filtration, customizable underwater LEDs, ceramic glass steps, and eco-friendly temperature controls.',
    minDimensions: { length: 30, width: 15 },
    defaultDimensions: { length: 75, width: 35 },
    maxDimensions: { length: 164, width: 82 },
    iconName: 'Waves',
    basePricePerSqFt: 620.00,
  },
  SQUASH: {
    id: 'SQUASH',
    name: 'Squash Court',
    tagline: 'Elite WSF-grade high-rebound speed arena',
    description: 'Flawlessly leveled Canadian Maple hardwood, heavy high-impact armor plaster wall surfaces, and integrated crystal clear heavy back safety glass.',
    minDimensions: { length: 32, width: 21 },
    defaultDimensions: { length: 32, width: 21 },
    maxDimensions: { length: 45, width: 30 },
    iconName: 'Layout',
    basePricePerSqFt: 480.00,
  },
  VOLLEYBALL: {
    id: 'VOLLEYBALL',
    name: 'Volleyball Court',
    tagline: 'FIVB-grade high-trampoline elastic court designs',
    description: 'Precision-lined volleyball layout designed with elite shock absorption and non-slip surface traction for dynamic leaping and defensive dives.',
    minDimensions: { length: 50, width: 25 },
    defaultDimensions: { length: 60, width: 30 },
    maxDimensions: { length: 80, width: 40 },
    iconName: 'Volleyball',
    basePricePerSqFt: 340.00,
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
  },
  MOSAIC_CLASSIC: {
    id: 'MOSAIC_CLASSIC',
    name: 'Royal Mosaic Ceramic & Glass Tiles',
    category: 'All-Weather',
    description: 'Stunning premium glass and ceramic mosaic tiling. Hand-laid with epoxy grout and specialized anti-slip textured glazes for ultimate water aesthetics and safety.',
    costPerSqFt: 2100.00,
    thickness: '12mm Premium Mosaic Blend',
    warranty: '20 Years Leakproof & Bonding Guarantee',
    features: [
      'Stain-resistant glass-grade finishes',
      'Anti-erosion epoxy mortar locks',
      'Exquisite reflecting prism color effect',
      'Ultra high water chemical & UV resistance'
    ],
    crossSectionLayers: [
      { name: 'Glistening Prism Glass Mosaic Tiles', thickness: '8mm', desc: 'Satin gloss, hand-cut glass tile blocks' },
      { name: 'Water-impermeable Flexible Epoxy Membrane', thickness: '2mm', desc: 'Complete leakproof sealant bond' },
      { name: 'Polymer-Modified Flex Cement Mortar Bed', thickness: '12mm', desc: 'Secure structural grip layer' }
    ]
  },
  GLASS_BEAD_PLASTER: {
    id: 'GLASS_BEAD_PLASTER',
    name: 'Shimmering Quartz & Glass Bead Plaster',
    category: 'All-Weather',
    description: 'A hybrid blend of pure white quartz plaster and colored glass beads. Creates a highly textured, slip-resistant surface that sparkles naturally underwater.',
    costPerSqFt: 1150.00,
    thickness: '15mm Monolithic Plaster Spray',
    warranty: '10 Years Color-Lock Guarantee',
    features: [
      'Stains and algae-resistant structure',
      'Smooth, non-abrasive finish on feet',
      'Iridescent light reflection spectrum',
      'High density compression prevents peeling'
    ],
    crossSectionLayers: [
      { name: 'White Portland Cement & Glass Bead Plaster', thickness: '15mm', desc: 'Highly compact, polished surface finish' },
      { name: 'Concrete Bond Coat Adhesive Primer', thickness: '1mm', desc: 'Provides perfect physical interface to concrete base' }
    ]
  },
  REINFORCED_PVC_LINER: {
    id: 'REINFORCED_PVC_LINER',
    name: 'Heavy-Duty Reinforced PVC Liner',
    category: 'All-Weather',
    description: 'Commercial-grade, polyester-mesh reinforced PVC membranes. Fully welded onsite to ensure perfect fit and a completely flexible, puncture-resistant finish.',
    costPerSqFt: 820.00,
    thickness: '1.5mm Gauge Membrane',
    warranty: '12 Years Thermal & Water Tight Guarantee',
    features: [
      'High resistance against structural shifting',
      'Pre-treated for microbial and algae suppression',
      'Speedy professional thermal welding process',
      'Extremely easy to clean & maintain'
    ],
    crossSectionLayers: [
      { name: 'UV Protective Top Acrylic Barrier', thickness: '0.1mm', desc: 'Protects from sun fading' },
      { name: 'Mesh Reinforced Polyvinyl Chloride', thickness: '1.5mm', desc: 'Polyester core mesh encased in premium PVC' },
      { name: 'Fleece Cushioned Protective Underlay', thickness: '2.0mm', desc: 'Puncture shield and thermal buffer' }
    ]
  },
  ARMOURCOAT_WALLS: {
    id: 'ARMOURCOAT_WALLS',
    name: 'Armourcoat High-Impact Squash Wall System',
    category: 'Indoor',
    description: 'The world-standard multi-layer plaster formula certified by the World Squash Federation. Perfectly flat, joint-free, and delivers extremely loud ball impact feedback.',
    costPerSqFt: 1450.00,
    thickness: '18mm Dense Multicoat Plaster',
    warranty: '15 Years Dent-Resistant Guarantee',
    features: [
      'WSF Standard Certified',
      'Joint-free, perfectly monolithic plaster surface',
      'Extreme hardness, resists cracking from rackets',
      'Vibrant optic white finish for high ball contrast'
    ],
    crossSectionLayers: [
      { name: 'WSF Bright White Finish Glaze', thickness: '2mm', desc: 'Smooth, dense high-vis wall finish' },
      { name: 'Fibre-Reinforced Base Render', thickness: '10mm', desc: 'Dent resistance & sound deadening layer' },
      { name: 'Undercoat Primer and Adhesive Resin', thickness: '1.5mm', desc: 'Solid bond to structural brickwork' }
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
  },
  FOOTBALL_DRAINAGE_AGGREGATE: {
    id: 'FOOTBALL_DRAINAGE_AGGREGATE',
    name: 'Dynamic Fine Aggregate drainage system',
    description: 'Crushed gravel beds graded and pressed with laser accuracy, integrated with micro-perforated sub-surface storm drains.',
    costPerSqFt: 460.00,
    durability: 'Superb - Over 25 Years (Extreme porosity)',
    bestFor: 'FIFA Standard Football Turfs & Drainage Areas'
  },
  FOOTBALL_SHOCKPAD_BASE: {
    id: 'FOOTBALL_SHOCKPAD_BASE',
    name: 'Elastic Shockpad Underlap Aggregate Foundation',
    description: '10mm thickness polyurethane-bound rubber crumb shockpad combined with dynamic porous stone for elite impact safety.',
    costPerSqFt: 630.00,
    durability: 'High Performance - 15 to 20 Years',
    bestFor: 'Injury Prevention & Pro Football Turf Projects'
  },
  CRICKET_HEAVY_CLAY: {
    id: 'CRICKET_HEAVY_CLAY',
    name: 'Rolled Heavy Clay/Loam Pitch Foundation',
    description: 'High-density bulli clay layers compacted down using a multi-ton vibratory roller to create a hard, dry bounce surface.',
    costPerSqFt: 550.00,
    durability: 'Continuous Maintenance - Rebuild/Resurface seasonally',
    bestFor: 'High-bounce Professional Level Cricket Match Pitches'
  },
  CRICKET_COMPACT_STONE: {
    id: 'CRICKET_COMPACT_STONE',
    name: 'Crushed Limestone & Sand Bed Dynamic Foundation',
    description: 'Layered crushed rock topped with premium fine river sand. Ensures flat, true ball behavior for net practicing cages.',
    costPerSqFt: 390.00,
    durability: 'Excellent - Over 20 Years',
    bestFor: 'Cricket Practice Cages, Surrounds & Outfields'
  },
  GYM_ACOUSTIC_SLAB: {
    id: 'GYM_ACOUSTIC_SLAB',
    name: 'Acoustic Floating Concrete Slab',
    description: 'Heavy concrete slab poured over high-performance elastomeric pads, completely isolating weight impacts from structural framing.',
    costPerSqFt: 980.00,
    durability: 'Indestructible - Over 50 Years',
    bestFor: 'Commercial Gyms, Free Weights Areas & Multi-level Fitness Centers'
  },
  GYM_RUBBER_DAMPENING: {
    id: 'GYM_RUBBER_DAMPENING',
    name: 'Vibration Dampening Rubber Overlay Foundation',
    description: 'Interlocking vulcanized rubber under-mats designed to cushion vibration, suppress low-frequency hums, and protect sub-concrete.',
    costPerSqFt: 520.00,
    durability: 'Extremely Durable - Over 25 Years',
    bestFor: 'Boutique Gyms, Yoga, HIIT Rooms, and Cardio areas'
  },
  POOL_SHOTCRETE_SHELL: {
    id: 'POOL_SHOTCRETE_SHELL',
    name: 'Pneumatic Reinforced Shotcrete Shell',
    description: 'Rebar grid structure sprayed with high-impact wet-mix concrete, forming a rock-solid, monolithic leakproof shell.',
    costPerSqFt: 1850.00,
    durability: 'Lifetime - Structurally guaranteed over 50 Years',
    bestFor: 'Premium Backyards & Olympic Institutional Swimming Pools'
  },
  POOL_POURED_CONCRETE: {
    id: 'POOL_POURED_CONCRETE',
    name: 'Cast-in-Place Concrete Slab with Waterstops',
    description: 'Formwork-cast Portland concrete combined with PVC waterstop joints and integrated hydrostatic relief valves.',
    costPerSqFt: 2150.00,
    durability: 'Extreme - Outstanding structural integrity',
    bestFor: 'High-Water-Table Locations & Commercial Pools'
  },
  SQUASH_DOUBLE_BATTEN: {
    id: 'SQUASH_DOUBLE_BATTEN',
    name: 'Double-Sleeved Resilient Batten Sleeper',
    description: 'Certified WSF design. Dual-layer timber sleeper battens interlaid with neoprene pads for maximum bounce uniformity and energy return.',
    costPerSqFt: 1100.00,
    durability: 'Professional Grade - 20 to 30 Years (Dry environments)',
    bestFor: 'World Championship Quality WSF Player Arenas'
  },
  SQUASH_SINGLE_ELASTIC: {
    id: 'SQUASH_SINGLE_ELASTIC',
    name: 'Single-Sleeved Resilient Lumber Cushioning',
    description: 'Standard resilient softwood batten system. Budget-friendly player cushioning that reduces muscle fatigue.',
    costPerSqFt: 780.00,
    durability: 'Very Good - 15 to 20 Years',
    bestFor: 'School, Club & Secondary Residential Squash Facilities'
  }
};

export const SMART_FEATURES: SmartFeature[] = [
  // General options
  {
    id: 'SMART_FLOODLIGHTS',
    name: 'Solar-Charged Smart LED Floodlights',
    description: 'Quad solar-integrated columns throwing over 50,000 lumens. Features automated darkness sensors, smartphone brightness limits, and structural tilt control.',
    cost: 480000,
    category: 'Lighting',
    sports: ['BASKETBALL', 'TENNIS', 'PICKLEBALL', 'FOOTBALL', 'TRACK_FIELD', 'CRICKET', 'BADMINTON', 'VOLLEYBALL']
  },
  {
    id: 'AUTOMATED_DRAINAGE',
    name: 'Smart Subsurface Stormwater Drainage Pump',
    description: 'Automated hydraulic sensors integrated within civil sub-base grids to evacuate water logging instantly under extreme rains.',
    cost: 280000,
    category: 'Hardware',
    sports: ['BASKETBALL', 'TENNIS', 'PICKLEBALL', 'FOOTBALL', 'TRACK_FIELD', 'CRICKET', 'BADMINTON', 'VOLLEYBALL']
  },
  // Basketball specific
  {
    id: 'BASKETBALL_HOOPS',
    name: 'Hydraulic Tempered Glass Goals Set',
    description: 'Dual professional height-adjustable hoops with heavy-duty structural wrap cushioning and dynamic dunk-spring rim systems.',
    cost: 180000,
    category: 'Hardware',
    sports: ['BASKETBALL']
  },
  // Tennis specific
  {
    id: 'TENNIS_NETS',
    name: 'Pro Tensioned Steel Net Post Columns',
    description: 'Internal brass winding gears, UV-stabilized tennis net mesh, and rigid high-tension aluminum sleeve posts.',
    cost: 95000,
    category: 'Hardware',
    sports: ['TENNIS']
  },
  // Pickleball specific
  {
    id: 'PICKLEBALL_POSTS',
    name: 'Modular Portable Heavy Duty Net System',
    description: 'Precision ground anchor sleeves, heavy duty pickleball net with centered steel buckle adjustments.',
    cost: 75000,
    category: 'Hardware',
    sports: ['PICKLEBALL']
  },
  // Football specific
  {
    id: 'FOOTBALL_GOALS',
    name: 'FIFA Spec Anti-Rust Heavy Steel Goals',
    description: 'Pair of Olympic white-finished box goalframes complete with tear-proof braided nylon mesh and deep ground stakes.',
    cost: 140000,
    category: 'Hardware',
    sports: ['FOOTBALL']
  },
  // Track specific
  // Gym specific
  {
    id: 'GYM_RACKS',
    name: 'Interlocked Olympic Weight Station Cages',
    description: 'Tough structural iron power racks fitted with heavy vulcanized anti-vibration drop platforms for barbell dampening.',
    cost: 250000,
    category: 'Hardware',
    sports: ['GYM']
  },
  {
    id: 'GYM_MIRRORS',
    name: 'Full Height Posture Smart Training Mirrors',
    description: 'Integrated ambient backlighting combined with custom grid accents to monitor body geometry and technique.',
    cost: 130000,
    category: 'Tech',
    sports: ['GYM']
  },
  // Cricket specific
  {
    id: 'CRICKET_NET',
    name: 'Ceiling Rail Retractable Practice Netting',
    description: 'Structural nylon drop nets sliding along heavy overhead rails, allowing instant conversion of multi-sport areas.',
    cost: 115000,
    category: 'Hardware',
    sports: ['CRICKET']
  },
  // Badminton specific
  {
    id: 'BADMINTON_POSTS',
    name: 'BWF Class Heavy Free-Standing Post Set',
    description: 'Counterweighted rigid gold-sleeve posts with Olympic specifications nylon nets and adjustable cord tensioning.',
    cost: 65000,
    category: 'Hardware',
    sports: ['BADMINTON']
  },
  {
    id: 'BADMINTON_LIGHT',
    name: 'Anti-Glare Underlay Directional LED Tubes',
    description: 'Bespoke sideline-focused LED lights projecting completely glare-free brightness to ensure high birdie visibility.',
    cost: 155000,
    category: 'Lighting',
    sports: ['BADMINTON']
  },
  // Volleyball specific
  {
    id: 'VOLLEYBALL_POSTS',
    name: 'Telescopic Carbon-Fiber Net Posts',
    description: 'Integrated rope winch gears, protective pad sleeves, and precise sliding heights for mens/womens regulation play.',
    cost: 85000,
    category: 'Hardware',
    sports: ['VOLLEYBALL']
  },
  {
    id: 'VOLLEYBALL_NETTING',
    name: 'Sands level adjustment boundaries kit',
    description: 'Heavy duty web border tapes with robust sand disc anchors, plus professional mesh net netting and cables.',
    cost: 110000,
    category: 'Hardware',
    sports: ['VOLLEYBALL']
  },
  // Swimming Pool specific
  {
    id: 'POOL_LIGHTS',
    name: 'Multi-Color Submarine LED Underwater Lights',
    description: 'High-intensity submerged LED lighting system with vibrant color presets and waterproof safety transformers.',
    cost: 120000,
    category: 'Lighting',
    sports: ['SWIMMING_POOL']
  },
  {
    id: 'POOL_PUMPS_FILTER',
    name: 'High-Performance Filtration and Circulation Pump System',
    description: 'Heavy-duty saltwater-rated quiet water pump paired with sand filters to ensure pristine crystal-clear water flow.',
    cost: 210000,
    category: 'Hardware',
    sports: ['SWIMMING_POOL']
  },
  {
    id: 'POOL_HEATER',
    name: 'Titanium Water Thermal Heat Pump System',
    description: 'Industrial-grade titanium heat exchanger pumps designed for consistent year-round pool temperature regulation.',
    cost: 430000,
    category: 'Hardware',
    sports: ['SWIMMING_POOL']
  },
  // Squash specific
  {
    id: 'SQUASH_GLASS',
    name: 'WSF Heavy Toughened Glass Rebound Wall',
    description: '12mm structural glass back door system featuring high-tension flush fittings, hardware, and safety floor anchors.',
    cost: 380000,
    category: 'Hardware',
    sports: ['SQUASH']
  },
  {
    id: 'SQUASH_AC',
    name: 'Dehumidifying Air-Handler Climate Unit',
    description: 'Specialized low-velocity ventilation unit maintaining ideal 45% moisture levels to keep maple hardwood dry and grippy.',
    cost: 250000,
    category: 'Ecosystem',
    sports: ['SQUASH']
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
