/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, useRef } from 'react';
import { CourtConfiguration } from '../types';
import { COLORS } from '../constants';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Box, Cylinder, Sphere } from '@react-three/drei';

const AbstractPlayer = ({ 
  position, 
  color, 
  rotation = [0, 0, 0],
  bounceSpeed = 0,
  movementDistance = 0,
  movementSpeed = 0,
  moveAxis = 'x',
  hasBallType = null,
  animate = true,
  visible = true
}: { 
  position: [number, number, number], 
  color: string, 
  rotation?: [number, number, number],
  bounceSpeed?: number,
  movementDistance?: number,
  movementSpeed?: number,
  moveAxis?: 'x' | 'z',
  hasBallType?: 'basketball' | 'tennis' | 'football' | 'shuttlecock' | 'cricket' | null,
  animate?: boolean,
  visible?: boolean
}) => {
  const groupRef = useRef<any>(null);
  const bodyRef = useRef<any>(null);
  const ballRef = useRef<any>(null);

  useFrame((state) => {
    if (!animate || !visible) return;
    const time = state.clock.getElapsedTime();

    // 1. Subtle player bounce/idle breathing
    if (groupRef.current) {
      const bSpeed = bounceSpeed || 2;
      const bHeight = 0.05 * Math.sin(time * bSpeed);
      groupRef.current.position.y = position[1] + bHeight;

      // 2. Active running/pacing movement back and forth
      if (movementDistance > 0 && movementSpeed > 0) {
        const offset = Math.sin(time * movementSpeed) * movementDistance;
        if (moveAxis === 'x') {
          groupRef.current.position.x = position[0] + offset;
          // Rotate body to face motion direction
          if (bodyRef.current) {
            bodyRef.current.rotation.y = offset > 0 ? Math.PI / 2 : -Math.PI / 2;
          }
        } else {
          groupRef.current.position.z = position[2] + offset;
          // Rotate body to face motion direction
          if (bodyRef.current) {
            bodyRef.current.rotation.y = offset > 0 ? 0 : Math.PI;
          }
        }
      }
    }

    // 3. Dynamic ball behavior if this player carries/dribbles/plays a ball
    if (ballRef.current && animate) {
      if (hasBallType === 'basketball') {
        // Dribble up and down in rhythm with time
        ballRef.current.position.y = 0.5 + 0.4 * Math.abs(Math.sin(time * 6));
        ballRef.current.position.x = 0.45;
        ballRef.current.position.z = 0.25;
      }
    }
  });

  if (!visible) return null;

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      <group ref={bodyRef}>
        {/* Legs / Shorts */}
        <Cylinder args={[0.08, 0.08, 0.4]} position={[-0.1, 0.2, 0]} castShadow>
          <meshStandardMaterial color="#1f2937" />
        </Cylinder>
        <Cylinder args={[0.08, 0.08, 0.4]} position={[0.1, 0.2, 0]} castShadow>
          <meshStandardMaterial color="#1f2937" />
        </Cylinder>

        {/* Torso / Jersey */}
        <Cylinder args={[0.22, 0.18, 0.8]} position={[0, 0.75, 0]} castShadow>
          <meshStandardMaterial color={color} roughness={0.5} />
        </Cylinder>

        {/* Arms holding stance */}
        <Cylinder args={[0.06, 0.06, 0.6]} position={[-0.28, 0.75, 0.1]} rotation={[0.4, 0, 0.2]} castShadow>
          <meshStandardMaterial color={color} />
        </Cylinder>
        <Cylinder args={[0.06, 0.06, 0.6]} position={[0.28, 0.75, 0.1]} rotation={[0.4, 0, -0.2]} castShadow>
          <meshStandardMaterial color={color} />
        </Cylinder>

        {/* Head */}
        <Sphere args={[0.18, 16, 16]} position={[0, 1.3, 0]} castShadow>
          <meshStandardMaterial color="#fcd34d" roughness={0.4} />
        </Sphere>
        
        {/* Headband / Cap */}
        <Cylinder args={[0.19, 0.19, 0.06]} position={[0, 1.45, 0]} castShadow>
          <meshStandardMaterial color="#1e293b" />
        </Cylinder>

        {/* Ball carried/dribbled by player */}
        {hasBallType === 'basketball' && (
          <Sphere ref={ballRef} args={[0.12, 16, 16]} position={[0.45, 0.5, 0.25]} castShadow>
            <meshStandardMaterial color="#ea580c" roughness={0.4} />
          </Sphere>
        )}
        {hasBallType === 'cricket' && (
          <group position={[0.3, 0.7, 0.2]}>
            {/* Wooden Bat */}
            <Box args={[0.06, 0.7, 0.15]} position={[0, 0, 0]} rotation={[0.3, 0.2, -0.2]} castShadow>
              <meshStandardMaterial color="#b45309" roughness={0.7} />
            </Box>
          </group>
        )}
      </group>
    </group>
  );
};

