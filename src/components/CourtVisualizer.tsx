/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, useRef } from 'react';
import { CourtConfiguration } from '../types';
import { COLORS } from '../constants';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls, Environment, ContactShadows, Box, Cylinder, Sphere, Detailed, Line, Bvh } from '@react-three/drei';

export function getPlayersForSport(
  sportType: string,
  primaryColor: string,
  secondaryColor: string,
  courtL: number,
  courtW: number
) {
  const teamAColor = primaryColor;
  let teamBColor = '#dc2626';
  if (primaryColor.toLowerCase() === '#dc2626' || primaryColor.toLowerCase() === '#ef4444') {
    teamBColor = '#2563eb';
  } else if (primaryColor.toLowerCase() === '#3b82f6' || primaryColor.toLowerCase() === '#1d4ed8') {
    teamBColor = '#ea580c';
  }
  
  const list: { id: string; team: 'A' | 'B' | 'neutral'; role: string; color: string }[] = [];
  
  if (sportType === 'BASKETBALL') {
    for (let i = 0; i < 5; i++) {
      list.push({ id: `bas-a-${i}`, team: 'A', role: `player_${i}`, color: teamAColor });
      list.push({ id: `bas-b-${i}`, team: 'B', role: `player_${i}`, color: teamBColor });
    }
  } else if (sportType === 'FOOTBALL') {
    for (let i = 0; i < 5; i++) {
      list.push({ id: `f-a-${i}`, team: 'A', role: `player_${i}`, color: teamAColor });
      list.push({ id: `f-b-${i}`, team: 'B', role: `player_${i}`, color: teamBColor });
    }
  } else if (sportType === 'VOLLEYBALL') {
    for (let i = 0; i < 6; i++) {
      list.push({ id: `v-a-${i}`, team: 'A', role: `player_${i}`, color: teamAColor });
      list.push({ id: `v-b-${i}`, team: 'B', role: `player_${i}`, color: teamBColor });
    }
  } else if (sportType === 'TENNIS' || sportType === 'PICKLEBALL' || sportType === 'BADMINTON') {
    for (let i = 0; i < 1; i++) {
      list.push({ id: `t-a-${i}`, team: 'A', role: `player_${i}`, color: teamAColor });
      list.push({ id: `t-b-${i}`, team: 'B', role: `player_${i}`, color: teamBColor });
    }
  } else if (sportType === 'SQUASH') {
    list.push({ id: `sq-a`, team: 'A', role: `player_0`, color: teamAColor });
    list.push({ id: `sq-b`, team: 'B', role: `player_0`, color: teamBColor });
  } else if (sportType === 'CRICKET') {
    list.push({ id: `cri-batter-1`, team: 'B', role: `batter`, color: '#ffffff' });
    list.push({ id: `cri-batter-2`, team: 'B', role: `non_striker`, color: '#ffffff' });
    list.push({ id: `cri-bowler`, team: 'A', role: `bowler`, color: teamAColor });
    list.push({ id: `cri-keeper`, team: 'A', role: `keeper`, color: teamAColor });
    list.push({ id: `cri-field-1`, team: 'A', role: `fielder_1`, color: teamAColor });
    list.push({ id: `cri-field-2`, team: 'A', role: `fielder_2`, color: teamAColor });
    list.push({ id: `cri-field-3`, team: 'A', role: `fielder_3`, color: teamAColor });
  } else if (sportType === 'SWIMMING_POOL') {
    list.push({ id: `sw-1`, team: 'neutral', role: `swimmer_0`, color: '#38bdf8' });
    list.push({ id: `sw-2`, team: 'neutral', role: `swimmer_1`, color: '#ec4899' });
    list.push({ id: `sw-3`, team: 'neutral', role: `swimmer_2`, color: '#facc15' });
  } else if (sportType === 'GYM') {
    list.push({ id: `gym-squat`, team: 'neutral', role: `squatter`, color: teamAColor });
    list.push({ id: `gym-sprint`, team: 'neutral', role: `runner`, color: teamBColor });
    list.push({ id: `gym-curl`, team: 'neutral', role: `curler`, color: '#a855f7' });
  } else if (sportType === 'TRACK_FIELD') {
    for (let i = 0; i < 4; i++) {
      list.push({ id: `tf-${i}`, team: 'neutral', role: `sprinter_${i}`, color: i % 2 === 0 ? teamAColor : teamBColor });
    }
  }
  return list;
}

function getRawBasketballPositions(
  stateTime: number,
  isAttackA: boolean,
  courtL: number,
  courtW: number
): {
  playersA: [number, number, number][];
  playersB: [number, number, number][];
  ball: [number, number, number];
} {
  const tPlay = Math.min(8.0, stateTime);

  const playersA: [number, number, number][] = [
    [0, 0, courtL * 0.4],
    [-courtW * 0.35, 0, courtL * 0.25],
    [courtW * 0.35, 0, courtL * 0.22],
    [-courtW * 0.2, 0, courtL * 0.12],
    [0, 0, courtL * 0.08]
  ];
  
  const playersB: [number, number, number][] = [
    [0, 0, -courtL * 0.4],
    [courtW * 0.35, 0, -courtL * 0.25],
    [-courtW * 0.35, 0, -courtL * 0.22],
    [courtW * 0.2, 0, -courtL * 0.12],
    [0, 0, -courtL * 0.08]
  ];

  let ballX = 0;
  let ballY = 0.12;
  let ballZ = 0;

  if (isAttackA) {
    // 1. Point Guard (A0) - Drive Up
    if (tPlay < 2.5) {
      const p = tPlay / 2.5;
      const pgX = Math.sin(tPlay * 2) * 1.5;
      playersA[0] = [pgX, 0, courtL * 0.4 - (courtL * 0.15) * p];
    } else {
      const p_shift = (tPlay - 2.5) / 5.5;
      playersA[0] = [Math.sin(2.5 * 2) * 1.5 + p_shift * 0.5, 0, courtL * 0.25];
    }

    // Left Wing (A1) moves slowly in stance
    playersA[1] = [-courtW * 0.35 + Math.sin(tPlay * 1.2) * 0.4, 0, courtL * 0.25 + Math.cos(tPlay * 1.2) * 0.3];

    // Right Wing (A2) moves in for pass, then stays to watch
    if (tPlay < 2.5) {
      playersA[2] = [courtW * 0.35, 0, courtL * 0.22];
    } else if (tPlay < 4.5) {
      const p = (tPlay - 2.5) / 2.0;
      playersA[2] = [courtW * 0.35 - p * (courtW * 0.15), 0, courtL * 0.22 - p * (courtL * 0.12)];
    } else {
      const p_late = (tPlay - 4.5) / 3.5;
      playersA[2] = [courtW * 0.2 - p_late * 0.2, 0, courtL * 0.1 + p_late * 0.3];
    }

    // Power Forward (A3) sets screen
    playersA[3] = [-courtW * 0.2 + Math.cos(tPlay * 1.1) * 0.3, 0, courtL * 0.12 + Math.sin(tPlay * 1.1) * 0.3];

    // Center (A4) moves underneath, then jumps for catch/dunk!
    if (tPlay < 4.5) {
      const p = tPlay / 4.5;
      playersA[4] = [0 + Math.sin(tPlay * 1.5) * 0.4, 0, courtL * 0.08 - p * (courtL * 0.18)];
    } else if (tPlay < 6.5) {
      const p = (tPlay - 4.5) / 2.0;
      const startX = Math.sin(4.5 * 1.5) * 0.4;
      const startZ = courtL * 0.08 - (courtL * 0.18);
      const endX = 0;
      const endZ = -courtL * 0.35 + 2.0;
      playersA[4] = [startX + (endX - startX) * p, 0, startZ + (endZ - startZ) * p];
    } else {
      const p = (tPlay - 6.5) / 1.5;
      const jumpH = 1.0 * Math.sin(p * Math.PI);
      playersA[4] = [0, jumpH, -courtL * 0.35 + 2.0 - p * 0.5];
    }

    // --- Ball Coordinates (A's ball possession) ---
    const pgX_static = Math.sin(2.5 * 2) * 1.5;
    const pgZ_static = courtL * 0.25;
    const ballX_start = pgX_static + 0.4 * Math.cos(2.5 * 8);
    const ballZ_start = pgZ_static + 0.2;
    const ballY_start = 0.5 + 0.45 * Math.abs(Math.sin(2.5 * 8));

    if (tPlay < 2.5) {
      ballX = playersA[0][0] + 0.4 * Math.cos(tPlay * 8);
      ballZ = playersA[0][2] + 0.2;
      ballY = 0.5 + 0.45 * Math.abs(Math.sin(tPlay * 8));
    } else if (tPlay < 4.5) {
      const p = (tPlay - 2.5) / 2.0;
      ballX = ballX_start + (playersA[2][0] - ballX_start) * p;
      ballZ = ballZ_start + (playersA[2][2] - ballZ_start) * p;
      ballY = ballY_start * (1 - p) + 0.8 * p + 1.2 * Math.sin(p * Math.PI);
    } else if (tPlay < 6.5) {
      const p = (tPlay - 4.5) / 2.0;
      const ballX_mid = playersA[2][0];
      const ballZ_mid = playersA[2][2];
      const ballY_mid = 0.8;
      ballX = ballX_mid + (playersA[4][0] - ballX_mid) * p;
      ballZ = ballZ_mid + (playersA[4][2] - ballZ_mid) * p;
      ballY = ballY_mid * (1 - p) + 1.2 * p + 0.8 * Math.sin(p * Math.PI);
    } else {
      const p = (tPlay - 6.5) / 1.5;
      const jumpH = playersA[4][1];
      if (p < 0.6) {
        ballX = playersA[4][0];
        ballY = 1.0 + jumpH + 0.2;
        ballZ = playersA[4][2] - 0.2 * (p / 0.6);
      } else {
        const dp = (p - 0.6) / 0.4;
        
        // Physics-based collision bounce & roll handler
        // dp goes 0 to 1 (lasts ~0.6 seconds in tPlay)
        // Simulate gravity physics: h = max(0, startH - 0.5 * g * t^2), with dampening restitution
        
        const gravity = 9.8;
        const tBounce = dp * 0.6; // exact time since let go
        let currentH = 1.0 + jumpH + 0.2;
        let v0 = 0; // dropped from dunk
        let restitution = 0.6;
        let tAccum = 0;
        
        // Compute deterministic bounce
        let bY = currentH;
        let tRemaining = tBounce;
        
        while (tRemaining > 0) {
            // physics step
            let flightTime = Math.sqrt((2 * bY) / gravity);
            if (tRemaining > flightTime) {
                // completed a bounce step
                tRemaining -= flightTime;
                bY = bY * restitution; // new peak height for next bounce
                if (bY < 0.05) { bY = 0; break; } // rolling
            } else {
                // currently in this arc
                // h = v0*t - 0.5*g*t^2, but from peak it's just peak - 0.5*g*(t - half_flight)^2
                let halfFlight = Math.sqrt((2 * bY) / gravity);
                let timeFromPeak = tRemaining > halfFlight ? (tRemaining - halfFlight) : (halfFlight - tRemaining);
                bY = bY - 0.5 * gravity * timeFromPeak * timeFromPeak;
                break;
            }
        }
        
        ballX = 0;
        ballZ = -courtL / 2 + 0.5 + dp * 1.5; // rolls forward slightly
        ballY = 0.12 + Math.max(0, bY);
      }
    }

    // Team B shadow-defense
    for (let i = 0; i < 5; i++) {
       playersB[i] = [
         playersA[i][0] * 0.82 + Math.sin(tPlay * 1.5 + i) * 0.2,
         0,
         playersA[i][2] * 0.82 - 0.5
       ];
    }
  } else {
    // Team B Attacks
    // B0 (Point Guard) - Drive Up
    if (tPlay < 2.5) {
      const p = tPlay / 2.5;
      const pgX = -Math.sin(tPlay * 2) * 1.5;
      playersB[0] = [pgX, 0, -courtL * 0.4 + (courtL * 0.15) * p];
    } else {
      const p_shift = (tPlay - 2.5) / 5.5;
      playersB[0] = [-Math.sin(2.5 * 2) * 1.5 - p_shift * 0.5, 0, -courtL * 0.25];
    }

    // Right Wing B1 moves stance
    playersB[1] = [courtW * 0.35 - Math.sin(tPlay * 1.2) * 0.4, 0, -courtL * 0.25 - Math.cos(tPlay * 1.2) * 0.3];

    // Left Wing B2 moves in for pass, then stays to watch
    if (tPlay < 2.5) {
      playersB[2] = [-courtW * 0.35, 0, -courtL * 0.22];
    } else if (tPlay < 4.5) {
      const p = (tPlay - 2.5) / 2.0;
      playersB[2] = [-courtW * 0.35 + p * (courtW * 0.15), 0, -courtL * 0.22 + p * (courtL * 0.12)];
    } else {
      const p_late = (tPlay - 4.5) / 3.5;
      playersB[2] = [-courtW * 0.2 + p_late * 0.2, 0, -courtL * 0.1 - p_late * 0.3];
    }

    // Power Forward B3 sets screen
    playersB[3] = [courtW * 0.2 - Math.cos(tPlay * 1.1) * 0.3, 0, -courtL * 0.12 - Math.sin(tPlay * 1.1) * 0.3];

    // Center B4 moves into position, then jumps for catch/dunk!
    if (tPlay < 4.5) {
      const p = tPlay / 4.5;
      playersB[4] = [0 - Math.sin(tPlay * 1.5) * 0.4, 0, -courtL * 0.08 + p * (courtL * 0.18)];
    } else if (tPlay < 6.5) {
      const p = (tPlay - 4.5) / 2.0;
      const startX = -Math.sin(4.5 * 1.5) * 0.4;
      const startZ = -courtL * 0.08 + (courtL * 0.18);
      const endX = 0;
      const endZ = courtL * 0.35 - 2.0;
      playersB[4] = [startX + (endX - startX) * p, 0, startZ + (endZ - startZ) * p];
    } else {
      const p = (tPlay - 6.5) / 1.5;
      const jumpH = 1.0 * Math.sin(p * Math.PI);
      playersB[4] = [0, jumpH, courtL * 0.35 - 2.0 + p * 0.5];
    }

    // --- Ball Coordinates (B's ball possession) ---
    const pgX_staticB = -Math.sin(2.5 * 2) * 1.5;
    const pgZ_staticB = -courtL * 0.25;
    const ballX_startB = pgX_staticB - 0.4 * Math.cos(2.5 * 8);
    const ballZ_startB = pgZ_staticB - 0.2;
    const ballY_startB = 0.5 + 0.45 * Math.abs(Math.sin(2.5 * 8));

    if (tPlay < 2.5) {
      ballX = playersB[0][0] - 0.4 * Math.cos(tPlay * 8);
      ballZ = playersB[0][2] - 0.2;
      ballY = 0.5 + 0.45 * Math.abs(Math.sin(tPlay * 8));
    } else if (tPlay < 4.5) {
      const p = (tPlay - 2.5) / 2.0;
      ballX = ballX_startB + (playersB[2][0] - ballX_startB) * p;
      ballZ = ballZ_startB + (playersB[2][2] - ballZ_startB) * p;
      ballY = ballY_startB * (1 - p) + 0.8 * p + 1.2 * Math.sin(p * Math.PI);
    } else if (tPlay < 6.5) {
      const p = (tPlay - 4.5) / 2.0;
      const ballX_midB = playersB[2][0];
      const ballZ_midB = playersB[2][2];
      const ballY_midB = 0.8;
      ballX = ballX_midB + (playersB[4][0] - ballX_midB) * p;
      ballZ = ballZ_midB + (playersB[4][2] - ballZ_midB) * p;
      ballY = ballY_midB * (1 - p) + 1.2 * p + 0.8 * Math.sin(p * Math.PI);
    } else {
      const p = (tPlay - 6.5) / 1.5;
      const jumpH = playersB[4][1];
      if (p < 0.6) {
        ballX = playersB[4][0];
        ballY = 1.0 + jumpH + 0.2;
        ballZ = playersB[4][2] + 0.2 * (p / 0.6);
      } else {
        const dp = (p - 0.6) / 0.4;
        
        const gravity = 9.8;
        const tBounce = dp * 0.6; // exact time since let go
        let currentH = 1.0 + jumpH + 0.2;
        let restitution = 0.6;
        
        let bY = currentH;
        let tRemaining = tBounce;
        
        while (tRemaining > 0) {
            let flightTime = Math.sqrt((2 * bY) / gravity);
            if (tRemaining > flightTime) {
                tRemaining -= flightTime;
                bY = bY * restitution; 
                if (bY < 0.05) { bY = 0; break; } 
            } else {
                let halfFlight = Math.sqrt((2 * bY) / gravity);
                let timeFromPeak = tRemaining > halfFlight ? (tRemaining - halfFlight) : (halfFlight - tRemaining);
                bY = bY - 0.5 * gravity * timeFromPeak * timeFromPeak;
                break;
            }
        }
        
        ballX = 0;
        ballZ = courtL / 2 - 0.5 - dp * 1.5; 
        ballY = 0.12 + Math.max(0, bY);
      }
    }

    // Team A shadow-defense
    for (let i = 0; i < 5; i++) {
       playersA[i] = [
         playersB[i][0] * 0.82 + Math.sin(tPlay * 1.5 + i) * 0.2,
         0,
         playersB[i][2] * 0.82 + 0.5
       ];
    }
  }

  return { playersA, playersB, ball: [ballX, ballY, ballZ] };
}

