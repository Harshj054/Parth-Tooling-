import { Suspense, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer, OrbitControls, useGLTF } from '@react-three/drei'
import { useReducedMotion } from 'framer-motion'
import * as THREE from 'three'
import { cn } from '@/lib/utils'

/**
 * Real-time 3D part viewer. Loads a web-optimized GLB (tessellated from the
 * client's STEP/CAD) and presents it as a drag-to-spin turntable with studio
 * reflections — the interaction is what makes it read as a genuine 3D model
 * rather than a video. Lighting is built from Lightformers baked into an
 * environment map, so nothing is fetched from the network (CSP/offline safe).
 */

function Model({ src }: { src: string }) {
  const { scene } = useGLTF(src)
  // The GLB is pre-normalised (centred, longest side = 2 units). The impeller's
  // axis is +Z; stand it up so it spins like a turntable. Dial back the
  // reflected environment so the polished steel doesn't blow out to white.
  const tuned = useMemo(() => {
    scene.traverse((o) => {
      const m = (o as THREE.Mesh).material as THREE.MeshStandardMaterial | undefined
      if (m && 'envMapIntensity' in m) m.envMapIntensity = 0.6
    })
    return scene
  }, [scene])
  return <primitive object={tuned} rotation={[-Math.PI / 2, 0, 0]} />
}

export function PartViewer({ src, className }: { src: string; className?: string }) {
  const reduce = useReducedMotion()
  return (
    <div className={cn('relative h-full w-full', className)}>
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 2.1, 4.4], fov: 38 }}
        gl={{ antialias: true, alpha: true }}
        frameloop={reduce ? 'demand' : 'always'}
      >
        <ambientLight intensity={0.35} />
        <directionalLight position={[5, 6, 4]} intensity={1.1} />

        <Suspense fallback={null}>
          <Model src={src} />

          {/* Studio softboxes → crisp reflections on the steel, no external HDR. */}
          <Environment resolution={256}>
            <Lightformer intensity={1.7} position={[0, 4, 3]} scale={[8, 8, 1]} />
            <Lightformer intensity={1.05} position={[-5, 1, 2]} scale={[3, 8, 1]} color="#dbeafe" />
            <Lightformer intensity={1.05} position={[5, 1, 2]} scale={[3, 8, 1]} color="#ffffff" />
            <Lightformer intensity={0.6} position={[0, -4, 2]} scale={[8, 4, 1]} color="#fff2e8" />
          </Environment>

          <ContactShadows position={[0, -1.15, 0]} opacity={0.32} scale={7} blur={2.6} far={4} />
        </Suspense>

        <OrbitControls
          makeDefault
          enablePan={false}
          enableZoom
          minDistance={2.8}
          maxDistance={7}
          minPolarAngle={0.3}
          maxPolarAngle={Math.PI / 1.9}
          autoRotate={!reduce}
          autoRotateSpeed={1.1}
        />
      </Canvas>
    </div>
  )
}

useGLTF.preload('/models/impeller.glb')