const SimulatedBall = ({ sportType, courtL, courtW, animate, visible = true }: { sportType: string, courtL: number, courtW: number, animate: boolean, visible?: boolean }) => {
  const ballRef = useRef<any>(null);

  useFrame((state) => {
    if (!ballRef.current || !animate || !visible) return;
    const time = state.clock.getElapsedTime();

    if (sportType === 'TENNIS' || sportType === 'PICKLEBALL') {
      // Ball travels back and forth across court length (z axis), bouncing at target landing spots
      const cycle = time * 2.2;
      const z = Math.sin(cycle) * (courtL * 0.38);
      
      // Arc of height (makes it parabolic)
      const relativeTime = (cycle % Math.PI);
      const y = 0.1 + 1.2 * Math.sin(relativeTime);

      ballRef.current.position.set(Math.sin(time * 0.5) * 1.2, y, z);
    } else if (sportType === 'SQUASH') {
      // Squash ball bouncing off front wall and floor
      const cycle = (time * 2.5) % 3; // fast pace
      let x = Math.sin(time * 0.8) * (courtW * 0.25);
      let y = 0.1;
      let z = 0;

      if (cycle < 1.5) {
        // Traveling towards front wall (z = -courtL/2)
        const p = cycle / 1.5;
        const playerZ = courtL * 0.25;
        const frontWallZ = -courtL * 0.48;
        z = playerZ - p * (playerZ - frontWallZ);
        y = 0.12 + 1.5 * Math.sin(p * Math.PI);
      } else {
        // Rebounding off front wall back to floor
        const p = (cycle - 1.5) / 1.5;
        const frontWallZ = -courtL * 0.48;
        const playerZ = courtL * 0.25;
        z = frontWallZ + p * (playerZ - frontWallZ);
        y = 0.12 + 0.5 * Math.sin(p * Math.PI);
      }
      ballRef.current.position.set(x, y, z);
    } else if (sportType === 'FOOTBALL') {
      // Soccer ball flying/sliding between player positions
      const cycle = time * 1.5;
      const progress = (Math.sin(cycle) + 1) / 2; // oscillates between 0 and 1
      
      const x = -2 + progress * 5;
      const z = courtL / 4 - progress * (courtL / 2);
      const y = 0.12 + 0.6 * Math.sin(progress * Math.PI);
      
      ballRef.current.position.set(x, y, z);
    } else if (sportType === 'BADMINTON') {
      // Shuttlecock has high floaty parabolic arc back and forth (z axis)
      const cycle = time * 1.8;
      const z = Math.sin(cycle) * (courtL * 0.4);
      
      const relativeTime = (cycle % Math.PI);
      const y = 0.1 + 2.4 * Math.sin(relativeTime); // High trajectory
      
      ballRef.current.position.set(Math.sin(time * 0.7) * 0.8, y, z);
    } else if (sportType === 'CRICKET') {
      // Bowled cricket ball: starts from side 1, pitches in front of batsman, batsman hits it high outwards
      const cycle = (time * 1.2) % 4; // 4 seconds total cycle
      
      let x = 0;
      let y = 0.1;
      let z = 0;

      if (cycle < 1.5) {
        // Bowling delivery phase
        const p = cycle / 1.5;
        const bowlerZ = -courtL * 0.22;
        const batterZ = courtL * 0.22 - 1.2;
        
        z = bowlerZ + p * (batterZ - bowlerZ);
        y = 0.15 + 1.4 * Math.sin(p * Math.PI) * (1.2 - p);
      } else if (cycle < 3.5) {
        // Hit outwards phase
        const p = (cycle - 1.5) / 2.0;
        const startZ = courtL * 0.22 - 1.2;
        const targetZ = -courtL * 0.45;
        const targetX = Math.sin(time * 3) * (courtW * 0.4);
        
        x = p * targetX;
        z = startZ + p * (targetZ - startZ);
        y = 0.2 + 2.5 * Math.sin(p * Math.PI);
      } else {
        // Retrieval phase
        x = 0;
        y = -10;
        z = 0;
      }
      ballRef.current.position.set(x, y, z);
    } else if (sportType === 'VOLLEYBALL') {
      // Volleyball bouncing/passing back and forth over a high net
      const cycle = time * 2.0;
      const z = Math.sin(cycle) * (courtL * 0.35);
      const relativeTime = (cycle % Math.PI);
      const y = 0.15 + 1.8 * Math.sin(relativeTime);
      ballRef.current.position.set(Math.sin(time * 0.4) * 0.8, y, z);
    }
  });

  // Decide ball color and dimensions
  let ballColor = '#ea580c';
  let ballSize = 0.12;

  if (sportType === 'TENNIS') {
    ballColor = '#bef264';
    ballSize = 0.085;
  } else if (sportType === 'PICKLEBALL') {
    ballColor = '#bef264';
    ballSize = 0.09;
  } else if (sportType === 'FOOTBALL') {
    ballColor = '#ffffff';
    ballSize = 0.18;
  } else if (sportType === 'BADMINTON') {
    ballColor = '#f3f4f6';
    ballSize = 0.07;
  } else if (sportType === 'CRICKET') {
    ballColor = '#b91c1c';
    ballSize = 0.08;
  } else if (sportType === 'SQUASH') {
    ballColor = '#1e293b'; // dark ball
    ballSize = 0.052; // very small squash ball
  } else if (sportType === 'VOLLEYBALL') {
    ballColor = '#facc15'; // yellow/blue standard volleyball color
    ballSize = 0.14;
  } else {
    return null;
  }

  if (!visible) return null;

  return (
    <Sphere ref={ballRef} args={[ballSize, 12, 12]} position={[0, -10, 0]} castShadow>
      <meshStandardMaterial color={ballColor} roughness={0.5} />
    </Sphere>
  );
};

interface VisualizerProps {
  config: CourtConfiguration;
}

