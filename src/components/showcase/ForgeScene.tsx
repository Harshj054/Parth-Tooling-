import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  ContactShadows,
  Environment,
  Lightformer,
  OrbitControls,
  RoundedBox,
  useGLTF,
} from '@react-three/drei'
import { useReducedMotion } from 'framer-motion'
import * as THREE from 'three'
import { cn } from '@/lib/utils'

/**
 * Real-time 3D "forge" — a stylised stamping die-set in the site's steel look.
 * When triggered, the ram slams down, a spark flashes, and the finished part
 * rises out of the die and becomes drag-rotatable. No video: the forming and
 * the part live in one scene, so there's no seam and it's identical for every
 * part. Reduced motion shows the finished part immediately.
 *
 * Stage 1: geometry + ram-slam + part-rise + orbit-after. (Sparks/mist next.)
 */

const STEEL = { color: '#c7ccd4', metalness: 1, roughness: 0.33 }
const DARK_STEEL = { color: '#818892', metalness: 1, roughness: 0.46 }

const ease = (x: number) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2)
const clamp01 = (x: number) => Math.max(0, Math.min(1, x))

type Anim = { phase: 'idle' | 'forming' | 'formed'; t: number; rise: number }

function PartRise({ src, anim }: { src: string; anim: React.MutableRefObject<Anim> }) {
  const { scene } = useGLTF(src)
  const g = useRef<THREE.Group>(null!)
  useFrame(() => {
    const rise = anim.current.rise
    const grp = g.current
    if (!grp) return
    grp.visible = rise > 0.001
    grp.position.y = THREE.MathUtils.lerp(-0.35, 0.15, rise)
    grp.scale.setScalar(0.58 * ease(rise))
  })
  return (
    <group ref={g}>
      <primitive object={scene} rotation={[-Math.PI / 2, 0, 0]} />
    </group>
  )
}

