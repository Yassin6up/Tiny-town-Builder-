import React, { useEffect, useRef } from "react";
import { View, StyleSheet } from "react-native";
import { Canvas, useFrame, useThree } from "@react-three/fiber/native";
import * as THREE from "three";

interface VoxelRendererProps {
  voxelData: number[][][]; // 3D array of voxel colors
  size?: number;
  autoRotate?: boolean;
}

function VoxelMesh({ voxelData, autoRotate = true }: { voxelData: number[][][]; autoRotate: boolean }) {
  const meshRef = useRef<THREE.Group>(null);
  const geometry = new THREE.BoxGeometry(1, 1, 1);

  // Create voxel instances
  useEffect(() => {
    if (!meshRef.current) return;

    // Clear previous voxels
    while (meshRef.current.children.length > 0) {
      meshRef.current.remove(meshRef.current.children[0]);
    }

    // Create new voxels
    voxelData.forEach((layer, y) => {
      layer.forEach((row, z) => {
        row.forEach((colorValue, x) => {
          if (colorValue > 0) {
            const material = new THREE.MeshStandardMaterial({
              color: colorValue,
              metalness: 0.1,
              roughness: 0.7,
            });
            
            const voxel = new THREE.Mesh(geometry, material);
            voxel.position.set(x - layer[0].length / 2, y, z - layer.length / 2);
            meshRef.current?.add(voxel);
          }
        });
      });
    });

    // Center and scale the model
    if (meshRef.current) {
      const box = new THREE.Box3().setFromObject(meshRef.current);
      const center = box.getCenter(new THREE.Vector3());
      meshRef.current.position.sub(center);
      
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 3 / maxDim;
      meshRef.current.scale.setScalar(scale);
    }
  }, [voxelData]);

  // Auto-rotation
  useFrame(() => {
    if (meshRef.current && autoRotate) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  return <group ref={meshRef} />;
}

export function VoxelRenderer({ voxelData, size = 100, autoRotate = true }: VoxelRendererProps) {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Canvas
        camera={{ position: [5, 5, 5], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
      >
        <color attach="background" args={["#F7FAFC"]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <directionalLight position={[-3, -3, -3]} intensity={0.3} />
        
        <VoxelMesh voxelData={voxelData} autoRotate={autoRotate} />
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
  },
});

// Helper function to convert simple voxel data
export function createSimpleBuilding(type: 'bar' | 'candy' | 'casino' | 'pizza' | 'market'): number[][][] {
  // Simple voxel representations for each building type
  const buildings = {
    bar: createBar(),
    candy: createCandyShop(),
    casino: createCasino(),
    pizza: createPizzaPlace(),
    market: createMarket(),
  };
  
  return buildings[type];
}

// Simple bar building (tall with windows)
function createBar(): number[][][] {
  const voxels: number[][][] = [];
  const color = 0x708090; // Gray
  const windowColor = 0x87CEEB; // Light blue
  
  for (let y = 0; y < 8; y++) {
    const layer: number[][] = [];
    for (let z = 0; z < 4; z++) {
      const row: number[] = [];
      for (let x = 0; x < 4; x++) {
        // Walls
        if (x === 0 || x === 3 || z === 0 || z === 3) {
          row.push(y % 2 === 0 ? color : windowColor);
        } else {
          row.push(0); // Empty inside
        }
      }
      layer.push(row);
    }
    voxels.push(layer);
  }
  return voxels;
}

// Candy shop (colorful)
function createCandyShop(): number[][][] {
  const voxels: number[][][] = [];
  const colors = [0xFF69B4, 0xFFB6C1, 0xFFFFE0, 0xFFA500];
  
  for (let y = 0; y < 6; y++) {
    const layer: number[][] = [];
    for (let z = 0; z < 5; z++) {
      const row: number[] = [];
      for (let x = 0; x < 5; x++) {
        if (x === 0 || x === 4 || z === 0 || z === 4) {
          row.push(colors[y % colors.length]);
        } else {
          row.push(0);
        }
      }
      layer.push(row);
    }
    voxels.push(layer);
  }
  return voxels;
}

// Casino (pyramid shape)
function createCasino(): number[][][] {
  const voxels: number[][][] = [];
  const color = 0xDDA0DD; // Plum
  
  for (let y = 0; y < 7; y++) {
    const layer: number[][] = [];
    const size = 7 - y;
    const offset = Math.floor(y / 2);
    
    for (let z = 0; z < 7; z++) {
      const row: number[] = [];
      for (let x = 0; x < 7; x++) {
        if (x >= offset && x < size + offset && z >= offset && z < size + offset) {
          if (x === offset || x === size + offset - 1 || z === offset || z === size + offset - 1) {
            row.push(color);
          } else {
            row.push(0);
          }
        } else {
          row.push(0);
        }
      }
      layer.push(row);
    }
    voxels.push(layer);
  }
  return voxels;
}

// Pizza place (house with roof)
function createPizzaPlace(): number[][][] {
  const voxels: number[][][] = [];
  const wallColor = 0xDC143C; // Red
  const roofColor = 0xFFD700; // Gold
  
  // Base (4 layers)
  for (let y = 0; y < 4; y++) {
    const layer: number[][] = [];
    for (let z = 0; z < 6; z++) {
      const row: number[] = [];
      for (let x = 0; x < 6; x++) {
        if (x === 0 || x === 5 || z === 0 || z === 5) {
          row.push(wallColor);
        } else {
          row.push(0);
        }
      }
      layer.push(row);
    }
    voxels.push(layer);
  }
  
  // Roof (3 layers, decreasing size)
  for (let y = 4; y < 7; y++) {
    const layer: number[][] = [];
    const offset = y - 3;
    for (let z = 0; z < 6; z++) {
      const row: number[] = [];
      for (let x = 0; x < 6; x++) {
        if (x >= offset && x < 6 - offset && z >= offset && z < 6 - offset) {
          row.push(roofColor);
        } else {
          row.push(0);
        }
      }
      layer.push(row);
    }
    voxels.push(layer);
  }
  
  return voxels;
}

// Market (wide building)
function createMarket(): number[][][] {
  const voxels: number[][][] = [];
  const color = 0x32CD32; // Lime green
  const roofColor = 0xFF6347; // Tomato
  
  for (let y = 0; y < 5; y++) {
    const layer: number[][] = [];
    for (let z = 0; z < 4; z++) {
      const row: number[] = [];
      for (let x = 0; x < 8; x++) {
        if (y === 4) {
          // Roof
          row.push(roofColor);
        } else if (x === 0 || x === 7 || z === 0 || z === 3) {
          row.push(color);
        } else {
          row.push(0);
        }
      }
      layer.push(row);
    }
    voxels.push(layer);
  }
  return voxels;
}