const CourtScene: React.FC<{ config: CourtConfiguration }> = ({ config }) => {
  const { 
    sportType, 
    primaryColor, 
    secondaryColor, 
    lineColor, 
    length, 
    width, 
    surfaceMaterial, 
    selectedSmartFeatures,
    visualizePlayers = true,
    animatePlayers = true
  } = config;

  // Find exact hex codes with material overrides
  let primaryHex = COLORS.find(c => c.value === primaryColor)?.hex || '#1E3A8A';
  let secondaryHex = COLORS.find(c => c.value === secondaryColor)?.hex || '#374151';
  let lineStroke = COLORS.find(c => c.value === lineColor)?.hex || '#ffffff';

  let roughness = 0.7;
  let metalness = 0.1;

  if (surfaceMaterial === 'CANADIAN_MAPLE') {
    primaryHex = '#F1C27B';
    secondaryHex = '#CF9B55';
    roughness = 0.3; // glossy
    metalness = 0.1;
  } else if (surfaceMaterial === 'MOSAIC_CLASSIC') {
    primaryHex = '#0ea5e9'; // glossy beautiful water-reflective mosaic tiles
    secondaryHex = '#0284c7';
    roughness = 0.15;
    metalness = 0.55;
  } else if (surfaceMaterial === 'GLASS_BEAD_PLASTER') {
    primaryHex = '#ffffff'; // sparking white bead pool plaster
    secondaryHex = '#bae6fd';
    roughness = 0.35;
    metalness = 0.25;
  } else if (surfaceMaterial === 'REINFORCED_PVC_LINER') {
    primaryHex = '#38bdf8'; // sky blue vinyl liner
    secondaryHex = '#0ea5e9';
    roughness = 0.55;
    metalness = 0.05;
  } else if (surfaceMaterial === 'ARMOURCOAT_WALLS') {
    primaryHex = '#fafaf9'; // bright squash wall white plaster
    secondaryHex = '#e5e5e5';
    roughness = 0.95;
    metalness = 0.0;
  } else if (surfaceMaterial === 'COMPOSITE_TURF') {
    primaryHex = '#1E5E3A';
    secondaryHex = '#144327';
    roughness = 0.9;
    metalness = 0;
  } else if (surfaceMaterial === 'PRO_ACRYLIC') {
    roughness = 0.5;
    metalness = 0.05;
  }

  // Scale down dimensions for reasonably sized 3D objects (ft to 3D units)
  const courtL = length / 4; 
  const courtW = width / 4;
  const runoutL = courtL + 3;
  const runoutW = courtW + 3;

  const hasLedLines = false;
  let lineEmissive = hasLedLines ? '#10B981' : '#000000';
  let lineEmissiveIntensity = hasLedLines ? 2 : 0;

  return (
    <group position={[0, -0.5, 0]}>
      {/* 1. Runout Zone */}
      <Box args={[runoutW, 0.1, runoutL]} position={[0, -0.05, 0]} receiveShadow>
        <meshStandardMaterial color={secondaryHex} roughness={roughness} metalness={metalness} />
      </Box>

      {/* 2. Primary Play Area */}
      <Box args={[courtW, 0.12, courtL]} position={[0, -0.04, 0]} receiveShadow>
        <meshStandardMaterial color={primaryHex} roughness={roughness} metalness={metalness} />
      </Box>

      {/* 3. Sport Markings & Equipment */}
      {sportType === 'BASKETBALL' && (
        <group>
           {/* Court Outline Sidelines */}
           {/* Side lines */}
           <Box args={[0.08, 0.015, courtL]} position={[courtW/2, 0.025, 0]}>
             <meshStandardMaterial color={lineStroke} emissive={lineEmissive} emissiveIntensity={lineEmissiveIntensity} />
           </Box>
           <Box args={[0.08, 0.015, courtL]} position={[-courtW/2, 0.025, 0]}>
             <meshStandardMaterial color={lineStroke} emissive={lineEmissive} emissiveIntensity={lineEmissiveIntensity} />
           </Box>
           {/* Baselines */}
           <Box args={[courtW, 0.015, 0.08]} position={[0, 0.025, courtL/2]}>
             <meshStandardMaterial color={lineStroke} emissive={lineEmissive} emissiveIntensity={lineEmissiveIntensity} />
           </Box>
           <Box args={[courtW, 0.015, 0.08]} position={[0, 0.025, -courtL/2]}>
             <meshStandardMaterial color={lineStroke} emissive={lineEmissive} emissiveIntensity={lineEmissiveIntensity} />
           </Box>

           {/* Half-court line */}
           <Box args={[courtW, 0.015, 0.08]} position={[0, 0.025, 0]}>
              <meshStandardMaterial color={lineStroke} emissive={lineEmissive} emissiveIntensity={lineEmissiveIntensity} />
           </Box>
           {/* Center Circle */}
           <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.026, 0]}>
               <ringGeometry args={[1.42, 1.5, 32]} />
               <meshStandardMaterial color={lineStroke} emissive={lineEmissive} emissiveIntensity={lineEmissiveIntensity} transparent opacity={0.8} side={2} />
           </mesh>

           {/* Hoops & Key */}
           {[1, -1].map((side) => (
              <group key={side} position={[0, 0, side * (courtL / 2 - 0.5)]} rotation={[0, side === 1 ? Math.PI : 0, 0]}>
                <Box args={[0.2, 3.0, 0.2]} position={[0, 1.5, 0]} castShadow>
                  <meshStandardMaterial color="#4b5563" />
                </Box>
                <Box args={[1.8, 1.2, 0.05]} position={[0, 3, 0.1]} castShadow>
                  <meshStandardMaterial color="#ffffff" />
                </Box>
                <mesh position={[0, 2.6, 0.4]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
                  <torusGeometry args={[0.3, 0.05, 16, 32]} />
                  <meshStandardMaterial color="#ef4444" />
                </mesh>
                
                {/* Key Area Outline (Lane) */}
                <Box args={[3.2, 0.02, 3.8]} position={[0, 0.025, 1.9]}>
                   <meshStandardMaterial color={lineStroke} emissive={lineEmissive} emissiveIntensity={lineEmissiveIntensity} transparent opacity={0.5} />
                </Box>
                <Box args={[3.04, 0.021, 3.64]} position={[0, 0.025, 1.9]}>
                   <meshStandardMaterial color={primaryHex} roughness={roughness} />
                </Box>

                {/* 3-Point Arc */}
                <mesh rotation={[-Math.PI / 2, 0, Math.PI]} position={[0, 0.026, 0.5]}>
                   <ringGeometry args={[4.8, 4.88, 32, 1, 0, Math.PI]} />
                   <meshStandardMaterial color={lineStroke} emissive={lineEmissive} emissiveIntensity={lineEmissiveIntensity} transparent opacity={0.8} />
                </mesh>
                
                {/* Free Throw Circle */}
                <mesh rotation={[-Math.PI / 2, 0, Math.PI]} position={[0, 0.026, 3.8]}>
                   <ringGeometry args={[1.5, 1.58, 32, 1, 0, Math.PI]} />
                   <meshStandardMaterial color={lineStroke} emissive={lineEmissive} emissiveIntensity={lineEmissiveIntensity} transparent opacity={0.8} />
                </mesh>
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.026, 3.8]}>
                   <ringGeometry args={[1.5, 1.58, 32, 1, 0, Math.PI]} />
                   <meshStandardMaterial color={lineStroke} emissive={lineEmissive} emissiveIntensity={lineEmissiveIntensity} transparent opacity={0.3} />
                </mesh>
              </group>
           ))}
           
           {/* Abstract Players */}
           <AbstractPlayer 
              position={[-2, 0, 3]} 
              color="#ef4444" 
              rotation={[0, Math.PI * 0.2, 0]}
              movementDistance={2.5}
              movementSpeed={1.8}
              moveAxis="z"
              hasBallType="basketball"
              animate={animatePlayers}
              visible={visualizePlayers}
            />
           <AbstractPlayer 
              position={[-2, 0, 1]} 
              color="#3b82f6" 
              rotation={[0, 0, 0]}
              movementDistance={2.0}
              movementSpeed={1.8}
              moveAxis="z"
              animate={animatePlayers}
              visible={visualizePlayers}
            />
           <AbstractPlayer 
              position={[2.5, 0, -1]} 
              color="#ef4444" 
              rotation={[0, -Math.PI / 2, 0]}
              movementDistance={1.8}
              movementSpeed={1.2}
              moveAxis="x"
              animate={animatePlayers}
              visible={visualizePlayers}
            />
            <AbstractPlayer 
              position={[1.8, 0, -2.5]} 
              color="#3b82f6" 
              rotation={[0, Math.PI, 0]}
              movementDistance={1.2}
              movementSpeed={1.2}
              moveAxis="x"
              animate={animatePlayers}
              visible={visualizePlayers}
            />
        </group>
      )}

      {sportType === 'TENNIS' && (
        <group>
           {/* Center Net */}
           <Box args={[courtW + 1, 0.75, 0.02]} position={[0, 0.75/2, 0]} castShadow>
             <meshStandardMaterial color="#222222" transparent opacity={0.7} wireframe />
           </Box>
           <Box args={[courtW + 1, 0.06, 0.04]} position={[0, 0.75, 0]}>
             <meshStandardMaterial color="#ffffff" />
           </Box>
           <Cylinder args={[0.06, 0.06, 0.875, 8]} position={[courtW/2 + 0.5, 0.875/2, 0]} castShadow>
             <meshStandardMaterial color="#444444" roughness={0.6} metalness={0.8} />
           </Cylinder>
           <Cylinder args={[0.06, 0.06, 0.875, 8]} position={[-courtW/2 - 0.5, 0.875/2, 0]} castShadow>
             <meshStandardMaterial color="#444444" roughness={0.6} metalness={0.8} />
           </Cylinder>
           
           {/* Lines */}
           {/* Center service line */}
           <Box args={[0.08, 0.015, courtL/2]} position={[0, 0.025, 0]}>
             <meshStandardMaterial color={lineStroke} emissive={lineStroke} emissiveIntensity={0.2} />
           </Box>
           {/* Service lines */}
           <Box args={[courtW * 0.82, 0.015, 0.08]} position={[0, 0.025, courtL/4]}>
             <meshStandardMaterial color={lineStroke} emissive={lineStroke} emissiveIntensity={0.2} />
           </Box>
           <Box args={[courtW * 0.82, 0.015, 0.08]} position={[0, 0.025, -courtL/4]}>
             <meshStandardMaterial color={lineStroke} emissive={lineStroke} emissiveIntensity={0.2} />
           </Box>
           {/* Singles Sidelines */}
           <Box args={[0.08, 0.015, courtL]} position={[courtW * 0.41, 0.025, 0]}>
             <meshStandardMaterial color={lineStroke} emissive={lineStroke} emissiveIntensity={0.2} />
           </Box>
           <Box args={[0.08, 0.015, courtL]} position={[-courtW * 0.41, 0.025, 0]}>
             <meshStandardMaterial color={lineStroke} emissive={lineStroke} emissiveIntensity={0.2} />
           </Box>
           {/* Doubles Sidelines */}
           <Box args={[0.08, 0.015, courtL]} position={[courtW/2, 0.025, 0]}>
             <meshStandardMaterial color={lineStroke} emissive={lineStroke} emissiveIntensity={0.2} />
           </Box>
           <Box args={[0.08, 0.015, courtL]} position={[-courtW/2, 0.025, 0]}>
             <meshStandardMaterial color={lineStroke} emissive={lineStroke} emissiveIntensity={0.2} />
           </Box>
           {/* Baselines */}
           <Box args={[courtW, 0.015, 0.08]} position={[0, 0.025, courtL/2]}>
             <meshStandardMaterial color={lineStroke} emissive={lineStroke} emissiveIntensity={0.2} />
           </Box>
           <Box args={[courtW, 0.015, 0.08]} position={[0, 0.025, -courtL/2]}>
             <meshStandardMaterial color={lineStroke} emissive={lineStroke} emissiveIntensity={0.2} />
           </Box>
           {/* Center Marks */}
           <Box args={[0.08, 0.015, 0.2]} position={[0, 0.025, courtL/2 - 0.1]}>
             <meshStandardMaterial color={lineStroke} emissive={lineStroke} emissiveIntensity={0.2} />
           </Box>
           <Box args={[0.08, 0.015, 0.2]} position={[0, 0.025, -courtL/2 + 0.1]}>
             <meshStandardMaterial color={lineStroke} emissive={lineStroke} emissiveIntensity={0.2} />
           </Box>
           
           {/* Abstract Players */}
           <AbstractPlayer 
              position={[0, 0, courtL * 0.38]} 
              color="#1e293b" 
              rotation={[0, 0, 0]} 
              movementDistance={2.5}
              movementSpeed={2.2}
              moveAxis="x"
              animate={animatePlayers}
              visible={visualizePlayers}
            />
           <AbstractPlayer 
              position={[0.5, 0, -courtL * 0.38]} 
              color="#e11d48" 
              rotation={[0, Math.PI, 0]} 
              movementDistance={2.1}
              movementSpeed={2.2}
              moveAxis="x"
              animate={animatePlayers}
              visible={visualizePlayers}
            />
            <SimulatedBall sportType="TENNIS" courtL={courtL} courtW={courtW} animate={animatePlayers} visible={visualizePlayers} />
        </group>
      )}

      {sportType === 'FOOTBALL' && (
        <group>
           {/* Center Line & Circle */}
           <Box args={[courtW, 0.015, 0.1]} position={[0, 0.025, 0]}>
              <meshStandardMaterial color={lineStroke} transparent opacity={0.8} />
           </Box>
           <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.026, 0]}>
              <ringGeometry args={[2.9, 3.0, 32]} />
              <meshStandardMaterial color={lineStroke} transparent opacity={0.8} side={2} />
           </mesh>

           {/* Goals */}
           {[1, -1].map((side) => (
              <group key={side} position={[0, 0, side * (courtL / 2)]} rotation={[0, side === 1 ? Math.PI : 0, 0]}>
                {/* Goal frame wire */}
                <Box args={[4, 2, 0.5]} position={[0, 1, -0.25]} castShadow>
                  <meshStandardMaterial color="#94a3b8" transparent opacity={0.4} wireframe />
                </Box>
                {/* Posts */}
                <Box args={[0.1, 2, 0.1]} position={[-2, 1, 0]} castShadow>
                  <meshStandardMaterial color="#ffffff" />
                </Box>
                <Box args={[0.1, 2, 0.1]} position={[2, 1, 0]} castShadow>
                  <meshStandardMaterial color="#ffffff" />
                </Box>
                <Box args={[4.1, 0.1, 0.1]} position={[0, 2.05, 0]} castShadow>
                  <meshStandardMaterial color="#ffffff" />
                </Box>
                {/* Penalty Box */}
                <Box args={[8, 0.015, 4]} position={[0, 0.025, 2]}>
                   <meshStandardMaterial color={lineStroke} transparent opacity={0.4}/>
                </Box>
              </group>
           ))}
           
           <AbstractPlayer 
              position={[-2, 0, courtL/4]} 
              color="#ef4444" 
              rotation={[0, 0, 0]} 
              movementDistance={1.5}
              movementSpeed={1.5}
              moveAxis="x"
              animate={animatePlayers}
              visible={visualizePlayers}
            />
           <AbstractPlayer 
              position={[2.0, 0, -courtL/4]} 
              color="#3b82f6" 
              rotation={[0, Math.PI, 0]} 
              movementDistance={2.0}
              movementSpeed={1.5}
              moveAxis="x"
              animate={animatePlayers}
              visible={visualizePlayers}
            />
           <AbstractPlayer 
              position={[0, 0, -courtL/2 + 0.8]} 
              color="#f59e0b" 
              rotation={[0, Math.PI, 0]} 
              movementDistance={1.8}
              movementSpeed={3.0}
              moveAxis="x"
              animate={animatePlayers}
              visible={visualizePlayers}
            />
            <SimulatedBall sportType="FOOTBALL" courtL={courtL} courtW={courtW} animate={animatePlayers} visible={visualizePlayers} />
        </group>
      )}
      
      {sportType === 'PICKLEBALL' && (
        <group>
           {/* Center Net */}
           <Box args={[courtW + 1, 0.3, 0.04]} position={[0, 0.15, 0]} castShadow>
             <meshStandardMaterial color="#222222" transparent opacity={0.6} wireframe />
           </Box>
           <Box args={[courtW + 1, 0.04, 0.05]} position={[0, 0.3, 0]}>
             <meshStandardMaterial color="#ffffff" />
           </Box>
           <Box args={[0.1, 0.35, 0.1]} position={[courtW/2 + 0.5, 0.175, 0]} castShadow>
             <meshStandardMaterial color="#444444" />
           </Box>
           <Box args={[0.1, 0.35, 0.1]} position={[-courtW/2 - 0.5, 0.175, 0]} castShadow>
             <meshStandardMaterial color="#444444" />
           </Box>
           
           {/* Kitchen line */}
           <Box args={[courtW, 0.015, 0.08]} position={[0, 0.025, 1.5]}>
             <meshStandardMaterial color={lineStroke} />
           </Box>
           <Box args={[courtW, 0.015, 0.08]} position={[0, 0.025, -1.5]}>
             <meshStandardMaterial color={lineStroke} />
           </Box>
           {/* Center divide */}
           <Box args={[0.08, 0.015, courtL/2 - 1.5]} position={[0, 0.025, (courtL/4) + 0.75]}>
             <meshStandardMaterial color={lineStroke} />
           </Box>
           <Box args={[0.08, 0.015, courtL/2 - 1.5]} position={[0, 0.025, -(courtL/4) - 0.75]}>
             <meshStandardMaterial color={lineStroke} />
           </Box>
           {/* Baselines */}
           <Box args={[courtW, 0.015, 0.08]} position={[0, 0.025, courtL/2]}>
             <meshStandardMaterial color={lineStroke} />
           </Box>
           <Box args={[courtW, 0.015, 0.08]} position={[0, 0.025, -courtL/2]}>
             <meshStandardMaterial color={lineStroke} />
           </Box>
           {/* Sidelines */}
           <Box args={[0.08, 0.015, courtL]} position={[courtW/2, 0.025, 0]}>
             <meshStandardMaterial color={lineStroke} />
           </Box>
           <Box args={[0.08, 0.015, courtL]} position={[-courtW/2, 0.025, 0]}>
             <meshStandardMaterial color={lineStroke} />
           </Box>
           
           <AbstractPlayer 
              position={[1, 0, 3]} 
              color="#3b82f6" 
              rotation={[0, -Math.PI*0.1, 0]} 
              movementDistance={2.0}
              movementSpeed={2.5}
              moveAxis="x"
              animate={animatePlayers}
              visible={visualizePlayers}
            />
           <AbstractPlayer 
              position={[-1, 0, -3]} 
              color="#e11d48" 
              rotation={[0, Math.PI, 0]} 
              movementDistance={1.8}
              movementSpeed={2.5}
              moveAxis="x"
              animate={animatePlayers}
              visible={visualizePlayers}
            />
            <SimulatedBall sportType="PICKLEBALL" courtL={courtL} courtW={courtW} animate={animatePlayers} visible={visualizePlayers} />
        </group>
      )}

      {sportType === 'BADMINTON' && (
        <group>
           {/* Distinctive High Badminton Net */}
           <Box args={[courtW, 0.625, 0.01]} position={[0, 0.9575, 0]} castShadow>
             <meshStandardMaterial color="#222222" transparent opacity={0.6} wireframe />
           </Box>
           <Box args={[courtW, 0.05, 0.02]} position={[0, 1.27, 0]}>
             <meshStandardMaterial color="#ffffff" />
           </Box>
           <Cylinder args={[0.04, 0.04, 1.27, 8]} position={[courtW/2, 1.27/2, 0]} castShadow>
             <meshStandardMaterial color="#9ca3af" roughness={0.4} metalness={0.7} />
           </Cylinder>
           <Cylinder args={[0.04, 0.04, 1.27, 8]} position={[-courtW/2, 1.27/2, 0]} castShadow>
             <meshStandardMaterial color="#9ca3af" roughness={0.4} metalness={0.7} />
           </Cylinder>
           
           {/* Lines specifically scaled for Badminton */}
           {/* Short Service lines */}
           <Box args={[courtW, 0.015, 0.06]} position={[0, 0.025, 1.625]}>
             <meshStandardMaterial color={lineStroke} />
           </Box>
           <Box args={[courtW, 0.015, 0.06]} position={[0, 0.025, -1.625]}>
             <meshStandardMaterial color={lineStroke} />
           </Box>
           
           {/* Center lines - between short service and back boundary */}
           <Box args={[0.06, 0.015, (courtL/2) - 1.625]} position={[0, 0.025, 1.625 + ((courtL/2 - 1.625)/2)]}>
             <meshStandardMaterial color={lineStroke} />
           </Box>
           <Box args={[0.06, 0.015, (courtL/2) - 1.625]} position={[0, 0.025, -(1.625 + ((courtL/2 - 1.625)/2))]}>
             <meshStandardMaterial color={lineStroke} />
           </Box>
           
           {/* Long service line (doubles) */}
           <Box args={[courtW, 0.015, 0.06]} position={[0, 0.025, courtL/2 - 0.625]}>
             <meshStandardMaterial color={lineStroke} />
           </Box>
           <Box args={[courtW, 0.015, 0.06]} position={[0, 0.025, -(courtL/2 - 0.625)]}>
             <meshStandardMaterial color={lineStroke} />
           </Box>
           
           {/* Back boundary lines */}
           <Box args={[courtW, 0.015, 0.06]} position={[0, 0.025, courtL/2]}>
             <meshStandardMaterial color={lineStroke} />
           </Box>
           <Box args={[courtW, 0.015, 0.06]} position={[0, 0.025, -courtL/2]}>
             <meshStandardMaterial color={lineStroke} />
           </Box>

           {/* Singles Sidelines */}
           <Box args={[0.06, 0.015, courtL]} position={[courtW/2 - 0.375, 0.025, 0]}>
             <meshStandardMaterial color={lineStroke} />
           </Box>
           <Box args={[0.06, 0.015, courtL]} position={[-courtW/2 + 0.375, 0.025, 0]}>
             <meshStandardMaterial color={lineStroke} />
           </Box>

           {/* Doubles Sidelines */}
           <Box args={[0.06, 0.015, courtL]} position={[courtW/2, 0.025, 0]}>
             <meshStandardMaterial color={lineStroke} />
           </Box>
           <Box args={[0.06, 0.015, courtL]} position={[-courtW/2, 0.025, 0]}>
             <meshStandardMaterial color={lineStroke} />
           </Box>
           
           <AbstractPlayer 
              position={[-1, 0, courtL*0.25]} 
              color="#10b981" 
              rotation={[0, Math.PI, 0]} 
              movementDistance={2.5}
              movementSpeed={2.8}
              moveAxis="x"
              animate={animatePlayers}
              visible={visualizePlayers}
            />
           <AbstractPlayer 
              position={[1, 0, -courtL*0.25]} 
              color="#ec4899" 
              rotation={[0, 0, 0]} 
              movementDistance={2.2}
              movementSpeed={2.8}
              moveAxis="x"
              animate={animatePlayers}
              visible={visualizePlayers}
            />
            <SimulatedBall sportType="BADMINTON" courtL={courtL} courtW={courtW} animate={animatePlayers} visible={visualizePlayers} />
        </group>
      )}

      {sportType === 'CRICKET' && (
        <group>
           {/* Circular Outfield Representation for realism */}
           <Cylinder args={[Math.max(courtW, courtL)*0.7, Math.max(courtW, courtL)*0.7, 0.08]} position={[0, -0.01, 0]} receiveShadow>
             <meshStandardMaterial color="#4ade80" roughness={1.0} />
           </Cylinder>
           
           {/* Cricket pitch - artificial turf / clay runway */}
           <Box args={[courtW * 0.15, 0.03, courtL * 0.6]} position={[0, 0.02, 0]} receiveShadow>
             <meshStandardMaterial color="#b45309" roughness={0.9} />
           </Box>
           
           {/* Crease lines */}
           <Box args={[courtW * 0.15, 0.01, 0.04]} position={[0, 0.04, courtL * 0.25]}>
             <meshStandardMaterial color={lineStroke} />
           </Box>
           <Box args={[courtW * 0.15, 0.01, 0.04]} position={[0, 0.04, -courtL * 0.25]}>
             <meshStandardMaterial color={lineStroke} />
           </Box>
           
           <Box args={[courtW * 0.18, 0.01, 0.04]} position={[0, 0.04, courtL * 0.28]}>
             <meshStandardMaterial color={lineStroke} />
           </Box>
           <Box args={[courtW * 0.18, 0.01, 0.04]} position={[0, 0.04, -courtL * 0.28]}>
             <meshStandardMaterial color={lineStroke} />
           </Box>

           {/* Stumps & Bails */}
           {[1, -1].map((side) => (
             <group key={side} position={[0, 0.035, side * courtL * 0.28]}>
                <Cylinder args={[0.025, 0.025, 0.5]} position={[-0.12, 0.25, 0]} castShadow>
                   <meshStandardMaterial color="#fcd34d" roughness={0.5} />
                </Cylinder>
                <Cylinder args={[0.025, 0.025, 0.5]} position={[0, 0.25, 0]} castShadow>
                   <meshStandardMaterial color="#fcd34d" roughness={0.5} />
                </Cylinder>
                <Cylinder args={[0.025, 0.025, 0.5]} position={[0.12, 0.25, 0]} castShadow>
                   <meshStandardMaterial color="#fcd34d" roughness={0.5} />
                </Cylinder>
                {/* Bails */}
                <Box args={[0.26, 0.02, 0.02]} position={[0, 0.51, 0]} castShadow>
                   <meshStandardMaterial color="#b45309" />
                </Box>
             </group>
           ))}
           
           {/* Optional Practice Netting Cage */}
           <Box args={[courtW * 0.35, 2.5, courtL * 0.65]} position={[0, 1.25, 0]}>
             <meshStandardMaterial color="#374151" transparent opacity={0.15} wireframe />
           </Box>
           
           <AbstractPlayer 
              position={[0, 0, courtL * 0.22]} 
              color="#ffffff" 
              rotation={[0, 0, 0]} 
              hasBallType="cricket"
              animate={animatePlayers}
              visible={visualizePlayers}
            />
           <AbstractPlayer 
              position={[-1, 0, -courtL * 0.22]} 
              color="#ef4444" 
              rotation={[0, Math.PI, 0]}
              animate={animatePlayers}
              visible={visualizePlayers} 
            />
           <AbstractPlayer 
              position={[0.2, 0, -courtL * 0.28]} 
              color="#fcd34d" 
              rotation={[0, Math.PI, 0]} 
              movementDistance={0.5}
              movementSpeed={1.5}
              moveAxis="z"
              animate={animatePlayers}
              visible={visualizePlayers}
            />
            <SimulatedBall sportType="CRICKET" courtL={courtL} courtW={courtW} animate={animatePlayers} visible={visualizePlayers} />
        </group>
      )}

      {sportType === 'GYM' && (
        <group>
           {/* Heavy rubberized gym flooring */}
           <Box args={[courtW, 0.14, courtL]} position={[0, -0.04, 0]} receiveShadow>
             <meshStandardMaterial color="#1f2937" roughness={0.6} />
           </Box>

           {/* Center Logo Decal */}
           <Cylinder args={[courtW*0.2, courtW*0.2, 0.01]} position={[0, 0.035, 0]}>
              <meshStandardMaterial color="#ef4444" transparent opacity={0.7} />
           </Cylinder>
           
           {/* Green Agility Sprint Track */}
           <group position={[-courtW/2 + courtW*0.15, 0.03, 0]}>
             <Box args={[courtW*0.12, 0.015, courtL * 0.8]} position={[0, 0, 0]} receiveShadow>
               <meshStandardMaterial color="#10b981" roughness={0.8} />
             </Box>
             {Array.from({length: 12}).map((_, i) => (
               <Box key={i} args={[courtW*0.08, 0.005, 0.05]} position={[0, 0.01, (i - 5.5) * (courtL * 0.8 / 12)]}>
                 <meshStandardMaterial color={lineStroke} />
               </Box>
             ))}
           </group>

           {/* Powerlifting/Olympic Platforms & Racks */}
           {[1, -1].map((side) => (
             <group key={side} position={[courtW*0.2, 0.03, side * courtL*0.25]}>
               {/* Squat Rack Frame */}
               <Box args={[0.1, 1.8, 0.1]} position={[-0.8, 0.9, -0.8]} castShadow><meshStandardMaterial color="#9ca3af" metalness={0.7} /></Box>
               <Box args={[0.1, 1.8, 0.1]} position={[-0.8, 0.9, 0.8]} castShadow><meshStandardMaterial color="#9ca3af" metalness={0.7} /></Box>
               <Box args={[0.1, 1.8, 0.1]} position={[0.8, 0.9, -0.8]} castShadow><meshStandardMaterial color="#9ca3af" metalness={0.7} /></Box>
               <Box args={[0.1, 1.8, 0.1]} position={[0.8, 0.9, 0.8]} castShadow><meshStandardMaterial color="#9ca3af" metalness={0.7} /></Box>
               <Box args={[1.7, 0.1, 0.1]} position={[0, 1.8, -0.8]} castShadow><meshStandardMaterial color="#4b5563" /></Box>
               <Box args={[1.7, 0.1, 0.1]} position={[0, 1.8, 0.8]} castShadow><meshStandardMaterial color="#4b5563" /></Box>
               
               {/* Lifting Platform Base */}
               <Box args={[3, 0.05, 2.5]} receiveShadow>
                 <meshStandardMaterial color="#030712" />
               </Box>
               <Box args={[1.2, 0.06, 2.5]} receiveShadow>
                 <meshStandardMaterial color="#fcd34d" roughness={0.5} />
               </Box>

               {/* Barbell Assembly */}
               <Cylinder args={[0.025, 0.025, 1.8]} position={[0, 0.2, 0]} rotation={[Math.PI/2, 0, 0]} castShadow>
                 <meshStandardMaterial color="#e5e7eb" metalness={0.9} />
               </Cylinder>
               <Cylinder args={[0.25, 0.25, 0.1]} position={[0, 0.2, 0.65]} rotation={[Math.PI/2, 0, 0]} castShadow>
                 <meshStandardMaterial color="#ef4444" roughness={0.8} />
               </Cylinder>
               <Cylinder args={[0.25, 0.25, 0.1]} position={[0, 0.2, -0.65]} rotation={[Math.PI/2, 0, 0]} castShadow>
                 <meshStandardMaterial color="#ef4444" roughness={0.8} />
               </Cylinder>
             </group>
           ))}
           
           <AbstractPlayer 
              position={[-courtW/2 + courtW*0.15, 0, -2]} 
              color="#fcd34d" 
              rotation={[0, 0, 0]} 
              movementDistance={2.5}
              movementSpeed={3.0}
              moveAxis="z"
              animate={animatePlayers}
              visible={visualizePlayers}
            />
           <AbstractPlayer 
              position={[courtW*0.2, 0, courtL*0.25 - 1]} 
              color="#3b82f6" 
              rotation={[0, Math.PI, 0]} 
              movementDistance={0.8}
              movementSpeed={1.0}
              moveAxis="x"
              animate={animatePlayers}
              visible={visualizePlayers}
            />
        </group>
      )}

      {sportType === 'TRACK_FIELD' && (
        <group>
           {/* Grass Infield Area */}
           <Cylinder args={[courtW * 0.35, courtW * 0.35, 0.1]} position={[0, -0.01, courtL*0.25]} rotation={[0, -Math.PI/2, 0]}>
              <meshStandardMaterial color="#22c55e" roughness={0.9} />
           </Cylinder>
           <Cylinder args={[courtW * 0.35, courtW * 0.35, 0.1]} position={[0, -0.01, -courtL*0.25]} rotation={[0, Math.PI/2, 0]}>
              <meshStandardMaterial color="#22c55e" roughness={0.9} />
           </Cylinder>
           <Box args={[courtW * 0.7, 0.1, courtL * 0.5]} position={[0, -0.01, 0]}>
             <meshStandardMaterial color="#22c55e" roughness={0.9} />
           </Box>

           {/* Running Track Surrounds */}
           <Cylinder args={[courtW * 0.5, courtW * 0.5, 0.08]} position={[0, -0.01, courtL*0.25]} rotation={[0, -Math.PI/2, 0]}>
              <meshStandardMaterial color="#dc2626" roughness={0.9} />
           </Cylinder>
           <Cylinder args={[courtW * 0.5, courtW * 0.5, 0.08]} position={[0, -0.01, -courtL*0.25]} rotation={[0, Math.PI/2, 0]}>
              <meshStandardMaterial color="#dc2626" roughness={0.9} />
           </Cylinder>
           <Box args={[courtW, 0.08, courtL * 0.5]} position={[0, -0.01, 0]}>
             <meshStandardMaterial color="#dc2626" roughness={0.9} />
           </Box>

           {/* Linear Track Markings & Hurdles on straightaways */}
           {Array.from({length: 4}).map((_, i) => (
             <group key={i}>
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
                   <ringGeometry args={[(courtW * 0.75 + i*(courtW * 0.25 / 4))/2, (courtW * 0.75 + i*(courtW * 0.25 / 4))/2 + 0.04, 32]} />
                   <meshStandardMaterial color={lineStroke} />
                </mesh>
             </group>
           ))}
           
           {Array.from({length: 5}).map((_, i) => (
             <group key={i} position={[courtW/2 - 1, 0, (i - 2) * (courtL*0.1)]}>
               <Box args={[0.02, 0.4, 0.02]} position={[-0.4, 0.2, 0]} castShadow><meshStandardMaterial color="#e5e7eb" /></Box>
               <Box args={[0.02, 0.4, 0.02]} position={[0.4, 0.2, 0]} castShadow><meshStandardMaterial color="#e5e7eb" /></Box>
               <Box args={[0.8, 0.06, 0.02]} position={[0, 0.4, 0]} castShadow><meshStandardMaterial color="#ef4444" /></Box>
             </group>
           ))}
           
           <AbstractPlayer 
              position={[courtW/2 - 2, 0, courtL*0.2]} 
              color="#10b981" 
              rotation={[0, Math.PI, 0]} 
              movementDistance={2.5}
              movementSpeed={4.0}
              moveAxis="z"
              animate={animatePlayers}
              visible={visualizePlayers}
            />
           <AbstractPlayer 
              position={[-courtW/2 + 2, 0, -courtL*0.2]} 
              color="#3b82f6" 
              rotation={[0, 0, 0]} 
              movementDistance={2.5}
              movementSpeed={3.5}
              moveAxis="z"
              animate={animatePlayers}
              visible={visualizePlayers}
            />
        </group>
      )}

       {sportType === 'SWIMMING_POOL' && (
         <group>
            {/* Deep pool concrete frame */}
            <Box args={[courtW + 0.4, 0.6, courtL + 0.4]} position={[0, -0.3, 0]} receiveShadow>
              <meshStandardMaterial color="#334155" roughness={0.7} />
            </Box>
 
            {/* Beautiful water block - translucent blue reflection */}
            <Box args={[courtW - 0.2, 0.5, courtL - 0.2]} position={[0, -0.22, 0]} castShadow receiveShadow>
              <meshStandardMaterial 
                color="#0ea5e9" 
                roughness={0.15} 
                metalness={0.45} 
                transparent 
                opacity={0.65} 
              />
            </Box>
 
            {/* Pool Steps ladder */}
            {[-1, 1].map((xSide) => (
              <group key={xSide} position={[xSide * (courtW/2 - 0.4), 0, -courtL/2 + 1.2]}>
                <Cylinder args={[0.02, 0.02, 0.6, 8]} position={[0, 0.3, 0]} castShadow>
                  <meshStandardMaterial color="#9ca3af" roughness={0.1} metalness={0.9} />
                </Cylinder>
                <Box args={[0.2, 0.02, 0.1]} position={[0, 0.2, 0]}>
                  <meshStandardMaterial color="#e2e8f0" />
                </Box>
              </group>
            ))}
 
            {/* Pool lines on floor */}
            {Array.from({length: 3}).map((_, i) => (
              <Box key={i} args={[0.04, 0.015, courtL - 1.5]} position={[(i - 1) * (courtW / 4), -0.47, 0]}>
                <meshStandardMaterial color="#0284c7" />
              </Box>
            ))}
 
            {/* Rest/swimming abstract players */}
            <AbstractPlayer 
               position={[-courtW/2 + 1.2, 0, courtL * 0.25]} 
               color="#38bdf8" 
               rotation={[0, Math.PI / 2, 0]} 
               movementDistance={1.2}
               movementSpeed={1.5}
               moveAxis="z"
               animate={animatePlayers}
               visible={visualizePlayers}
             />
            <AbstractPlayer 
               position={[courtW/2 - 1.2, 0, -courtL * 0.25]} 
               color="#ec4899" 
               rotation={[0, -Math.PI / 2, 0]} 
               movementDistance={1.5}
               movementSpeed={1.2}
               moveAxis="z"
               animate={animatePlayers}
               visible={visualizePlayers}
             />
         </group>
       )}
 
       {sportType === 'SQUASH' && (
         <group>
            {/* Wooden squash hardwood floor overlay */}
            <Box args={[courtW, 0.14, courtL]} position={[0, -0.04, 0]} receiveShadow>
              <meshStandardMaterial color="#F1C27B" roughness={0.3} metalness={0.1} />
            </Box>
 
            {/* Front squash plaster white wall */}
            <Box args={[courtW, 3.5, 0.1]} position={[0, 1.75, -courtL/2]} castShadow>
              <meshStandardMaterial color="#ffffff" roughness={0.95} />
            </Box>
            {/* Red Board line at the bottom of the front wall */}
            <Box args={[courtW, 0.45, 0.12]} position={[0, 0.225, -courtL/2 + 0.01]} castShadow>
              <meshStandardMaterial color="#991b1b" roughness={0.8} />
            </Box>
            {/* Middle service line */}
            <Box args={[courtW, 0.06, 0.12]} position={[0, 1.6, -courtL/2 + 0.01]}>
              <meshStandardMaterial color="#ef4444" />
            </Box>
            {/* Out-of-court top wall line */}
            <Box args={[courtW, 0.06, 0.12]} position={[0, 3.2, -courtL/2 + 0.01]}>
              <meshStandardMaterial color="#ef4444" />
            </Box>
 
            {/* Side plaster walls */}
            <Box args={[0.1, 3.5, courtL]} position={[-courtW/2, 1.75, 0]} castShadow>
              <meshStandardMaterial color="#f5f5f4" roughness={0.95} />
            </Box>
            <Box args={[0.1, 3.5, courtL]} position={[courtW/2, 1.75, 0]} castShadow>
              <meshStandardMaterial color="#f5f5f4" roughness={0.95} />
            </Box>
 
            {/* Glass back wall */}
            <Box args={[courtW, 2.2, 0.08]} position={[0, 1.1, courtL/2]} castShadow>
              <meshStandardMaterial color="#bae6fd" transparent opacity={0.25} roughness={0.05} metalness={0.85} />
            </Box>
            {/* Red Out boundary boundary back wall line */}
            <Box args={[courtW, 0.04, 0.1]} position={[0, 2.13, courtL/2 - 0.01]}>
              <meshStandardMaterial color="#ef4444" />
            </Box>
 
            {/* Red markings on floor */}
            {/* Short Service line across court width */}
            <Box args={[courtW, 0.02, 0.05]} position={[0, 0.035, courtL * 0.12]}>
              <meshStandardMaterial color="#ef4444" />
            </Box>
            {/* Longitudinal half-court line */}
            <Box args={[0.05, 0.02, courtL * 0.38]} position={[0, 0.035, courtL * 0.31]}>
              <meshStandardMaterial color="#ef4444" />
            </Box>
            {/* Left service box */}
            <Box args={[courtW * 0.25, 0.02, 0.05]} position={[-courtW * 0.375, 0.035, courtL * 0.12]}>
              <meshStandardMaterial color="#ef4444" />
            </Box>
            <Box args={[0.05, 0.02, courtL * 0.15]} position={[-courtW * 0.25, 0.035, courtL * 0.195]}>
              <meshStandardMaterial color="#ef4444" />
            </Box>
            {/* Right service box */}
            <Box args={[courtW * 0.25, 0.02, 0.05]} position={[courtW * 0.375, 0.035, courtL * 0.12]}>
              <meshStandardMaterial color="#ef4444" />
            </Box>
            <Box args={[0.05, 0.02, courtL * 0.15]} position={[courtW * 0.25, 0.035, courtL * 0.195]}>
              <meshStandardMaterial color="#ef4444" />
            </Box>
 
            {/* Squash abstract players pacing around playing */}
            <AbstractPlayer 
               position={[-1.2, 0, courtL * 0.1]} 
               color="#3b82f6" 
               rotation={[0, 0, 0]} 
               movementDistance={1.2}
               movementSpeed={2.5}
               moveAxis="x"
               animate={animatePlayers}
               visible={visualizePlayers}
             />
            <AbstractPlayer 
               position={[1.2, 0, courtL * 0.22]} 
               color="#ea580c" 
               rotation={[0, Math.PI, 0]} 
               movementDistance={1.5}
               movementSpeed={2.5}
               moveAxis="z"
               animate={animatePlayers}
               visible={visualizePlayers}
             />
            <SimulatedBall sportType="SQUASH" courtL={courtL} courtW={courtW} animate={animatePlayers} visible={visualizePlayers} />
          </group>
        )}

       {sportType === 'VOLLEYBALL' && (
         <group>
            {/* Center Line directly below net */}
            <Box args={[courtW, 0.015, 0.05]} position={[0, 0.025, 0]}>
              <meshStandardMaterial color={lineStroke} />
            </Box>

            {/* Attack Lines (3m / ~10ft on each side of the net) */}
            <Box args={[courtW, 0.015, 0.05]} position={[0, 0.025, 10]}>
              <meshStandardMaterial color={lineStroke} />
            </Box>
            <Box args={[courtW, 0.015, 0.05]} position={[0, 0.025, -10]}>
              <meshStandardMaterial color={lineStroke} />
            </Box>

            {/* Boundary Outlines - End lines */}
            <Box args={[courtW, 0.015, 0.05]} position={[0, 0.025, courtL/2]}>
              <meshStandardMaterial color={lineStroke} />
            </Box>
            <Box args={[courtW, 0.015, 0.05]} position={[0, 0.025, -courtL/2]}>
              <meshStandardMaterial color={lineStroke} />
            </Box>

            {/* Boundary Outlines - Sidelines */}
            <Box args={[0.05, 0.015, courtL]} position={[courtW/2, 0.025, 0]}>
              <meshStandardMaterial color={lineStroke} />
            </Box>
            <Box args={[0.05, 0.015, courtL]} position={[-courtW/2, 0.025, 0]}>
              <meshStandardMaterial color={lineStroke} />
            </Box>

            {/* Heavy steel posts on both sides of court */}
            <Cylinder args={[0.04, 0.04, 2.4, 8]} position={[courtW/2 + 0.2, 1.2, 0]} castShadow>
              <meshStandardMaterial color="#3b82f6" roughness={0.3} metalness={0.8} />
            </Cylinder>
            <Cylinder args={[0.04, 0.04, 2.4, 8]} position={[-courtW/2 - 0.2, 1.2, 0]} castShadow>
              <meshStandardMaterial color="#3b82f6" roughness={0.3} metalness={0.8} />
            </Cylinder>

            {/* The professional mesh Volleyball Net */}
            <Box args={[courtW + 0.4, 0.8, 0.015]} position={[0, 1.8, 0]} castShadow>
              <meshStandardMaterial color="#1e293b" transparent opacity={0.5} wireframe />
            </Box>
            {/* White top edge tape of the net */}
            <Box args={[courtW + 0.4, 0.07, 0.022]} position={[0, 2.2, 0]}>
              <meshStandardMaterial color="#ffffff" roughness={0.6} />
            </Box>
            {/* White bottom tape of the net */}
            <Box args={[courtW + 0.4, 0.04, 0.022]} position={[0, 1.4, 0]}>
              <meshStandardMaterial color="#ffffff" roughness={0.6} />
            </Box>

            {/* Red net antennae indicators */}
            <Cylinder args={[0.01, 0.01, 1.2, 8]} position={[courtW/2, 2.0, 0]}>
              <meshStandardMaterial color="#ef4444" />
            </Cylinder>
            <Cylinder args={[0.01, 0.01, 1.2, 8]} position={[-courtW/2, 2.0, 0]}>
              <meshStandardMaterial color="#ef4444" />
            </Cylinder>

            {/* Dynamic active players */}
            {/* Team A (Blue side) */}
            <AbstractPlayer 
               position={[1.5, 0, courtL * 0.15]} 
               color="#3b82f6" 
               rotation={[0, Math.PI, 0]} 
               movementDistance={1.5}
               movementSpeed={2.2}
               moveAxis="x"
               animate={animatePlayers}
               visible={visualizePlayers}
             />
            <AbstractPlayer 
               position={[-1.2, 0, courtL * 0.35]} 
               color="#2563eb" 
               rotation={[0, Math.PI, 0]} 
               movementDistance={1.8}
               movementSpeed={1.8}
               moveAxis="z"
               animate={animatePlayers}
               visible={visualizePlayers}
             />

            {/* Team B (Pink/Orange side) */}
            <AbstractPlayer 
               position={[-1.5, 0, -courtL * 0.15]} 
               color="#ec4899" 
               rotation={[0, 0, 0]} 
               movementDistance={1.5}
               movementSpeed={2.2}
               moveAxis="x"
               animate={animatePlayers}
               visible={visualizePlayers}
             />
            <AbstractPlayer 
               position={[1.2, 0, -courtL * 0.35]} 
               color="#db2777" 
               rotation={[0, 0, 0]} 
               movementDistance={1.8}
               movementSpeed={1.8}
               moveAxis="z"
               animate={animatePlayers}
               visible={visualizePlayers}
             />

            <SimulatedBall sportType="VOLLEYBALL" courtL={courtL} courtW={courtW} animate={animatePlayers} visible={visualizePlayers} />
         </group>
       )}

      {/* Smart Floodlights */}
      {selectedSmartFeatures.includes('SMART_FLOODLIGHTS') && (
         <group>
            {[
              [courtW/2 + 1, -courtL/2 - 1],
              [-courtW/2 - 1, -courtL/2 - 1],
              [courtW/2 + 1, courtL/2 + 1],
              [-courtW/2 - 1, courtL/2 + 1]
            ].map((pos, idx) => (
              <group key={idx} position={[pos[0], 0, pos[1]]}>
                 <Box args={[0.2, 5, 0.2]} position={[0, 2.5, 0]} castShadow>
                    <meshStandardMaterial color="#6b7280" />
                 </Box>
                 <pointLight position={[0, 5.5, 0]} intensity={1.5} distance={15} color="#FEF08A" castShadow />
                 <Box args={[0.5, 0.2, 0.2]} position={[0, 5, 0]}>
                    <meshStandardMaterial color="#9ca3af" emissive="#FEF08A" emissiveIntensity={2} />
                 </Box>
              </group>
            ))}
         </group>
      )}

      {/* Fencing */}
      {selectedSmartFeatures.includes('PERIPHERAL_FENCING') && (
         <Box args={[runoutW, 2, runoutL]} position={[0, 1, 0]} receiveShadow>
            <meshStandardMaterial color="#6b7280" transparent opacity={0.3} wireframe />
         </Box>
      )}
    </group>
  );
};

