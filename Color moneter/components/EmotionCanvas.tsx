import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Html, PerspectiveCamera, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { Emotion } from '@/lib/emotions';

function EmotionOrb({ color, name, powerActive }) {
  // ... (keep existing EmotionOrb component)
}

function Cursor({ emotion, powerActive }) {
  // ... (keep existing Cursor component)
}

function ParticleSystem({ color }) {
  // ... (keep existing ParticleSystem component)
}

interface EmotionCanvasProps {
  emotion: Emotion;
  powerActive: boolean;
}

export default function EmotionCanvas({ emotion, powerActive }: EmotionCanvasProps) {
  return (
    <Canvas>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Cursor emotion={emotion} powerActive={powerActive} />
      {powerActive && <ParticleSystem color={emotion.color} />}
    </Canvas>
  );
}