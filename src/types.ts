/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SportType = 'BASKETBALL' | 'TENNIS' | 'PICKLEBALL' | 'FOOTBALL' | 'TRACK_FIELD' | 'GYM' | 'CRICKET' | 'BADMINTON' | 'SWIMMING_POOL' | 'SQUASH' | 'VOLLEYBALL';

export interface SportDetails {
  id: SportType;
  name: string;
  tagline: string;
  description: string;
  minDimensions: { length: number; width: number }; // in feet
  defaultDimensions: { length: number; width: number }; // in feet
  maxDimensions: { length: number; width: number }; // in feet
  iconName: string;
  basePricePerSqFt: number;
}

export type SurfaceMaterialType = 'CANADIAN_MAPLE' | 'PRO_ACRYLIC' | 'PP_TILES' | 'COMPOSITE_TURF' | 'MOSAIC_CLASSIC' | 'GLASS_BEAD_PLASTER' | 'REINFORCED_PVC_LINER' | 'ARMOURCOAT_WALLS';

export interface SurfaceMaterialDetails {
  id: SurfaceMaterialType;
  name: string;
  category: 'Indoor' | 'Outdoor' | 'All-Weather';
  description: string;
  costPerSqFt: number;
  thickness: string;
  warranty: string;
  features: string[];
  crossSectionLayers: { name: string; thickness: string; desc: string }[];
}

export interface SmartFeature {
  id: string;
  name: string;
  description: string;
  cost: number;
  category: 'Tech' | 'Hardware' | 'Lighting' | 'Ecosystem';
}

export type SubbaseType = 
  | 'POST_TENSION_CONCRETE' | 'ASPHALT' | 'COMPACTED_STONE' | 'SUSPENDED_DECK'
  | 'FOOTBALL_DRAINAGE_AGGREGATE' | 'FOOTBALL_SHOCKPAD_BASE'
  | 'CRICKET_HEAVY_CLAY' | 'CRICKET_COMPACT_STONE'
  | 'GYM_ACOUSTIC_SLAB' | 'GYM_RUBBER_DAMPENING'
  | 'POOL_SHOTCRETE_SHELL' | 'POOL_POURED_CONCRETE'
  | 'SQUASH_DOUBLE_BATTEN' | 'SQUASH_SINGLE_ELASTIC';

export interface SubbaseDetails {
  id: SubbaseType;
  name: string;
  description: string;
  costPerSqFt: number;
  durability: string;
  bestFor: string;
}

export interface CourtConfiguration {
  sportType: SportType;
  length: number;
  width: number;
  surfaceMaterial: SurfaceMaterialType;
  primaryColor: string;
  secondaryColor: string;
  lineColor: string;
  subbase: SubbaseType;
  selectedSmartFeatures: string[];
  visualizePlayers?: boolean;
  animatePlayers?: boolean;
}

export interface EstimatorSummary {
  areaSqFt: number;
  surfaceCost: number;
  subbaseCost: number;
  smartFeaturesCost: number;
  markingAndFittings: number;
  installationLabor: number;
  totalEstimatedCost: number;
}

export interface ProposalRequest {
  config: CourtConfiguration;
  costSummary: EstimatorSummary;
  clientInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    intendedUse: 'Residential' | 'Commercial' | 'Educational' | 'Professional';
    timeline: string;
    additionalNotes: string;
  };
}
