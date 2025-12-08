import React, { Suspense } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { Canvas, useLoader } from "@react-three/fiber/native";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Building3DModelProps {
  modelPath: any;
  size?: number;
}

function RotatingModel({ modelPath }: { modelPath: any }) {
  const obj = useLoader(OBJLoader, modelPath);
  
  // Apply basic material
  React.useEffect(() => {
    obj.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshPhongMaterial({
          color: 0x999999,
          flatShading: true,
        });
      }
    });
  }, [obj]);

  // Slow rotation
  useFrame(() => {
    obj.rotation.y += 0.008;
  });

  return <primitive object={obj} scale={0.03} position={[0, -1, 0]} />;
}

export function Building3DModel({ modelPath, size = 60 }: Building3DModelProps) {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Canvas
        camera={{ position: [0, 0, 4], fov: 50 }}
        gl={{ alpha: true }}
      >
        <color attach="background" args={["#F7FAFC"]} />
        <ambientLight intensity={0.7} />
        <directionalLight position={[2, 2, 2]} intensity={0.6} />
        <directionalLight position={[-2, -1, -2]} intensity={0.3} />
        
        <Suspense fallback={null}>
          <RotatingModel modelPath={modelPath} />
        </Suspense>
      </Canvas>
      
      <View style={styles.loadingContainer} pointerEvents="none">
        <ActivityIndicator size="small" color="#4299E1" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F7FAFC",
    borderRadius: 8,
    overflow: "hidden",
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(247, 250, 252, 0.5)",
  },
});