export const CourtVisualizer: React.FC<VisualizerProps> = ({ config }) => {
  return (
    <div className="relative w-full aspect-[5/3] bg-zinc-950 rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center p-0 border border-zinc-800">
      
      <Canvas shadows camera={{ position: [0, 9, 15], fov: 45 }}>
        <color attach="background" args={['#09090b']} />
        
        {/* Environment & Lighting Upgrade */}
        <ambientLight intensity={0.6} />
        <directionalLight 
           castShadow 
           position={[10, 20, 10]} 
           intensity={1.5} 
           shadow-mapSize-width={2048} 
           shadow-mapSize-height={2048}
           shadow-bias={-0.0001}
        />
        <Environment preset="city" />
        <ContactShadows position={[0, -0.05, 0]} opacity={0.7} scale={35} blur={2.5} far={4} color="#000000" resolution={512} />

        <Suspense fallback={null}>
          <CourtScene config={config} />
        </Suspense>

        <OrbitControls 
          enablePan={false}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.1}
          minDistance={5}
          maxDistance={30}
          autoRotate
          autoRotateSpeed={0.8}
        />
      </Canvas>

      {/* Floating Status Badge */}
      <div className="absolute top-5 right-5 bg-zinc-950/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5 text-[9px] font-mono tracking-wider text-emerald-400 uppercase select-none pointer-events-none z-10 transition-opacity">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
        LIVE 3D SIMULATION
      </div>
      
      {/* 3D instruction */}
      <div className="absolute bottom-5 right-5 bg-zinc-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-zinc-700/50 text-[10px] font-sans text-zinc-300 select-none pointer-events-none z-10">
        Drag to rotate • Scroll to zoom
      </div>
    </div>
  );
};

