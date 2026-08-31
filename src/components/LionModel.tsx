import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import lionUrl from "@/assets/lions/saja_3d.glb?url";

type Props = {
  step: 0 | 1 | 2;
  onPlay?: (durationSec: number) => void;
};

const STEP_TO_CLIP: Record<0 | 1 | 2, string> = {
  0: "Armature|ShakeHand",
  1: "Armature|Think",
  2: "Armature|Complete",
};

function Model({ step, onPlay }: Props) {
  const { scene, animations } = useGLTF(lionUrl);
  const mixer = useRef<THREE.AnimationMixer | null>(null);
  const modelRef = useRef<THREE.Object3D>(null);

  useEffect(() => {
    mixer.current = new THREE.AnimationMixer(scene);
    return () => {
      mixer.current?.stopAllAction();
    };
  }, [scene]);

  useEffect(() => {
    if (!mixer.current) return;
    const clipName = STEP_TO_CLIP[step];
    const clip = animations.find(
      (c: THREE.AnimationClip) => c.name === clipName,
    );
    if (!clip) return;

    mixer.current.stopAllAction();
    const action = mixer.current.clipAction(clip);
    action.reset().play();

    onPlay?.(clip.duration);
  }, [step, animations, onPlay]);

  useFrame((_, delta) => mixer.current?.update(delta));

  useFrame(() => {
    if (!modelRef.current) return;
    modelRef.current.rotation.x = Math.PI / 2;
    modelRef.current.rotation.y = Math.PI;
    modelRef.current.rotation.z = Math.PI / 2;
    modelRef.current.position.y = -1.5;
    modelRef.current.scale.set(3, 3, 3);
  });

  return <primitive object={scene} ref={modelRef} />;
}

export function LionCanvas({ step, onPlay }: Props) {
  return (
    <Canvas
      style={{ width: 400, height: 400 }}
      camera={{ position: [0, 0, 8], fov: 35 }}
    >
      <ambientLight intensity={1.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <directionalLight position={[0, 10, 5]} intensity={1.5} />
      <Suspense fallback={null}>
        <Model step={step} onPlay={onPlay} />
      </Suspense>
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        enableRotate={true}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
      />
    </Canvas>
  );
}

useGLTF.preload(lionUrl);