export function getDeterministicMatchState(
  sportType: string,
  time: number,
  courtL: number,
  courtW: number,
  playerId?: string,
  playerTeam?: 'A' | 'B' | 'neutral',
  playerRole?: string
) {
  let ballX = 0, ballY = 0.12, ballZ = 0;
  let playerX = 0, playerY = 0, playerZ = 0;
  let playerRotY = 0;
  let playerPose: 'standing' | 'running' | 'diving' | 'jumping' | 'batting' | 'swimming' | 'squatting' | 'curling' | 'ready' = 'ready';
  let hasBallAsset: 'basketball' | 'tennis' | 'football' | 'shuttlecock' | 'cricket' | null = null;
  let racketType: 'tennis' | 'badminton' | 'squash' | 'pickleball' | 'dumbbell' | null = null;

  if (sportType === 'TENNIS' || sportType === 'PICKLEBALL' || sportType === 'BADMINTON') {
    racketType = sportType === 'TENNIS' ? 'tennis' : sportType === 'BADMINTON' ? 'badminton' : 'pickleball';
    const shotDuration = sportType === 'PICKLEBALL' ? 1.4 : sportType === 'BADMINTON' ? 1.3 : 1.6;
    const progress = (time % shotDuration) / shotDuration;
    const shotIndex = Math.floor(time / shotDuration);
    const side = shotIndex % 2; // 0 = A hit, ball going to B. 1 = B hit, ball going to A.
    
    const maxZ = courtL * 0.38;
    const startZ = side === 0 ? -maxZ : maxZ;
    const endZ = side === 0 ? maxZ : -maxZ;
    
    const startX = Math.sin(shotIndex * 7.1) * (courtW * 0.23);
    const endX = Math.sin((shotIndex + 1) * 7.1) * (courtW * 0.23);
    
    ballX = startX + (endX - startX) * progress;
    ballZ = startZ + (endZ - startZ) * progress;
    
    const netH = sportType === 'BADMINTON' ? 1.27 : sportType === 'PICKLEBALL' ? 0.32 : 0.78;
    
    if (sportType === 'TENNIS' || sportType === 'PICKLEBALL') {
      if (progress < 0.7) {
        const tNorm = progress / 0.7;
        const peakY = netH + (sportType === 'PICKLEBALL' ? 0.6 : 0.9);
        ballY = 1.0 * (1 - tNorm) + 0.12 * tNorm + peakY * 4 * tNorm * (1 - tNorm);
      } else {
        const tNorm = (progress - 0.7) / 0.3;
        const peakY = 0.12 + (sportType === 'PICKLEBALL' ? 0.4 : 0.6);
        ballY = 0.12 * (1 - tNorm) + 0.8 * tNorm + peakY * 4 * tNorm * (1 - tNorm);
      }
    } else {
      const peakY = 2.8;
      ballY = 1.2 * (1 - progress) + 1.1 * progress + (peakY - 1.2) * 4 * progress * (1 - progress);
    }
    
    // Proximity safety to prevent ball going under any net
    if (Math.abs(ballZ) < 0.8) {
      ballY = Math.max(ballY, netH + 0.25);
    }

    if (playerId) {
      const isTeamA = playerTeam === 'A';
      
      if (isTeamA) {
        const basePos = [0, 0, -courtL * 0.4];
        if (side === 1) { // 1 = B hit, ball going to A (Team A must defend/hit!)
          const targetX = endX;
          const targetZ = -maxZ;
          playerX = basePos[0] + (targetX - basePos[0]) * Math.min(progress * 1.5, 1.0);
          playerZ = basePos[2] + (targetZ - basePos[2]) * Math.min(progress * 1.5, 1.0);
          playerPose = 'running';
          playerRotY = 0;
        } else { // 0 = A hit, ball going to B (Team A just hit, retreating!)
          const hitRelease = Math.max(0, 1.0 - progress * 4.0);
          playerX = startX * hitRelease;
          playerZ = startZ * hitRelease + (-courtL * 0.4) * (1 - hitRelease);
          playerRotY = 0;
          playerPose = progress < 0.25 ? 'jumping' : 'ready';
        }
      } else {
        const basePos = [0, 0, courtL * 0.4];
        if (side === 0) { // 0 = A hit, ball going to B (Team B must defend/hit!)
          const targetX = endX;
          const targetZ = maxZ;
          playerX = basePos[0] + (targetX - basePos[0]) * Math.min(progress * 1.5, 1.0);
          playerZ = basePos[2] + (targetZ - basePos[2]) * Math.min(progress * 1.5, 1.0);
          playerPose = 'running';
          playerRotY = Math.PI;
        } else { // 1 = B hit, ball going to A (Team B just hit, retreating!)
          const hitRelease = Math.max(0, 1.0 - progress * 4.0);
          playerX = startX * hitRelease;
          playerZ = startZ * hitRelease + (courtL * 0.4) * (1 - hitRelease);
          playerRotY = Math.PI;
          playerPose = progress < 0.25 ? 'jumping' : 'ready';
        }
      }
    }
  } else if (sportType === 'BASKETBALL') {
    const cycleDuration = 10.0;
    const cycle = time % cycleDuration;
    const currentAttackIdx = Math.floor(time / cycleDuration);
    const attackTeam = currentAttackIdx % 2 === 0 ? 'A' : 'B';
    const isAttackA = attackTeam === 'A';
    
    let playersA: [number, number, number][] = [];
    let playersB: [number, number, number][] = [];

    // Smooth transition from active play to next team's start to eliminate teleportation entirely
    if (cycle > 8.0) {
      // Transition phase: progress from 0.0 (at 8.0s) to 1.0 (at 10.0s)
      const tTrans = (cycle - 8.0) / 2.0; // 0 to 1
      
      // End point of current attack play (at 8.0s)
      const currentSnap = getRawBasketballPositions(8.0, isAttackA, courtL, courtW);
      // Start point of next attack play (at 0.0s of next cycle)
      const nextSnap = getRawBasketballPositions(0.0, !isAttackA, courtL, courtW);

      for (let i = 0; i < 5; i++) {
        playersA[i] = [
          currentSnap.playersA[i][0] + (nextSnap.playersA[i][0] - currentSnap.playersA[i][0]) * tTrans,
          currentSnap.playersA[i][1] + (nextSnap.playersA[i][1] - currentSnap.playersA[i][1]) * tTrans,
          currentSnap.playersA[i][2] + (nextSnap.playersA[i][2] - currentSnap.playersA[i][2]) * tTrans
        ];
        playersB[i] = [
          currentSnap.playersB[i][0] + (nextSnap.playersB[i][0] - currentSnap.playersB[i][0]) * tTrans,
          currentSnap.playersB[i][1] + (nextSnap.playersB[i][1] - currentSnap.playersB[i][1]) * tTrans,
          currentSnap.playersB[i][2] + (nextSnap.playersB[i][2] - currentSnap.playersB[i][2]) * tTrans
        ];
      }
      
      // Ball transition back down from basket rim to the next pg hand
      ballX = currentSnap.ball[0] + (nextSnap.ball[0] - currentSnap.ball[0]) * tTrans;
      ballY = currentSnap.ball[1] + (nextSnap.ball[1] - currentSnap.ball[1]) * tTrans;
      ballZ = currentSnap.ball[2] + (nextSnap.ball[2] - currentSnap.ball[2]) * tTrans;
    } else {
      // Normal live play region (0s to 8s)
      const snap = getRawBasketballPositions(cycle, isAttackA, courtL, courtW);
      playersA = snap.playersA;
      playersB = snap.playersB;
      ballX = snap.ball[0];
      ballY = snap.ball[1];
      ballZ = snap.ball[2];
    }
    
    if (playerId) {
      const isTeamA = playerTeam === 'A';
      const idxStr = playerRole?.split('_')[1];
      const pIdx = idxStr ? parseInt(idxStr, 10) : 0;
      
      const pos = isTeamA ? playersA[pIdx] : playersB[pIdx];
      playerX = pos[0]; playerY = pos[1]; playerZ = pos[2];
      
      if (attackTeam === 'A') {
        playerRotY = isTeamA ? (pIdx === 0 ? Math.PI : -Math.PI/2) : 0;
      } else {
        playerRotY = isTeamA ? 0 : (pIdx === 0 ? 0 : Math.PI/2);
      }
      
      const carryingActive = (attackTeam === 'A' && isTeamA && pIdx === 0 && cycle < 2.5) ||
                             (attackTeam === 'B' && !isTeamA && pIdx === 0 && cycle < 2.5);
      if (carryingActive) {
        hasBallAsset = 'basketball';
      }
      
      if (pIdx === 4 && playerY > 0.1) {
        playerPose = 'jumping';
      } else if (Math.abs(Math.sin(time*2)) > 0.3) {
        playerPose = 'running';
      } else {
        playerPose = 'ready';
      }
    }
  } else if (sportType === 'FOOTBALL') {
    const cycleDuration = 10.0;
    const cycle = time % cycleDuration;
    const attackTeam = Math.floor(time / cycleDuration) % 2 === 0 ? 'A' : 'B';
    const shotIndex = Math.floor(time / cycleDuration);
    
    let pA: [number, number, number][] = [
      [0, 0, courtL * 0.44],
      [0, 0, courtL * 0.25],
      [-courtW * 0.28, 0, courtL * 0.15],
      [courtW * 0.28, 0, courtL * 0.15],
      [0, 0, courtL * 0.05]
    ];
    
    let pB: [number, number, number][] = [
      [0, 0, -courtL * 0.44],
      [0, 0, -courtL * 0.25],
      [courtW * 0.28, 0, -courtL * 0.15],
      [-courtW * 0.28, 0, -courtL * 0.15],
      [0, 0, -courtL * 0.05]
    ];
    
    if (attackTeam === 'A') {
      if (cycle < 2.5) {
        const p = cycle / 2.5;
        pA[1] = [Math.sin(time)*0.3, 0, courtL * 0.23];
        pA[3] = [courtW * 0.28 + Math.sin(time*2)*0.2, 0, courtL * 0.15 - p * (courtL * 0.1)];
        ballX = pA[1][0] + (pA[3][0] - pA[1][0]) * p;
        ballZ = pA[1][2] + (pA[3][2] - pA[1][2]) * p;
        ballY = 0.12 + 0.3 * Math.sin(p * Math.PI);
      } else if (cycle < 5.0) {
        const p = (cycle - 2.5) / 2.5;
        pA[3] = [courtW * 0.28 + (courtW * 0.1)*p, 0, courtL * 0.05 - p * (courtL * 0.2)];
        pA[4] = [Math.sin(time*2)*0.5, 0, -courtL * 0.22 - p * (courtL * 0.15)];
        ballX = pA[3][0] + (pA[4][0] - pA[3][0]) * p;
        ballZ = pA[3][2] + (pA[4][2] - pA[3][2]) * p;
        ballY = 0.12 + 1.1 * Math.sin(p * Math.PI);
      } else if (cycle < 7.0) {
        const p = (cycle - 5.0) / 2.0;
        const targetGoal = [Math.sin(shotIndex)*0.8, 0.6, -courtL * 0.49];
        pA[4] = [0, 0, -courtL * 0.35];
        ballX = pA[4][0] + (targetGoal[0] - pA[4][0]) * p;
        ballZ = pA[4][2] + (targetGoal[2] - pA[4][2]) * p;
        ballY = 0.12 + 0.8 * p + 0.3 * Math.sin(p * Math.PI);
        pB[0][0] = targetGoal[0] * Math.min(p * 1.5, 1.0);
        pB[0][1] = 0.4 * Math.sin(p * Math.PI);
      } else {
        const p = (cycle - 7.0) / 3.0;
        pB[0] = [0, 0, -courtL * 0.44];
        ballX = Math.sin(time * 0.8) * 0.4;
        ballZ = -courtL * 0.28;
        ballY = 0.12 + 0.25 * Math.abs(Math.cos(p * Math.PI * 4));
      }
      
      for (let i = 1; i < 5; i++) {
        pB[i] = [
          pA[i][0] * 0.8 + Math.cos(time + i) * 0.2,
          0,
          pA[i][2] * 0.8 - 0.5
        ];
      }
    } else {
      const normCycle = cycle;
      if (normCycle < 2.5) {
        const p = normCycle / 2.5;
        pB[1] = [Math.sin(time)*0.3, 0, -courtL * 0.23];
        pB[3] = [-courtW * 0.28 - Math.sin(time*2)*0.2, 0, -courtL * 0.15 + p * (courtL * 0.1)];
        ballX = pB[1][0] + (pB[3][0] - pB[1][0]) * p;
        ballZ = pB[1][2] + (pB[3][2] - pB[1][2]) * p;
        ballY = 0.12 + 0.3 * Math.sin(p * Math.PI);
      } else if (normCycle < 5.0) {
        const p = (normCycle - 2.5) / 2.5;
        pB[3] = [-courtW * 0.28 - (courtW * 0.1)*p, 0, -courtL * 0.05 + p * (courtL * 0.2)];
        pB[4] = [Math.sin(time*2)*0.5, 0, courtL * 0.22 + p * (courtL * 0.15)];
        ballX = pB[3][0] + (pB[4][0] - pB[3][0]) * p;
        ballZ = pB[3][2] + (pB[4][2] - pB[3][2]) * p;
        ballY = 0.12 + 1.1 * Math.sin(p * Math.PI);
      } else if (normCycle < 7.0) {
        const p = (normCycle - 5.0) / 2.0;
        const targetGoal = [Math.sin(shotIndex)*0.8, 0.6, courtL * 0.49];
        pB[4] = [0, 0, courtL * 0.35];
        ballX = pB[4][0] + (targetGoal[0] - pB[4][0]) * p;
        ballZ = pB[4][2] + (targetGoal[2] - pB[4][2]) * p;
        ballY = 0.12 + 0.8 * p + 0.3 * Math.sin(p * Math.PI);
        pA[0][0] = targetGoal[0] * Math.min(p * 1.5, 1.0);
        pA[0][1] = 0.4 * Math.sin(p * Math.PI);
      } else {
        const p = (normCycle - 7.0) / 3.0;
        pA[0] = [0, 0, courtL * 0.44];
        ballX = Math.sin(time * 0.8) * 0.4;
        ballZ = courtL * 0.28;
        ballY = 0.12 + 0.25 * Math.abs(Math.cos(p * Math.PI * 4));
      }
      
      for (let i = 1; i < 5; i++) {
        pA[i] = [
          pB[i][0] * 0.8 + Math.cos(time + i) * 0.2,
          0,
          pB[i][2] * 0.8 + 0.5
        ];
      }
    }
    
    if (playerId) {
      const isTeamA = playerTeam === 'A';
      const idxStr = playerRole?.split('_')[1];
      const pIdx = idxStr ? parseInt(idxStr, 10) : 0;
      
      const pos = isTeamA ? pA[pIdx] : pB[pIdx];
      playerX = pos[0]; playerY = pos[1]; playerZ = pos[2];
      
      playerRotY = isTeamA ? 0 : Math.PI;
      if (pIdx === 0 && playerY > 0.05) {
        playerPose = 'diving';
      } else {
        playerPose = 'running';
      }
    }
  } else if (sportType === 'VOLLEYBALL') {
    const cycleDuration = 6.0;
    const cycle = time % cycleDuration;
    const servingTeam = Math.floor(time / cycleDuration) % 2 === 0 ? 'A' : 'B';
    
    let pA: [number, number, number][] = [
      [courtW * 0.25, 0, courtL * 0.15],
      [0, 0, courtL * 0.14],
      [-courtW * 0.25, 0, courtL * 0.15],
      [-courtW * 0.22, 0, courtL * 0.35],
      [0, 0, courtL * 0.4],
      [courtW * 0.22, 0, courtL * 0.35]
    ];
    
    let pB: [number, number, number][] = [
      [-courtW * 0.25, 0, -courtL * 0.15],
      [0, 0, -courtL * 0.14],
      [courtW * 0.25, 0, -courtL * 0.15],
      [courtW * 0.22, 0, -courtL * 0.35],
      [0, 0, -courtL * 0.4],
      [-courtW * 0.22, 0, -courtL * 0.35]
    ];
    
    const netH = 2.22;

    if (servingTeam === 'A') {
      if (cycle < 1.5) {
        const p = cycle / 1.5;
        pA[5] = [courtW * 0.25, 0, courtL * 0.44];
        const start = [courtW * 0.25, 1.3, courtL * 0.44];
        const end = [-courtW * 0.2, 0.2, -courtL * 0.3];
        ballX = start[0] + (end[0] - start[0]) * p;
        ballZ = start[2] + (end[2] - start[2]) * p;
        ballY = start[1] * (1 - p) + end[1] * p + 2.22 * Math.sin(p * Math.PI);
      } else if (cycle < 3.0) {
        const p = (cycle - 1.5) / 1.5;
        pB[5] = [-courtW * 0.2, 0, -courtL * 0.34];
        pB[0] = [-0.2, 0, -courtL * 0.12];
        const start = [-courtW * 0.2, 0.22, -courtL * 0.3];
        const end = [-0.2, 2.7, -courtL * 0.12];
        ballX = start[0] + (end[0] - start[0]) * p;
        ballZ = start[2] + (end[2] - start[2]) * p;
        ballY = start[1] * (1 - p) + end[1] * p + 1.2 * Math.sin(p * Math.PI);
      } else if (cycle < 4.2) {
        const p = (cycle - 3.0) / 1.2;
        pB[2][1] = 0.9 * Math.sin(p * Math.PI);
        const start = [-0.2, 2.7, -courtL * 0.12];
        const end = [courtW * 0.25, 0.6, courtL * 0.28];
        ballX = start[0] + (end[0] - start[0]) * p;
        ballZ = start[2] + (end[2] - start[2]) * p;
        ballY = start[1] * (1 - p) + end[1] * p + 1.8 * Math.abs(Math.cos(p * Math.PI * 0.5));
      } else {
        const p = (cycle - 4.2) / 1.8;
        pA[4] = [courtW * 0.11 * p, 0, courtL * 0.33];
        pA[4][1] = 0.3 * Math.sin(p * Math.PI);
        const start = [courtW * 0.25, 0.6, courtL * 0.28];
        const end = [0, 2.5, courtL * 0.12];
        ballX = start[0] + (end[0] - start[0]) * p;
        ballZ = start[2] + (end[2] - start[2]) * p;
        ballY = start[1] * (1 - p) + end[1] * p + 1.5 * Math.sin(p * Math.PI);
      }
    } else {
      const normCycle = cycle;
      if (normCycle < 1.5) {
        const p = normCycle / 1.5;
        pB[5] = [-courtW * 0.25, 0, -courtL * 0.44];
        const start = [-courtW * 0.25, 1.3, -courtL * 0.44];
        const end = [courtW * 0.2, 0.2, courtL * 0.3];
        ballX = start[0] + (end[0] - start[0]) * p;
        ballZ = start[2] + (end[2] - start[2]) * p;
        ballY = start[1] * (1 - p) + end[1] * p + 2.22 * Math.sin(p * Math.PI);
      } else if (normCycle < 3.0) {
        const p = (normCycle - 1.5) / 1.5;
        pA[5] = [courtW * 0.2, 0, courtL * 0.3];
        pA[0] = [0.2, 0, courtL * 0.12];
        const start = [courtW * 0.2, 0.22, courtL * 0.3];
        const end = [0.2, 2.7, courtL * 0.12];
        ballX = start[0] + (end[0] - start[0]) * p;
        ballZ = start[2] + (end[2] - start[2]) * p;
        ballY = start[1] * (1 - p) + end[1] * p + 1.2 * Math.sin(p * Math.PI);
      } else if (normCycle < 4.2) {
        const p = (normCycle - 3.0) / 1.2;
        pA[2][1] = 0.9 * Math.sin(p * Math.PI);
        const start = [0.2, 2.7, courtL * 0.12];
        const end = [-courtW * 0.25, 0.6, -courtL * 0.28];
        ballX = start[0] + (end[0] - start[0]) * p;
        ballZ = start[2] + (end[2] - start[2]) * p;
        ballY = start[1] * (1 - p) + end[1] * p + 1.8 * Math.abs(Math.cos(p * Math.PI * 0.5));
      } else {
        const p = (normCycle - 4.2) / 1.8;
        pB[4] = [-courtW * 0.11 * p, 0, -courtL * 0.33];
        pB[4][1] = 0.3 * Math.sin(p * Math.PI);
        const start = [-courtW * 0.25, 0.6, -courtL * 0.28];
        const end = [0, 2.5, -courtL * 0.12];
        ballX = start[0] + (end[0] - start[0]) * p;
        ballZ = start[2] + (end[2] - start[2]) * p;
        ballY = start[1] * (1 - p) + end[1] * p + 1.5 * Math.sin(p * Math.PI);
      }
    }
    
    // Proximity safety to prevent ball going under any net
    if (Math.abs(ballZ) < 0.8) {
      ballY = Math.max(ballY, netH + 0.25);
    }

    if (playerId) {
      const isTeamA = playerTeam === 'A';
      const idxStr = playerRole?.split('_')[1];
      const pIdx = idxStr ? parseInt(idxStr, 10) : 0;
      
      const pos = isTeamA ? pA[pIdx] : pB[pIdx];
      playerX = pos[0]; playerY = pos[1]; playerZ = pos[2];
      
      playerRotY = isTeamA ? 0 : Math.PI;
      if (playerY > 0.3) {
        playerPose = 'jumping';
      } else if (playerY > 0.05) {
        playerPose = 'diving';
      } else {
        playerPose = 'ready';
      }
    }
  } else if (sportType === 'SQUASH') {
    racketType = 'squash';
    const shotDuration = 1.35;
    const progress = (time % shotDuration) / shotDuration;
    const shotIndex = Math.floor(time / shotDuration);
    const side = shotIndex % 2;
    
    const frontWallZ = -courtL * 0.48;
    const baseTZone = [0, 0, courtL * 0.15];
    
    const startX = Math.sin(shotIndex * 6.3) * (courtW * 0.24);
    const endX = Math.sin((shotIndex + 1) * 6.2) * (courtW * 0.24);
    ballX = startX + (endX - startX) * progress;
    
    if (side === 0) {
      if (progress < 0.45) {
        const tNorm = progress / 0.45;
        ballZ = (courtL * 0.2) + (frontWallZ - (courtL * 0.2)) * tNorm;
        ballY = 1.0 * (1 - tNorm) + 1.6 * tNorm + 0.4 * Math.sin(tNorm * Math.PI);
      } else {
        const tNorm = (progress - 0.45) / 0.55;
        ballZ = frontWallZ + ((courtL * 0.2) - frontWallZ) * tNorm;
        if (tNorm < 0.7) {
          const tBounce = tNorm / 0.7;
          ballY = 1.6 * (1 - tBounce) + 0.06 * tBounce + 0.15 * Math.sin(tBounce * Math.PI);
        } else {
          const tBounce = (tNorm - 0.7) / 0.3;
          ballY = 0.06 * (1 - tBounce) + 0.8 * tBounce + 0.3 * Math.sin(tBounce * Math.PI);
        }
      }
    } else {
      if (progress < 0.45) {
        const tNorm = progress / 0.45;
        ballZ = (courtL * 0.2) + (frontWallZ - (courtL * 0.2)) * tNorm;
        ballY = 1.0 * (1 - tNorm) + 1.6 * tNorm + 0.4 * Math.sin(tNorm * Math.PI);
      } else {
        const tNorm = (progress - 0.45) / 0.55;
        ballZ = frontWallZ + ((courtL * 0.2) - frontWallZ) * tNorm;
        if (tNorm < 0.7) {
          const tBounce = tNorm / 0.7;
          ballY = 1.6 * (1 - tBounce) + 0.06 * tBounce + 0.15 * Math.sin(tBounce * Math.PI);
        } else {
          const tBounce = (tNorm - 0.7) / 0.3;
          ballY = 0.06 * (1 - tBounce) + 0.8 * tBounce + 0.3 * Math.sin(tBounce * Math.PI);
        }
      }
    }
    
    if (playerId) {
      const isTeamA = playerTeam === 'A';
      if (isTeamA) {
        if (side === 1) {
          playerX = ballX;
          playerZ = ballZ;
          playerPose = 'running';
          playerRotY = -Math.PI / 4;
        } else {
          playerX = baseTZone[0] * progress + (startX * (1 - progress));
          playerZ = baseTZone[2] * progress + ((courtL * 0.2) * (1 - progress));
          playerPose = progress < 0.3 ? 'ready' : 'standing';
          playerRotY = Math.PI;
        }
      } else {
        if (side === 0) {
          playerX = ballX;
          playerZ = ballZ;
          playerPose = 'running';
          playerRotY = Math.PI / 4;
        } else {
          playerX = baseTZone[0] * progress + (startX * (1 - progress));
          playerZ = baseTZone[2] * progress + ((courtL * 0.2) * (1 - progress));
          playerPose = progress < 0.3 ? 'ready' : 'standing';
          playerRotY = 0;
        }
      }
    }
  } else if (sportType === 'CRICKET') {
    const cycle = (time * 1.25) % 4.0;
    const bowlerZ = -courtL * 0.26;
    const batterZ = courtL * 0.26 - 1.2;
    const fielderPos = [courtW * 0.35, 0, -courtL * 0.25];
    
    if (cycle < 1.4) {
      const p = cycle / 1.4;
      ballX = 0;
      ballZ = bowlerZ + p * (batterZ - bowlerZ);
      ballY = 0.15 + 1.35 * Math.sin(p * Math.PI) * (1.2 - p);
    } else if (cycle < 3.2) {
      const p = (cycle - 1.4) / 1.8;
      ballX = p * fielderPos[0];
      ballZ = batterZ + p * (fielderPos[2] - batterZ);
      ballY = 0.2 + 2.8 * Math.sin(p * Math.PI);
    } else {
      const p = (cycle - 3.2) / 0.8;
      ballX = fielderPos[0] * (1 - p);
      ballZ = fielderPos[2] * (1 - p) + bowlerZ * p;
      ballY = 0.15 + 1.5 * Math.sin(p * Math.PI);
    }
    
    if (playerId) {
      const isTeamA = playerTeam === 'A';
      if (isTeamA) {
        if (playerRole === 'bowler') {
          if (cycle < 1.4) {
            const p = cycle / 1.4;
            playerX = 0;
            playerZ = bowlerZ - 1.8 * (1 - p);
            playerPose = 'running';
          } else {
            playerX = 0.5;
            playerZ = bowlerZ - 0.5;
            playerPose = 'ready';
          }
          playerRotY = 0;
        } else if (playerRole === 'keeper') {
          playerX = 0;
          playerZ = batterZ + 1.2;
          playerPose = 'ready';
          playerRotY = Math.PI;
        } else {
          if (playerRole === 'fielder_1') {
            if (cycle >= 1.4 && cycle < 3.2) {
              const p = (cycle - 1.4) / 1.8;
              playerX = fielderPos[0] * Math.min(p * 1.3, 1.0);
              playerZ = fielderPos[2] * Math.min(p * 1.3, 1.0);
              playerPose = 'running';
            } else if (cycle >= 3.2) {
              playerX = fielderPos[0];
              playerZ = fielderPos[2];
              playerPose = 'ready';
            } else {
              playerX = fielderPos[0] * 0.8;
              playerZ = fielderPos[2] * 0.8;
              playerPose = 'standing';
            }
          } else if (playerRole === 'fielder_2') {
            playerX = -courtW * 0.35; playerZ = 0; playerPose = 'standing';
          } else {
            playerX = -0.4; playerZ = -courtL*0.1; playerPose = 'standing';
          }
          playerRotY = Math.PI / 4;
        }
      } else {
        if (playerRole === 'batter') {
          playerX = 0;
          playerZ = batterZ;
          playerRotY = Math.PI / 2;
          if (cycle >= 1.3 && cycle < 1.6) {
            playerPose = 'batting';
          } else {
            playerPose = 'ready';
          }
        } else {
          playerX = -0.6;
          if (cycle >= 1.6 && cycle < 3.2) {
            const p = (cycle - 1.6) / 1.6;
            playerZ = bowlerZ + p * (batterZ - bowlerZ);
            playerPose = 'running';
          } else {
            playerZ = bowlerZ;
            playerPose = 'ready';
          }
          playerRotY = 0;
        }
      }
    }
  } else if (sportType === 'SWIMMING_POOL') {
    const swimSpeed = 1.7;
    const lapTime = 6.0;
    const startZ = -courtL * 0.44;
    const endZ = courtL * 0.44;
    
    if (playerId) {
      const idxStr = playerRole?.split('_')[1];
      const laneIdx = idxStr ? parseInt(idxStr, 10) : 0;
      playerX = (laneIdx - 1) * (courtW / 4);
      playerY = -0.15 + 0.03 * Math.sin(time * 5 + laneIdx);
      const multiplier = 1.0 + laneIdx * 0.05;
      const tCycleIndividual = (time * swimSpeed * multiplier) % (lapTime * 2.0);
      const normalizedTime = tCycleIndividual / lapTime; // goes from 0 to 2
      const smoothProgress = (1 - Math.cos(Math.PI * normalizedTime)) / 2; // smooth 0 -> 1 -> 0
      playerZ = startZ + (endZ - startZ) * smoothProgress;
      const isForward = normalizedTime < 1.0;
      playerRotY = isForward ? 0 : Math.PI;
      playerPose = 'swimming';
    }
  } else if (sportType === 'GYM') {
    if (playerId) {
      if (playerRole === 'squatter') {
        playerX = courtW * 0.2;
        playerY = 0.03 + 0.3 * Math.max(0, Math.sin(time * 1.5));
        playerZ = courtL * 0.25;
        playerPose = 'squatting';
        playerRotY = Math.PI;
      } else if (playerRole === 'runner') {
        const dCycle = (time * 1.8) % 8.0;
        const forward = dCycle < 4.0;
        const p = forward ? (dCycle / 4.0) : ((dCycle - 4.0) / 4.0);
        playerX = -courtW/2 + courtW * 0.15;
        playerZ = forward ? (-courtL * 0.35 + p * courtL * 0.7) : (courtL * 0.35 - p * courtL * 0.7);
        playerRotY = forward ? 0 : Math.PI;
        playerPose = 'running';
      } else {
        playerX = -courtW * 0.22;
        playerZ = -courtL * 0.2;
        playerPose = 'curling';
        racketType = 'dumbbell';
      }
    }
  } else if (sportType === 'TRACK_FIELD') {
    const lapTime = 5.0;
    const progress = (time / lapTime) % 1.0;
    if (playerId) {
      const idxStr = playerRole?.split('_')[1];
      const laneIdx = idxStr ? parseInt(idxStr, 10) : 0;
      playerX = (courtW/2 - 1.5) - laneIdx * 0.6;
      playerZ = courtL * 0.35 - progress * (courtL * 0.7);
      playerPose = 'running';
      playerRotY = Math.PI;
    }
  }

  playerY = Math.max(0, playerY);

  return {
    ballPosition: [ballX, ballY, ballZ] as [number, number, number],
    playerPosition: [playerX, playerY, playerZ] as [number, number, number],
    playerRotY,
    playerPose,
    hasBallAsset,
    racketType
  };
}