function Forge({
  src,
  run,
  reduce,
  onDone,
}: {
  src: string
  run: boolean
  reduce: boolean
  onDone?: () => void
}) {
  const ram = useRef<THREE.Group>(null!)
  const blank = useRef<THREE.Mesh>(null!)
  const flash = useRef<THREE.PointLight>(null!)
  const ring = useRef<THREE.Mesh>(null!)
  const anim = useRef<Anim>({ phase: reduce ? 'formed' : 'idle', t: 0, rise: reduce ? 1 : 0 })
  const [formed, setFormed] = useState(reduce)

  useEffect(() => {
    if (run && anim.current.phase === 'idle') {
      anim.current.phase = 'forming'
      anim.current.t = 0
    }
  }, [run])

  useFrame((_, dt) => {
    const a = anim.current
    // idle: gently pulse the cavity ring so it reads as "drop here"
    if (a.phase === 'idle' && ring.current) {
      const m = ring.current.material as THREE.MeshStandardMaterial
      m.emissiveIntensity = 1.1 + Math.sin(performance.now() / 380) * 0.5
    }
    if (a.phase !== 'forming') return

    a.t = Math.min(1, a.t + dt / 2.2)
    const t = a.t

    // ram: down by 0.45, hold to 0.6, back up by 1.0
    let ramP: number
    if (t < 0.45) ramP = ease(t / 0.45)
    else if (t < 0.6) ramP = 1
    else ramP = 1 - ease((t - 0.6) / 0.4)
    ram.current.position.y = THREE.MathUtils.lerp(1.75, 0.5, ramP)

    // blank squashes at contact then hides
    const contact = clamp01((t - 0.36) / 0.09)
    blank.current.scale.y = THREE.MathUtils.lerp(1, 0.55, contact)
    blank.current.visible = t < 0.5

    // spark flash around contact
    const wantFlash = t > 0.42 && t < 0.58 ? 9 : 0
    flash.current.intensity = THREE.MathUtils.lerp(flash.current.intensity, wantFlash, 0.35)

    // fade the cavity ring out as the part takes over
    if (ring.current) {
      const m = ring.current.material as THREE.MeshStandardMaterial
      m.opacity = THREE.MathUtils.lerp(m.opacity, 0, 0.1)
      m.emissiveIntensity = THREE.MathUtils.lerp(m.emissiveIntensity, 0, 0.1)
    }

    // part rises after contact
    a.rise = clamp01((t - 0.5) / 0.4)

    if (t >= 1) {
      a.phase = 'formed'
      setFormed(true)
      onDone?.()
    }
  })

  return (
    <group>
      {/* base plate */}
      <RoundedBox args={[3.4, 0.35, 2.6]} radius={0.05} position={[0, -1.15, 0]}>
        <meshStandardMaterial {...DARK_STEEL} />
      </RoundedBox>

      {/* lower die / bolster */}
      <RoundedBox args={[2.0, 0.7, 2.0]} radius={0.04} position={[0, -0.6, 0]}>
        <meshStandardMaterial {...STEEL} />
      </RoundedBox>

      {/* cavity ring — the glowing "feed here" slot */}
      <mesh ref={ring} position={[0, -0.23, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.52, 0.66, 56]} />
        <meshStandardMaterial
          color="#3DA0FF"
          emissive="#3DA0FF"
          emissiveIntensity={1.2}
          transparent
          opacity={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* guide posts */}
      {[
        [-0.86, -0.86],
        [0.86, -0.86],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.15, z]}>
          <cylinderGeometry args={[0.075, 0.075, 2.7, 20]} />
          <meshStandardMaterial {...DARK_STEEL} />
        </mesh>
      ))}

      {/* raw blank sitting in the die */}
      <mesh ref={blank} position={[0, -0.04, 0]} visible={!reduce}>
        <cylinderGeometry args={[0.5, 0.5, 0.36, 44]} />
        <meshStandardMaterial {...STEEL} />
      </mesh>

      {/* finished part */}
      <Suspense fallback={null}>
        <PartRise src={src} anim={anim} />
      </Suspense>

      {/* ram / upper die */}
      <group ref={ram} position={[0, reduce ? 1.75 : 1.75, 0]}>
        <RoundedBox args={[2.0, 0.5, 2.0]} radius={0.04} position={[0, 0.4, 0]}>
          <meshStandardMaterial {...STEEL} />
        </RoundedBox>
        <RoundedBox args={[1.25, 0.45, 1.25]} radius={0.03} position={[0, 0.02, 0]}>
          <meshStandardMaterial {...DARK_STEEL} />
        </RoundedBox>
      </group>

      <pointLight ref={flash} position={[0, 0.15, 0.7]} color="#ffb066" intensity={0} distance={5} decay={2} />
    </group>
  )
}

export function ForgeScene({
  src,
  run,
  onDone,
  className,
}: {
  src: string
  run: boolean
  onDone?: () => void
  className?: string
}) {
  const reduce = useReducedMotion() ?? false
  const [formed, setFormed] = useState(reduce)

  return (
    <div className={cn('relative h-full w-full', className)}>
      <Canvas dpr={[1, 2]} camera={{ position: [0, 1.5, 5.4], fov: 40 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.35} />
        <directionalLight position={[5, 7, 4]} intensity={1.05} />

        <Suspense fallback={null}>
          <Forge
            src={src}
            run={run}
            reduce={reduce}
            onDone={() => {
              setFormed(true)
              onDone?.()
            }}
          />
          <Environment resolution={256}>
            <Lightformer intensity={2.2} position={[0, 4, 3]} scale={[9, 9, 1]} />
            <Lightformer intensity={1.3} position={[-5, 1, 2]} scale={[3, 9, 1]} color="#dbeafe" />
            <Lightformer intensity={1.3} position={[5, 1, 2]} scale={[3, 9, 1]} color="#ffffff" />
            <Lightformer intensity={0.7} position={[0, -3, 2]} scale={[9, 3, 1]} color="#fff2e8" />
          </Environment>
        </Suspense>

        <ContactShadows position={[0, -1.32, 0]} opacity={0.4} scale={9} blur={2.6} far={4} />

        <OrbitControls
          makeDefault
          enabled={formed}
          enablePan={false}
          enableZoom={formed}
          minDistance={3.4}
          maxDistance={8}
          minPolarAngle={0.25}
          maxPolarAngle={Math.PI / 1.9}
          autoRotate={formed && !reduce}
          autoRotateSpeed={1.0}
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  )
}

useGLTF.preload('/models/impeller.glb')
