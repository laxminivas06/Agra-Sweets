import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';

// 1. Ghee Drop Component - Realistic Viscous Material
const GheePour = ({ position, delay }) => {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime() + delay;
    
    // Pouring motion (looping top to bottom)
    const cycle = (time * 0.8) % 3;
    meshRef.current.position.y = position[1] + (3 - cycle * 4);
    
    // Stretch effect as it falls
    meshRef.current.scale.set(0.4, 1.2 + Math.sin(time * 5) * 0.2, 0.4);
    
    // Pulsing glow
    meshRef.current.material.emissiveIntensity = 0.5 + Math.sin(time * 2) * 0.3;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshPhysicalMaterial 
        color="#fbbf24" // Golden honey color
        emissive="#f59e0b"
        roughness={0.05}
        metalness={0.1}
        transmission={0.8}
        thickness={2}
        ior={1.4}
        clearcoat={1}
      />
    </mesh>
  );
};

// 2. Realistic Floating Sweet (Static Mesh for Background)
const FloatingSweet = ({ type, position, rotationSpeed }) => {
  const meshRef = useRef();
  
  const texture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    let path = '';
    switch(type) {
      case 'laddu': path = '/assets/sweets/motichoor_laddu.png'; break;
      case 'kaju': path = '/assets/sweets/kaju_katli.png'; break;
      case 'jamun': path = '/assets/sweets/gulab_jamun.png'; break;
      case 'jalebi': path = '/assets/sweets/jalebi.png'; break;
      default: path = '/assets/sweets/motichoor_laddu.png';
    }
    return loader.load(path);
  }, [type]);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += rotationSpeed;
    meshRef.current.rotation.z += rotationSpeed * 0.5;
    meshRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 0.5) * 0.5;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[4, 4]} />
      <meshBasicMaterial map={texture} transparent={true} opacity={0.9} />
    </mesh>
  );
};

// Main Scene Transformation
export default function ThreeScene() {
  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 10, 5]} intensity={2} color="#fffbeb" />
      <Environment preset="sunset" />
      
      {/* 1. Remove the "bubbles" (particles). In place: Ghee Pouring Animation */}
      <group position={[0, 0, 0]}>
        <GheePour position={[0, 8, 2]} delay={0} />
        <GheePour position={[-4, 8, -2]} delay={1} />
        <GheePour position={[4, 8, -1]} delay={2} />
      </group>

      {/* 2. Realistic Sweet Preparation Cluster (Mimicking a bowl setup) */}
      <group position={[0, -2, 0]}>
        {/* Pot Base Approximation using layered floating sweets */}
        <FloatingSweet type="jamun" position={[0, 0, 0]} rotationSpeed={0.002} />
        <FloatingSweet type="jamun" position={[-2, 1, 1]} rotationSpeed={-0.003} />
        <FloatingSweet type="jamun" position={[2, 1.5, -1]} rotationSpeed={0.002} />
        <FloatingSweet type="jamun" position={[0, 3, 2]} rotationSpeed={0.001} />
        <FloatingSweet type="laddu" position={[-3, -1, 2]} rotationSpeed={0.004} />
        <FloatingSweet type="kaju" position={[3, -2, 1]} rotationSpeed={-0.005} />
      </group>


    </>
  );
}