const AbstractPlayer = ({ 
  id,
  team = 'neutral',
  role = 'player',
  color,
  sportType = 'BASKETBALL',
  courtL = 10,
  courtW = 10,
  animate = true,
  visible = true,
  position,
  rotation,
  movementDistance,
  movementSpeed,
  moveAxis,
  hasBallType,
  bounceSpeed
}: { 
  id?: string;
  team?: 'A' | 'B' | 'neutral';
  role?: string;
  color: string;
  sportType?: string;
  courtL?: number;
  courtW?: number;
  animate?: boolean;
  visible?: boolean;
  position?: [number, number, number];
  rotation?: [number, number, number];
  movementDistance?: number;
  movementSpeed?: number;
  moveAxis?: string;
  hasBallType?: string | null;
  bounceSpeed?: number;
}) => {
  if (!visible) return null;

  const groupRef = useRef<any>(null);
  const bodyRef = useRef<any>(null);
  const leftArmRef = useRef<any>(null);
  const rightArmRef = useRef<any>(null);
  const leftLegRef = useRef<any>(null);
  const rightLegRef = useRef<any>(null);

  // Dynamic Skin Tone selection based on player id to represent field diversity
  const getSkinColor = (playerId: string) => {
    const tones = ['#fbc19c', '#e6ae85', '#cc976f', '#a87652', '#734c31'];
    let hash = 0;
    for (let i = 0; i < playerId.length; i++) {
      hash = playerId.charCodeAt(i) + ((hash << 5) - hash);
    }
    return tones[Math.abs(hash) % tones.length];
  };
  const skinColor = id ? getSkinColor(id) : '#e6ae85';

  // State Machine based AI Controller
  const aiState = useRef<'idle' | 'movement' | 'active'>('idle');
  const currentPos = useRef<[number, number, number] | null>(null);
  const currentRotY = useRef<number | null>(null);
  const velocity = useRef<[number, number, number]>([0, 0, 0]);
  const accumTime = useRef<number>(Math.random() * 100); // Random offset for organic desynchronized human breathing

  useFrame((state, delta) => {
    if (!animate) return;
    const time = state.clock.getElapsedTime();
    accumTime.current += delta;

    let targetX = position ? position[0] : 0;
    let targetY = position ? position[1] : 0;
    let targetZ = position ? position[2] : 0;
    let targetRotY = rotation ? rotation[1] : 0;
    let targetPose: 'standing' | 'running' | 'diving' | 'jumping' | 'batting' | 'swimming' | 'squatting' | 'curling' | 'ready' = 'ready';
    let activeBallAsset: string | null = null;

    if (id) {
      // Dynamic Match State
      const matchState = getDeterministicMatchState(
        sportType,
        time,
        courtL,
        courtW,
        id,
        team,
        role
      );
      targetX = matchState.playerPosition[0];
      targetY = matchState.playerPosition[1];
      targetZ = matchState.playerPosition[2];
      targetRotY = matchState.playerRotY;
      targetPose = matchState.playerPose;
      activeBallAsset = matchState.hasBallAsset;
    } else {
      // Static or manual back-and-forth movement
      if (movementDistance && movementSpeed && moveAxis) {
        const cycle = time * movementSpeed;
        const offset = Math.sin(cycle) * movementDistance;
        const axisLower = moveAxis.toLowerCase();
        if (axisLower === 'x') {
          targetX += offset;
        } else if (axisLower === 'y') {
          targetY += offset;
        } else if (axisLower === 'z') {
          targetZ += offset;
          const cycleCos = Math.cos(cycle);
          targetRotY = cycleCos >= 0 ? 0 : Math.PI;
        }
        targetPose = 'running';
      } else {
        targetPose = 'standing';
      }
    }

    // Ensure current position is initialized
    if (!currentPos.current) {
      currentPos.current = [targetX, targetY, targetZ];
    }

    // AI State Machine Transition and Physics Calculations
    const distanceToTarget = Math.sqrt(
      Math.pow(targetX - currentPos.current[0], 2) +
      Math.pow(targetY - currentPos.current[1], 2) +
      Math.pow(targetZ - currentPos.current[2], 2)
    );

    // State Transitions
    if (distanceToTarget > 35.0) {
      // If the teleport distance is huge, snap to avoid long slidings across unrelated spaces (e.g. court preset change)
      currentPos.current = [targetX, targetY, targetZ];
      velocity.current = [0, 0, 0];
      aiState.current = 'idle';
    } else if (distanceToTarget > 0.08) {
      // Transition to MOVEMENT or ACTIVE if performing high intensity player pose
      if (
        targetPose === 'diving' || 
        targetPose === 'jumping' || 
        targetPose === 'batting' || 
        targetPose === 'swimming' || 
        targetPose === 'curling' ||
        targetPose === 'squatting'
      ) {
        aiState.current = 'active';
      } else {
        aiState.current = 'movement';
      }
    } else {
      // Stationary state
      if (
        targetPose === 'diving' || 
        targetPose === 'jumping' || 
        targetPose === 'batting' || 
        targetPose === 'swimming' || 
        targetPose === 'curling' ||
        targetPose === 'squatting' ||
        targetPose === 'ready'
      ) {
        aiState.current = 'active';
      } else {
        aiState.current = 'idle';
      }
    }

    // Steering Force and Target Attraction Limits
    let maxSpeed = 5.0;
    let maxForce = 25.0;

    if (aiState.current === 'active') {
      maxSpeed = 9.5;    // Higher sprint speed
      maxForce = 55.0;   // High acceleration and responsiveness
    } else if (aiState.current === 'movement') {
      maxSpeed = 6.5;    // Standard running speed
      maxForce = 35.0;   // Controlled interpolation
    } else {
      maxSpeed = 2.0;    // Gentle adjustment speed
      maxForce = 12.0;
    }

    // Update position and velocity using Steering Controller integration
    if (distanceToTarget > 0.04) {
      let dx = targetX - currentPos.current[0];
      let dy = targetY - currentPos.current[1];
      let dz = targetZ - currentPos.current[2];

      // Normalize steering direction
      dx /= distanceToTarget;
      dy /= distanceToTarget;
      dz /= distanceToTarget;

      // Arrive behavior deceleration zone within 0.8 meters
      const finalSpeed = distanceToTarget < 0.8 ? maxSpeed * (distanceToTarget / 0.8) : maxSpeed;
      const desiredVX = dx * finalSpeed;
      const desiredVY = dy * finalSpeed;
      const desiredVZ = dz * finalSpeed;

      // Force = desired_velocity - current_velocity
      let steerX = desiredVX - velocity.current[0];
      let steerY = desiredVY - velocity.current[1];
      let steerZ = desiredVZ - velocity.current[2];

      // Limit steering force magnitude
      const steerMag = Math.sqrt(steerX * steerX + steerY * steerY + steerZ * steerZ);
      if (steerMag > maxForce) {
        steerX = (steerX / steerMag) * maxForce;
        steerY = (steerY / steerMag) * maxForce;
        steerZ = (steerZ / steerMag) * maxForce;
      }

      // Physics integration: v += f * dt
      velocity.current[0] += steerX * delta;
      velocity.current[1] += steerY * delta;
      velocity.current[2] += steerZ * delta;

      // Limit velocity
      const vMag = Math.sqrt(
        velocity.current[0] * velocity.current[0] +
        velocity.current[1] * velocity.current[1] +
        velocity.current[2] * velocity.current[2]
      );
      if (vMag > maxSpeed) {
        velocity.current[0] = (velocity.current[0] / vMag) * maxSpeed;
        velocity.current[1] = (velocity.current[1] / vMag) * maxSpeed;
        velocity.current[2] = (velocity.current[2] / vMag) * maxSpeed;
      }

      // Pos integration: x += v * dt
      currentPos.current[0] += velocity.current[0] * delta;
      currentPos.current[1] += velocity.current[1] * delta;
      currentPos.current[2] += velocity.current[2] * delta;
    } else {
      // Smoothly wind down velocity when stationary
      velocity.current[0] += (0 - velocity.current[0]) * 12.0 * delta;
      velocity.current[1] += (0 - velocity.current[1]) * 12.0 * delta;
      velocity.current[2] += (0 - velocity.current[2]) * 12.0 * delta;

      // Complete locking snap to eliminate coordinate drift
      currentPos.current[0] = targetX;
      currentPos.current[1] = targetY;
      currentPos.current[2] = targetZ;
    }

    // Rotation angle wrapping and smooth facing orientation logic
    let playerHeadingRotY = targetRotY;
    const currentSpeedXZ = Math.sqrt(velocity.current[0] * velocity.current[0] + velocity.current[2] * velocity.current[2]);
    
    // Face direction of actual movement when traveling
    if (currentSpeedXZ > 0.1) {
      if (aiState.current === 'movement' || targetPose === 'swimming') {
        playerHeadingRotY = Math.atan2(velocity.current[0], velocity.current[2]);
      }
    } else {
      if (targetPose === 'swimming') {
        playerHeadingRotY = (currentRotY.current !== null) ? currentRotY.current : targetRotY;
      }
    }

    if (currentRotY.current === null) {
      currentRotY.current = playerHeadingRotY;
    } else {
      let diff = playerHeadingRotY - currentRotY.current;
      diff = Math.atan2(Math.sin(diff), Math.cos(diff));
      const turnRate = targetPose === 'swimming' ? 6.0 : 8.0;
      currentRotY.current += diff * (1 - Math.exp(-turnRate * delta));
    }

    if (groupRef.current) {
      groupRef.current.position.set(currentPos.current[0], currentPos.current[1], currentPos.current[2]);
      groupRef.current.rotation.y = currentRotY.current;

      if (targetPose === 'swimming') {
        // Lay flat in pools
        groupRef.current.rotation.x = Math.PI / 2.2;
      } else {
        groupRef.current.rotation.x = 0;
      }
    }

    const isVisibleInFrustum = groupRef.current ? state.camera.position.distanceTo(groupRef.current.position) < 30.0 : true;
    if (!isVisibleInFrustum) return;

    const breatheCycle = accumTime.current * 2.0;

    // Animate Arms & Shoulders
    if (leftArmRef.current && rightArmRef.current) {
      if (targetPose === 'swimming') {
        const currentSpeedPercent = Math.min(currentSpeedXZ / 6.0, 1.0);
        const swimSwingSpeed = 2.0 + currentSpeedPercent * 8.0;
        const swimAmp = 0.2 + currentSpeedPercent * 1.3;
        leftArmRef.current.rotation.x = Math.sin(time * swimSwingSpeed) * swimAmp;
        rightArmRef.current.rotation.x = -Math.sin(time * swimSwingSpeed) * swimAmp;
      } else if (targetPose === 'running' || aiState.current === 'movement') {
        // Integrate swing speed with current movement velocity magnitude to make animation physically match speed!
        const currentSpeedPercent = Math.min(currentSpeedXZ / 6.0, 1.0);
        const swingSpeed = 6.0 + currentSpeedPercent * 6.0;
        const swingAmp = 0.2 + currentSpeedPercent * 0.7;
        leftArmRef.current.rotation.x = Math.sin(time * swingSpeed) * swingAmp;
        rightArmRef.current.rotation.x = -Math.sin(time * swingSpeed) * swingAmp;
      } else if (targetPose === 'batting') {
        leftArmRef.current.rotation.y = Math.sin(time * 12) * 1.2;
        rightArmRef.current.rotation.y = Math.sin(time * 12) * 1.2;
      } else if (targetPose === 'jumping') {
        leftArmRef.current.rotation.x = -Math.PI + 0.2;
        rightArmRef.current.rotation.x = -Math.PI + 0.2;
      } else if (targetPose === 'curling') {
        const lift = Math.abs(Math.sin(time * 3.0)) * 1.2;
        leftArmRef.current.rotation.x = 0.5 - lift;
        rightArmRef.current.rotation.x = 0.5 - lift;
      } else if (aiState.current === 'idle') {
        // Subtle organic idle breathing arm swing
        leftArmRef.current.rotation.x = 0.4 + Math.sin(breatheCycle) * 0.04;
        rightArmRef.current.rotation.x = 0.4 - Math.sin(breatheCycle) * 0.04;
      } else {
        leftArmRef.current.rotation.x = 0.4;
        rightArmRef.current.rotation.x = 0.4;
      }
    }

    // Animate Legs based on pose! Swing them beautifully relative to hips to eliminate "dummy" looks!
    if (leftLegRef.current && rightLegRef.current) {
      if (targetPose === 'running' || targetPose === 'swimming' || aiState.current === 'movement') {
        const currentSpeedPercent = Math.min(currentSpeedXZ / 6.0, 1.0);
        const legSpeed = targetPose === 'swimming' ? (4.0 + currentSpeedPercent * 8.0) : (5.0 + currentSpeedPercent * 6.0);
        const legAmp = targetPose === 'swimming' ? (0.1 + currentSpeedPercent * 0.4) : (0.15 + currentSpeedPercent * 0.45);
        const swing = Math.sin(time * legSpeed) * legAmp;
        leftLegRef.current.rotation.x = swing;
        rightLegRef.current.rotation.x = -swing;
      } else if (targetPose === 'squatting') {
        leftLegRef.current.rotation.x = -Math.PI / 4;
        rightLegRef.current.rotation.x = -Math.PI / 4;
      } else if (targetPose === 'jumping') {
        leftLegRef.current.rotation.x = -0.3;
        rightLegRef.current.rotation.x = -0.3;
      } else if (aiState.current === 'idle') {
        leftLegRef.current.rotation.x = Math.sin(breatheCycle * 0.5) * 0.02;
        rightLegRef.current.rotation.x = -Math.sin(breatheCycle * 0.5) * 0.02;
      } else {
        leftLegRef.current.rotation.x = 0;
        rightLegRef.current.rotation.x = 0;
      }
    }
  });

  const hasRacket = ['TENNIS', 'BADMINTON', 'SQUASH', 'PICKLEBALL'].includes(sportType);
  const isGymDumbbell = sportType === 'GYM' && role === 'curler';
  const isGymSquatBar = sportType === 'GYM' && role === 'squatter';

  // Hair mapping logic based on id
  const getHairStyle = (playerId?: string) => {
    let hash = 0;
    if (playerId) {
      for (let i = 0; i < playerId.length; i++) {
        hash = playerId.charCodeAt(i) + ((hash << 5) - hash);
      }
    }
    return Math.abs(hash) % 3;
  };
  const hairStyle = getHairStyle(id);

  return (
    <group ref={groupRef}>
      <Detailed distances={[0, 40]}>
        <group ref={bodyRef}>
          {/* --- LEGS & FEET (Humanoid physical structure swinging from hips) --- */}
          {/* Left Leg Hip Assembly */}
          <group ref={leftLegRef} position={[-0.09, 0.45, 0]}>
            <Cylinder args={[0.07, 0.06, 0.18]} position={[0, -0.09, 0]} castShadow>
              <meshStandardMaterial color={team === 'A' ? '#1e293b' : '#f8fafc'} roughness={0.6} />
            </Cylinder>
            <Cylinder args={[0.05, 0.045, 0.2]} position={[0, -0.27, 0]} castShadow>
              <meshStandardMaterial color={skinColor} roughness={0.6} />
            </Cylinder>
            <Cylinder args={[0.052, 0.048, 0.08]} position={[0, -0.36, 0]} castShadow>
              <meshStandardMaterial color="#ffffff" roughness={0.8} />
            </Cylinder>
            <group position={[0, -0.42, 0.02]}>
              <Box args={[0.08, 0.06, 0.18]} castShadow>
                <meshStandardMaterial color={color} roughness={0.4} />
              </Box>
              <Box args={[0.085, 0.015, 0.185]} position={[0, -0.025, 0]}>
                <meshStandardMaterial color="#ffffff" roughness={0.9} />
              </Box>
            </group>
          </group>

          {/* Right Leg Hip Assembly */}
          <group ref={rightLegRef} position={[0.09, 0.45, 0]}>
            <Cylinder args={[0.07, 0.06, 0.18]} position={[0, -0.09, 0]} castShadow>
              <meshStandardMaterial color={team === 'A' ? '#1e293b' : '#f8fafc'} roughness={0.6} />
            </Cylinder>
            <Cylinder args={[0.05, 0.045, 0.2]} position={[0, -0.27, 0]} castShadow>
              <meshStandardMaterial color={skinColor} roughness={0.6} />
            </Cylinder>
            <Cylinder args={[0.052, 0.048, 0.08]} position={[0, -0.36, 0]} castShadow>
              <meshStandardMaterial color="#ffffff" roughness={0.8} />
            </Cylinder>
            <group position={[0, -0.42, 0.02]}>
              <Box args={[0.08, 0.06, 0.18]} castShadow>
                <meshStandardMaterial color={color} roughness={0.4} />
              </Box>
              <Box args={[0.085, 0.015, 0.185]} position={[0, -0.025, 0]}>
                <meshStandardMaterial color="#ffffff" roughness={0.9} />
              </Box>
            </group>
          </group>

          {/* Torso Jersey Body */}
          <Cylinder args={[0.18, 0.15, 0.58]} position={[0, 0.74, 0]} castShadow>
            <meshStandardMaterial color={color} roughness={0.5} />
          </Cylinder>
          <Cylinder args={[0.09, 0.09, 0.02]} position={[0, 1.035, 0]}>
            <meshStandardMaterial color="#ffffff" />
          </Cylinder>
          <Box args={[0.07, 0.1, 0.01]} position={[0, 0.82, 0.155]}>
            <meshStandardMaterial color="#ffffff" roughness={0.9} />
          </Box>

          {/* Neck & Head */}
          <Cylinder args={[0.045, 0.048, 0.1]} position={[0, 1.08, 0]} castShadow>
            <meshStandardMaterial color={skinColor} roughness={0.6} />
          </Cylinder>
          <Sphere args={[0.15, 16, 16]} position={[0, 1.22, 0]} castShadow>
            <meshStandardMaterial color={skinColor} roughness={0.5} />
          </Sphere>

          {hairStyle === 0 && (
            <>
              <Sphere args={[0.142, 12, 12]} position={[0, 1.28, -0.025]} castShadow>
                <meshStandardMaterial color="#1e1b18" roughness={0.9} />
              </Sphere>
              <Sphere args={[0.08, 8, 8]} position={[0, 1.34, -0.09]} castShadow>
                <meshStandardMaterial color="#1e1b18" roughness={0.9} />
              </Sphere>
            </>
          )}
          {hairStyle === 1 && (
            <>
              <Sphere args={[0.145, 12, 12]} position={[0, 1.27, -0.02]} castShadow>
                <meshStandardMaterial color="#b45309" roughness={0.9} />
              </Sphere>
              <Cylinder args={[0.04, 0.05, 0.12]} position={[0, 1.39, -0.1]} rotation={[Math.PI / 4, 0, 0]} castShadow>
                <meshStandardMaterial color="#b45309" roughness={0.9} />
              </Cylinder>
            </>
          )}
          {hairStyle === 2 && (
            <>
              <Sphere args={[0.152, 12, 12]} position={[0, 1.26, -0.02]} castShadow>
                <meshStandardMaterial color="#3f3f46" roughness={0.95} />
              </Sphere>
              <Box args={[0.05, 0.05, 0.05]} position={[0, 1.36, -0.05]} castShadow>
                <meshStandardMaterial color="#3f3f46" roughness={0.95} />
              </Box>
            </>
          )}

          <Sphere args={[0.028, 8, 8]} position={[-0.15, 1.22, 0]} castShadow>
            <meshStandardMaterial color={skinColor} roughness={0.6} />
          </Sphere>
          <Sphere args={[0.028, 8, 8]} position={[0.15, 1.22, 0]} castShadow>
            <meshStandardMaterial color={skinColor} roughness={0.6} />
          </Sphere>

          <Cylinder args={[0.152, 0.152, 0.03]} position={[0, 1.26, 0]} rotation={[0.05, 0, 0]} castShadow>
            <meshStandardMaterial color="#f43f5e" roughness={0.5} />
          </Cylinder>

          <group position={[0, 1.24, 0.08]} rotation={[0.05, 0, 0]}>
            <Box args={[0.19, 0.035, 0.05]} castShadow>
              <meshStandardMaterial color="#111827" roughness={0.1} metalness={0.9} />
            </Box>
            <Box args={[0.17, 0.04, 0.01]} position={[0, -0.005, 0.026]}>
              <meshStandardMaterial color={team === 'A' ? '#facc15' : '#3b82f6'} roughness={0.1} metalness={0.9} />
            </Box>
          </group>

          {/* Left Arm assembly */}
          <group ref={leftArmRef} position={[-0.23, 0.94, 0.02]} rotation={[0.4, 0, 0.12]}>
            <Sphere args={[0.065, 12, 12]} position={[0, 0, 0]} castShadow>
              <meshStandardMaterial color={color} roughness={0.5} />
            </Sphere>
            <Cylinder args={[0.055, 0.05, 0.22]} position={[0, -0.11, 0]} castShadow>
              <meshStandardMaterial color={color} roughness={0.5} />
            </Cylinder>
            <Cylinder args={[0.045, 0.04, 0.26]} position={[0, -0.32, 0]} castShadow>
              <meshStandardMaterial color={skinColor} roughness={0.6} />
            </Cylinder>
            <Cylinder args={[0.048, 0.048, 0.04]} position={[0, -0.38, 0]}>
              <meshStandardMaterial color="#ffffff" roughness={0.8} />
            </Cylinder>
            <Sphere args={[0.045, 10, 10]} position={[0, -0.46, 0]} castShadow>
              <meshStandardMaterial color={skinColor} roughness={0.5} />
            </Sphere>
          </group>

          {/* Right Arm assembly */}
          <group ref={rightArmRef} position={[0.23, 0.94, 0.02]} rotation={[0.4, 0, -0.12]}>
            <Sphere args={[0.065, 12, 12]} position={[0, 0, 0]} castShadow>
              <meshStandardMaterial color={color} roughness={0.5} />
            </Sphere>
            <Cylinder args={[0.055, 0.05, 0.22]} position={[0, -0.11, 0]} castShadow>
              <meshStandardMaterial color={color} roughness={0.5} />
            </Cylinder>
            <Cylinder args={[0.045, 0.04, 0.26]} position={[0, -0.32, 0]} castShadow>
              <meshStandardMaterial color={skinColor} roughness={0.6} />
            </Cylinder>
            <Cylinder args={[0.048, 0.048, 0.04]} position={[0, -0.38, 0]}>
              <meshStandardMaterial color="#ffffff" roughness={0.8} />
            </Cylinder>
            <Sphere args={[0.045, 10, 10]} position={[0, -0.46, 0]} castShadow>
              <meshStandardMaterial color={skinColor} roughness={0.5} />
            </Sphere>

            {isGymDumbbell && (
              <group position={[0, -0.47, 0.03]} rotation={[Math.PI / 2, 0, 0]}>
                <Cylinder args={[0.015, 0.015, 0.3]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                  <meshStandardMaterial color="#374151" metalness={0.8} />
                </Cylinder>
                <Cylinder args={[0.1, 0.1, 0.04]} position={[0, 0.13, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                  <meshStandardMaterial color="#1e293b" />
                </Cylinder>
                <Cylinder args={[0.1, 0.1, 0.04]} position={[0, -0.13, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                  <meshStandardMaterial color="#1e293b" />
                </Cylinder>
              </group>
            )}

            {hasRacket && (
              <group position={[0, -0.47, 0.05]} rotation={[Math.PI / 2.2, 0, 0]}>
                <Cylinder args={[0.018, 0.018, 0.35]} position={[0, -0.15, 0]} castShadow>
                  <meshStandardMaterial color="#78350f" roughness={0.9} />
                </Cylinder>
                {sportType === 'PICKLEBALL' ? (
                  <Box args={[0.18, 0.25, 0.02]} position={[0, 0.12, 0]} castShadow>
                    <meshStandardMaterial color="#0284c7" roughness={0.4} />
                  </Box>
                ) : (
                  <mesh position={[0, 0.12, 0]} castShadow>
                    <torusGeometry args={[0.12, 0.012, 12, 24]} />
                    <meshStandardMaterial color="#ef4444" metalness={0.7} />
                  </mesh>
                )}
              </group>
            )}

            {role === 'batter' && (
              <group position={[0, -0.47, 0.08]} rotation={[Math.PI / 2.4, 0, 0.2]}>
                <Box args={[0.045, 0.65, 0.11]} position={[0, 0.1, 0]} castShadow>
                  <meshStandardMaterial color="#b45309" roughness={0.8} />
                </Box>
                <Cylinder args={[0.02, 0.02, 0.3]} position={[0, -0.25, 0]} castShadow>
                  <meshStandardMaterial color="#475569" />
                </Cylinder>
              </group>
            )}
          </group>

          {isGymSquatBar && (
            <group position={[0, 1.15, 0]}>
              <Cylinder args={[0.02, 0.02, 1.6]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <meshStandardMaterial color="#e5e7eb" metalness={0.9} />
              </Cylinder>
              <Cylinder args={[0.25, 0.25, 0.1]} position={[-0.7, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <meshStandardMaterial color="#111827" />
              </Cylinder>
              <Cylinder args={[0.25, 0.25, 0.1]} position={[0.7, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <meshStandardMaterial color="#111827" />
              </Cylinder>
            </group>
          )}

        </group>

        {/* Low Detail (LOD Variant) */}
        <group>
          <Box args={[0.45, 1.15, 0.35]} position={[0, 0.575, 0]}>
            <meshStandardMaterial color={color} />
          </Box>
          <Sphere args={[0.18, 8, 8]} position={[0, 1.33, 0]}>
            <meshStandardMaterial color={skinColor} />
          </Sphere>
        </group>
      </Detailed>
    </group>
  );
};

const ShotTrajectory = ({ sportType, courtL, courtW, animate, visible }: any) => {
  const lineRef = useRef<any>(null);
  
  const positions = React.useMemo(() => new Float32Array(21 * 3), []);
  
  useFrame((state) => {
    if (!lineRef.current || !visible || sportType !== 'BASKETBALL') return;
    
    const time = animate ? state.clock.getElapsedTime() : 0;
    const cycleDuration = 10.0;
    const cycle = animate ? time % cycleDuration : 0;
    
    let showLine = false;
    let endT = 0;
    
    if (cycle >= 2.5 && cycle <= 4.5) {
       showLine = true;
       endT = 4.5;
    } else if (cycle > 4.5 && cycle <= 7.0) { 
       showLine = true;
       endT = 7.0;
    }
    
    lineRef.current.visible = showLine;
    
    if (showLine) {
       const isAttackA = Math.floor(time / cycleDuration) % 2 === 0;
       const numSamples = 20;
       for(let i=0; i<=numSamples; i++){
          const tSample = cycle + (i/numSamples)*(endT - cycle);
          const snap = getRawBasketballPositions(tSample, isAttackA, courtL, courtW);
          positions[i*3] = snap.ball[0];
          positions[i*3+1] = snap.ball[1];
          positions[i*3+2] = snap.ball[2];
       }
       if (lineRef.current.geometry && lineRef.current.geometry.setPositions) {
          // line2 geometry uses setPositions
          lineRef.current.geometry.setPositions(positions);
       }
    }
  });

  if (sportType !== 'BASKETBALL') return null;

  return (
    <Line 
       ref={lineRef} 
       points={[new THREE.Vector3(0,0,0), new THREE.Vector3(1,1,1)]} // initial dummy points (minimum 2)
       color="#ef4444" 
       lineWidth={4} 
       dashed={true} 
       dashScale={10} 
       dashSize={0.5} 
    />
  );
};

const SimulatedBall = ({ sportType, courtL, courtW, animate, visible = true }: { sportType: string, courtL: number, courtW: number, animate: boolean, visible?: boolean }) => {
  const ballRef = useRef<any>(null);
  const currentPos = useRef<[number, number, number] | null>(null);

  useFrame((state, delta) => {
    if (!ballRef.current || !visible) return;
    const time = animate ? state.clock.getElapsedTime() : 0;

    const { ballPosition } = getDeterministicMatchState(sportType, time, courtL, courtW);

    const targetX = ballPosition[0];
    const targetY = ballPosition[1];
    const targetZ = ballPosition[2];

    const lerpSpeed = 7.0;
    const t = animate ? (1 - Math.exp(-lerpSpeed * delta)) : 1.0;

    if (!currentPos.current) {
      currentPos.current = [targetX, targetY, targetZ];
    } else {
      const distSq = 
        Math.pow(targetX - currentPos.current[0], 2) + 
        Math.pow(targetY - currentPos.current[1], 2) + 
        Math.pow(targetZ - currentPos.current[2], 2);
      
      if (distSq > 64 || !animate) {
        currentPos.current = [targetX, targetY, targetZ];
      } else {
        currentPos.current[0] += (targetX - currentPos.current[0]) * t;
        currentPos.current[1] += (targetY - currentPos.current[1]) * t;
        currentPos.current[2] += (targetZ - currentPos.current[2]) * t;
      }
    }

    ballRef.current.position.set(currentPos.current[0], currentPos.current[1], currentPos.current[2]);

    if (sportType === 'BADMINTON') {
      const cycle = time * 1.8;
      const directionZ = Math.cos(cycle);
      ballRef.current.rotation.x = animate ? -directionZ * 0.6 : 0;
      ballRef.current.rotation.y = animate ? time * 3 : 0;
    } else if (animate) {
      ballRef.current.rotation.x += 0.05;
      ballRef.current.rotation.z += 0.03;
    }
  });

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
    ballColor = '#1e293b';
    ballSize = 0.052;
  } else if (sportType === 'VOLLEYBALL') {
    ballColor = '#facc15';
    ballSize = 0.14;
  } else if (sportType === 'BASKETBALL') {
    ballColor = '#78350f'; // Dark leather brown/orange so it contrasts against the bright orange court!
    ballSize = 0.12;
  } else {
    return null;
  }

  if (!visible) return null;

  if (sportType === 'BADMINTON') {
    return (
      <group ref={ballRef} position={[0, -10, 0]}>
        <Sphere args={[0.045, 12, 12]} position={[0, -0.04, 0]} castShadow>
          <meshStandardMaterial color="#f8fafc" roughness={0.3} />
        </Sphere>
        <Cylinder args={[0.075, 0.035, 0.09, 12, 1, true]} position={[0, 0.015, 0]} castShadow>
          <meshStandardMaterial color="#f1f5f9" roughness={0.8} transparent opacity={0.65} />
        </Cylinder>
        <Cylinder args={[0.075, 0.035, 0.09, 12, 1, true]} position={[0, 0.015, 0]}>
          <meshStandardMaterial color="#cbd5e1" wireframe roughness={0.9} />
        </Cylinder>
      </group>
    );
  }

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
    animatePlayers = true,
    poolDepth = 6
  } = config;

  // Find exact hex codes with material overrides
  let primaryHex = COLORS.find(c => c.value === primaryColor)?.hex || '#ffffff';
  let secondaryHex = COLORS.find(c => c.value === secondaryColor)?.hex || '#ffffff';
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
    <Bvh firstHitOnly>
    <group position={[0, -0.5, 0]}>
      {/* 1. Runout Zone */}
      {sportType === 'SWIMMING_POOL' ? (
        <group>
          {/* North runout */}
          <Box args={[runoutW, 0.1, 1.5]} position={[0, -0.05, -courtL / 2 - 0.75]} receiveShadow>
            <meshStandardMaterial color={secondaryHex} roughness={roughness} metalness={metalness} />
          </Box>
          {/* South runout */}
          <Box args={[runoutW, 0.1, 1.5]} position={[0, -0.05, courtL / 2 + 0.75]} receiveShadow>
            <meshStandardMaterial color={secondaryHex} roughness={roughness} metalness={metalness} />
          </Box>
          {/* West runout */}
          <Box args={[1.5, 0.1, courtL]} position={[-courtW / 2 - 0.75, -0.05, 0]} receiveShadow>
            <meshStandardMaterial color={secondaryHex} roughness={roughness} metalness={metalness} />
          </Box>
          {/* East runout */}
          <Box args={[1.5, 0.1, courtL]} position={[courtW / 2 + 0.75, -0.05, 0]} receiveShadow>
            <meshStandardMaterial color={secondaryHex} roughness={roughness} metalness={metalness} />
          </Box>
        </group>
      ) : (
        <Box args={[runoutW, 0.1, runoutL]} position={[0, -0.05, 0]} receiveShadow>
          <meshStandardMaterial color={secondaryHex} roughness={roughness} metalness={metalness} />
        </Box>
      )}

      {/* 2. Primary Play Area */}
      {sportType !== 'SWIMMING_POOL' && (
        <Box args={[courtW, 0.12, courtL]} position={[0, -0.04, 0]} receiveShadow>
          <meshStandardMaterial color={primaryHex} roughness={roughness} metalness={metalness} />
        </Box>
      )}

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
           <ShotTrajectory sportType="BASKETBALL" courtL={courtL} courtW={courtW} animate={animatePlayers} visible={visualizePlayers} />
           <SimulatedBall sportType="BASKETBALL" courtL={courtL} courtW={courtW} animate={animatePlayers} visible={visualizePlayers} />
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
        </group>
      )}

        {sportType === 'SWIMMING_POOL' && (
          <group>
             {/* Dynamic visual representation of custom depth */}
             {(() => {
               const visualDepth = poolDepth * 0.22;
               const isGlass = config.glassPool !== false;
               const isClearWater = config.crystalClearWater === true;
               return (
                 <group>
                   {/* --- HOLLOW POOL BASIN SHELL --- */}
                   {/* Basin Pool Floor (Plaster / tiled base) */}
                   <Box args={[courtW, 0.05, courtL]} position={[0, -visualDepth - 0.025, 0]} receiveShadow>
                     <meshStandardMaterial color={primaryHex} roughness={roughness} metalness={metalness} />
                   </Box>

                   {/* Basin Perimeter Side Walls */}
                   {/* Front Inner Wall */}
                   <Box args={[courtW + 0.1, visualDepth, 0.05]} position={[0, -visualDepth / 2, -courtL / 2 - 0.025]} receiveShadow>
                     {isGlass ? (
                       <meshStandardMaterial color="#38bdf8" transparent opacity={isClearWater ? 0.08 : 0.25} roughness={0.05} metalness={0.9} depthWrite={false} />
                     ) : (
                       <meshStandardMaterial color={secondaryHex} roughness={0.5} />
                     )}
                   </Box>
                   {/* Back Inner Wall */}
                   <Box args={[courtW + 0.1, visualDepth, 0.05]} position={[0, -visualDepth / 2, courtL / 2 + 0.025]} receiveShadow>
                     {isGlass ? (
                       <meshStandardMaterial color="#38bdf8" transparent opacity={isClearWater ? 0.08 : 0.25} roughness={0.05} metalness={0.9} depthWrite={false} />
                     ) : (
                       <meshStandardMaterial color={secondaryHex} roughness={0.5} />
                     )}
                   </Box>
                   {/* Left Inner Wall */}
                   <Box args={[0.05, visualDepth, courtL + 0.1]} position={[-courtW / 2 - 0.025, -visualDepth / 2, 0]} receiveShadow>
                     {isGlass ? (
                       <meshStandardMaterial color="#38bdf8" transparent opacity={isClearWater ? 0.08 : 0.25} roughness={0.05} metalness={0.9} depthWrite={false} />
                     ) : (
                       <meshStandardMaterial color={secondaryHex} roughness={0.5} />
                     )}
                   </Box>
                   {/* Right Inner Wall */}
                   <Box args={[0.05, visualDepth, courtL + 0.1]} position={[courtW / 2 + 0.025, -visualDepth / 2, 0]} receiveShadow>
                     {isGlass ? (
                       <meshStandardMaterial color="#38bdf8" transparent opacity={isClearWater ? 0.08 : 0.25} roughness={0.05} metalness={0.9} depthWrite={false} />
                     ) : (
                       <meshStandardMaterial color={secondaryHex} roughness={0.5} />
                     )}
                   </Box>

                   {/* Top Safety Deck Coping Border Frame */}
                   <Box args={[courtW + 0.4, 0.04, 0.25]} position={[0, 0.02, -courtL/2 - 0.125]} castShadow>
                     <meshStandardMaterial color="#cbd5e1" roughness={0.3} />
                   </Box>
                   <Box args={[courtW + 0.4, 0.04, 0.25]} position={[0, 0.02, courtL/2 + 0.125]} castShadow>
                     <meshStandardMaterial color="#cbd5e1" roughness={0.3} />
                   </Box>
                   <Box args={[0.25, 0.04, courtL + 0.4]} position={[-courtW/2 - 0.125, 0.02, 0]} castShadow>
                     <meshStandardMaterial color="#cbd5e1" roughness={0.3} />
                   </Box>
                   <Box args={[0.25, 0.04, courtL + 0.4]} position={[courtW/2 + 0.125, 0.02, 0]} castShadow>
                     <meshStandardMaterial color="#cbd5e1" roughness={0.3} />
                   </Box>

                   {/* Keep existing items for follow-up replacement */}
 
            {/* Beautiful water block - translucent blue reflection */}
            <Box args={[courtW - 0.08, visualDepth - 0.01, courtL - 0.08]} position={[0, -visualDepth / 2, 0]} receiveShadow>
              <meshStandardMaterial 
                color="#22d3ee" 
                roughness={0.05} 
                metalness={0.4} 
                transparent 
                opacity={isClearWater ? 0.04 : 0.35} 
                depthWrite={false}
              />
            </Box>
 
            {/* Pool Steps Ladder trailing down depending on Pool Depth */}
            {[-1, 1].map((xSide) => {
              const ladderX = xSide * (courtW/2 - 0.3);
              const ladderZ = -courtL/2 + 1.2;
              return (
                <group key={xSide} position={[ladderX, 0, ladderZ]}>
                  {/* Metal rails */}
                  <Cylinder args={[0.015, 0.015, visualDepth + 0.4, 8]} position={[-0.08, -visualDepth/2 + 0.2, 0]} castShadow>
                    <meshStandardMaterial color="#cbd5e1" roughness={0.1} metalness={0.9} />
                  </Cylinder>
                  <Cylinder args={[0.015, 0.015, visualDepth + 0.4, 8]} position={[0.08, -visualDepth/2 + 0.2, 0]} castShadow>
                    <meshStandardMaterial color="#cbd5e1" roughness={0.1} metalness={0.9} />
                  </Cylinder>
                  {/* Steps staggered down */}
                  {Array.from({ length: Math.ceil(poolDepth / 2) }).map((_, stepIdx) => {
                    const stepY = -stepIdx * 0.35;
                    if (stepY > -visualDepth) {
                      return (
                        <Box key={stepIdx} args={[0.16, 0.015, 0.05]} position={[0, stepY, 0]}>
                          <meshStandardMaterial color="#f8fafc" roughness={0.3} />
                        </Box>
                      );
                    }
                    return null;
                  })}
                </group>
              );
            })}

            {/* Lane Starting Blocks */}
            {Array.from({ length: 4 }).map((_, laneIdx) => {
              const laneX = (laneIdx - 1.5) * (courtW / 4);
              return (
                <group key={laneIdx} position={[laneX, 0, -courtL/2 + 0.15]}>
                  {/* Pedestal Base */}
                  <Box args={[0.1, 0.25, 0.1]} position={[0, 0.125, 0]} castShadow>
                     <meshStandardMaterial color="#475569" roughness={0.5} />
                  </Box>
                  {/* Angled Plate */}
                  <Box args={[0.24, 0.03, 0.24]} position={[0, 0.26, -0.01]} rotation={[-0.18, 0, 0]} castShadow>
                     <meshStandardMaterial color="#0284c7" roughness={0.4} />
                  </Box>
                  {/* Number block highlight (Lane label) */}
                  <Box args={[0.12, 0.12, 0.02]} position={[0, 0.15, -0.055]}>
                     <meshStandardMaterial color="#ffffff" />
                  </Box>
                </group>
              );
            })}
 
            {/* Pool lines on floor - perfectly aligned with pool Depth */}
            {Array.from({length: 3}).map((_, i) => (
              <Box key={i} args={[0.04, 0.015, courtL - 1.5]} position={[(i - 1) * (courtW / 4), -visualDepth + 0.01, 0]}>
                <meshStandardMaterial color="#0284c7" />
              </Box>
            ))}

            {/* --- ADD-ON PREMIUM EQUIPMENT RENDERS --- */}
            
            {/* 1. POOL_LIGHTS: Glowing side-wall underwater light assemblies */}
            {selectedSmartFeatures.includes('POOL_LIGHTS') && (
              <group>
                {/* Render 4 glowing watertight fixtures with point lights to make the scene shine! */}
                {[
                  [-courtW/2 + 0.03, -visualDepth * 0.4, -courtL * 0.25, Math.PI / 2],
                  [-courtW/2 + 0.03, -visualDepth * 0.4, courtL * 0.25, Math.PI / 2],
                  [courtW/2 - 0.03, -visualDepth * 0.4, -courtL * 0.25, -Math.PI / 2],
                  [courtW/2 - 0.03, -visualDepth * 0.4, courtL * 0.25, -Math.PI / 2]
                ].map((light, index) => {
                  const [lx, ly, lz, rotY] = light;
                  return (
                    <group key={index} position={[lx, ly, lz]} rotation={[0, rotY, 0]}>
                      {/* Stainless fixture rim */}
                      <Cylinder args={[0.12, 0.12, 0.02, 16]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                        <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
                      </Cylinder>
                      {/* Emissive cyan neon light core */}
                      <Cylinder args={[0.09, 0.09, 0.022, 16]} rotation={[Math.PI / 2, 0, 0]}>
                        <meshStandardMaterial 
                          color="#06b6d4" 
                          emissive="#06b6d4" 
                          emissiveIntensity={2.5} 
                          roughness={0.0} 
                        />
                      </Cylinder>
                      {/* Real pointlight casting a brilliant dynamic aqua blue underwater glow */}
                      <pointLight color="#0891b2" intensity={1.8} distance={8} decay={1.5} position={[0, 0, 0.15]} />
                    </group>
                  );
                })}
              </group>
            )}

            {/* 2. POOL_PUMPS_FILTER: Waterfront pool jets & silver pumps */}
            {selectedSmartFeatures.includes('POOL_PUMPS_FILTER') && (
              <group>
                {/* Clean watertight wall jets for circulating salt water */}
                {[
                  [-courtW * 0.2, -visualDepth * 0.35, -courtL/2 + 0.03],
                  [courtW * 0.2, -visualDepth * 0.35, -courtL/2 + 0.03]
                ].map((jetPos, jetK) => (
                  <group key={jetK} position={[jetPos[0], jetPos[1], jetPos[2]]}>
                    <Cylinder args={[0.06, 0.08, 0.03, 12]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                      <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.3} />
                    </Cylinder>
                    <Cylinder args={[0.02, 0.02, 0.04, 12]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.015]}>
                      <meshStandardMaterial color="#1e293b" />
                    </Cylinder>
                  </group>
                ))}

                {/* Saltwater Filtration Tank Unit sitting neatly on the lower pool floor corner */}
                <group position={[courtW/2 - 0.75, -visualDepth + 0.22, courtL/2 - 0.75]}>
                  {/* Tank dome block */}
                  <Cylinder args={[0.13, 0.13, 0.36, 16]} castShadow receiveShadow>
                    <meshStandardMaterial color="#64748b" metalness={0.6} roughness={0.3} />
                  </Cylinder>
                  {/* Spherical top head */}
                  <mesh position={[0, 0.18, 0]} castShadow>
                    <sphereGeometry args={[0.13, 16, 12]} />
                    <meshStandardMaterial color="#475569" metalness={0.6} roughness={0.3} />
                  </mesh>
                  {/* Pressure valve */}
                  <Cylinder args={[0.02, 0.02, 0.08, 8]} position={[0, 0.25, 0.06]} rotation={[0.4, 0, 0]} castShadow>
                    <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
                  </Cylinder>
                  {/* Inflow connection tube */}
                  <Cylinder args={[0.02, 0.02, 0.18, 8]} position={[-0.1, -0.05, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
                    <meshStandardMaterial color="#1e293b" />
                  </Cylinder>
                </group>
              </group>
            )}

            {/* 3. POOL_HEATER: Heavy silver heat grates with indicator active light */}
            {selectedSmartFeatures.includes('POOL_HEATER') && (
              <group position={[-courtW/2 + 0.8, -visualDepth + 0.08, -courtL/2 + 1.2]}>
                {/* Titanium Heat Exchanger chassis box */}
                <Box args={[0.45, 0.15, 0.35]} castShadow receiveShadow>
                  <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.25} />
                </Box>
                {/* Grated horizontal vents */}
                {[-0.04, 0.0, 0.04].map((oy) => (
                  <Box key={oy} args={[0.35, 0.015, 0.03]} position={[0, oy, 0.176]} castShadow>
                    <meshStandardMaterial color="#1e293b" />
                  </Box>
                ))}
                {/* Red hot active heat micro-indicator LED dot */}
                <Box args={[0.02, 0.02, 0.02]} position={[-0.15, 0.04, 0.176]}>
                  <meshStandardMaterial 
                    color="#ef4444" 
                    emissive="#ef4444" 
                    emissiveIntensity={2.5} 
                  />
                </Box>
                {/* Digital temp screen glow */}
                <Box args={[0.08, 0.04, 0.02]} position={[0.1, 0.04, 0.176]}>
                  <meshStandardMaterial 
                    color="#22c55e" 
                    emissive="#22c55e" 
                    emissiveIntensity={2.0} 
                  />
                </Box>
              </group>
            )}
                 </group>
               );
             })()}
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

      {/* Dynamic Professional Teams mapping */}
      {visualizePlayers && getPlayersForSport(sportType, primaryHex, secondaryHex, courtL, courtW).map((p) => (
         <AbstractPlayer 
           key={p.id}
           id={p.id}
           team={p.team}
           role={p.role}
           color={p.color}
           sportType={sportType}
           courtL={courtL}
           courtW={courtW}
           animate={animatePlayers}
           visible={visualizePlayers}
         />
      ))}
    </group>
    </Bvh>
  );
};

export const CourtVisualizer: React.FC<VisualizerProps> = ({ config }) => {
  return (
    <div className="relative w-full aspect-[4/3] sm:aspect-[5/3] bg-zinc-950 rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center p-0 border border-zinc-800">
      
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

