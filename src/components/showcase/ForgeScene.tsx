import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer, RoundedBox, useGLTF } from '@react-three/drei'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { useReducedMotion } from 'framer-motion'
import * as THREE from 'three'
import { cn } from '@/lib/utils'

/**
 * Real-time 3D forge — an H-frame hydraulic press in an industrial finish
 * (painted cast frame + polished steel dies). On trigger the ram winds up and
 * SLAMS: the die and part flash hot-forge orange (heat that cools to steel),
 * a spark burst + shockwave ring fire, and the camera punches in with an
 * impact shake. The finished part then rises out and spins on its own axis
 * (the press stays static). Reduced motion shows the finished part at rest.
 */

// Painted cast frame (semi-matte, steel-blue graphite) vs polished steel parts.
const FRAME = { color: '#3a4551', metalness: 0.5, roughness: 0.62 }
const STEEL = { color: '#c7ccd4', metalness: 1, roughness: 0.27 }
const DARK = { color: '#727a86', metalness: 1, roughness: 0.5 }
const HEAT = new THREE.Color('#ff6a2c')

const ease = (x: number) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2)
const easeIn = (x: number) => x * x
const easeOut = (x: number) => 1 - (1 - x) * (1 - x)
const clamp01 = (x: number) => Math.max(0, Math.min(1, x))
const lerp = THREE.MathUtils.lerp

// Fixed geometry anchors. The ram rests high (RAM_IDLE) so there's a clear
// gap above the finished part; the upper assembly sits higher to make room.
const CYL_BOTTOM = 2.45 // hydraulic cylinder mouth
const RAM_IDLE = 1.9
const RAM_CONTACT = 0.72
const RAM_HALF = 0.4 // half of ram box height
const DIE_TOP = -0.2
// The finished part floats well clear of the die so it can be freely tilted
// without any edge dipping into the bolster below.
const PART_Y = 0.62

export type BlankShape = 'billet' | 'disc' | 'strip'
type Anim = { phase: 'idle' | 'forming' | 'formed'; t: number; rise: number; heat: number }

function BlankGeo({ shape }: { shape: BlankShape }) {
  if (shape === 'disc') return <cylinderGeometry args={[0.6, 0.6, 0.12, 44]} />
  if (shape === 'strip') return <boxGeometry args={[1.1, 0.1, 0.5]} />
  return <cylinderGeometry args={[0.48, 0.48, 0.34, 44]} />
}

function makeSoftTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const ctx = c.getContext('2d')!
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  g.addColorStop(0, 'rgba(255,255,255,0.85)')
  g.addColorStop(0.45, 'rgba(226,235,247,0.3)')
  g.addColorStop(1, 'rgba(226,235,247,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 128, 128)
  return new THREE.CanvasTexture(c)
}

/* Bolt head detail. */
function Bolt({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.07, 0.07, 0.08, 6]} />
      <meshStandardMaterial {...DARK} />
    </mesh>
  )
}

/* Spark burst + mist puff, triggered at impact. */
function Fx({ anim }: { anim: React.MutableRefObject<Anim> }) {
  const N = 90
  const sparks = useRef<THREE.Points>(null!)
  const mist = useRef<THREE.Group>(null!)
  const started = useRef(false)
  const life = useRef(2)
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(N * 3), 3))
    return g
  }, [])
  const vel = useMemo(() => new Float32Array(N * 3), [])
  const soft = useMemo(() => makeSoftTexture(), [])

  useFrame((_, dt) => {
    const a = anim.current
    if (a.phase === 'forming' && !started.current && a.t > 0.4) {
      started.current = true
      life.current = 0
      const pos = geo.attributes.position.array as Float32Array
      for (let i = 0; i < N; i++) {
        pos[i * 3] = pos[i * 3 + 1] = pos[i * 3 + 2] = 0
        const ang = Math.random() * Math.PI * 2
        const sp = 2 + Math.random() * 4
        vel[i * 3] = Math.cos(ang) * sp
        vel[i * 3 + 1] = 1.5 + Math.random() * 4.5
        vel[i * 3 + 2] = Math.sin(ang) * sp
      }
    }
    if (life.current < 1) {
      life.current += dt / 0.7
      const pos = geo.attributes.position.array as Float32Array
      for (let i = 0; i < N; i++) {
        vel[i * 3 + 1] -= dt * 11
        pos[i * 3] += vel[i * 3] * dt
        pos[i * 3 + 1] += vel[i * 3 + 1] * dt
        pos[i * 3 + 2] += vel[i * 3 + 2] * dt
      }
      geo.attributes.position.needsUpdate = true
      ;(sparks.current.material as THREE.PointsMaterial).opacity = clamp01(1 - life.current)
    } else {
      ;(sparks.current.material as THREE.PointsMaterial).opacity = 0
    }
    const grow = clamp01((a.t - 0.4) / 0.5)
    const fade = a.phase === 'forming' ? 1 - clamp01((a.t - 0.5) / 0.45) : 0
    mist.current.scale.setScalar(0.6 + grow * 2.8)
    mist.current.children.forEach((ch) => {
      ;((ch as THREE.Sprite).material as THREE.SpriteMaterial).opacity = 0.55 * fade
    })
  })

  return (
    <group position={[0, DIE_TOP + 0.1, 0]}>
      <points ref={sparks} geometry={geo}>
        <pointsMaterial
          size={0.07}
          color="#ffc27a"
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <group ref={mist} position={[0, 0.1, 0]}>
        {[0, 1, 2].map((i) => (
          <sprite key={i} position={[(i - 1) * 0.28, i * 0.12, 0]}>
            <spriteMaterial map={soft} transparent opacity={0} depthWrite={false} color="#e2ebf7" />
          </sprite>
        ))}
      </group>
    </group>
  )
}

/* Expanding shockwave ring at impact. */
function Shockwave({ anim }: { anim: React.MutableRefObject<Anim> }) {
  const ref = useRef<THREE.Mesh>(null!)
  useFrame(() => {
    const a = anim.current
    const p = a.phase === 'forming' ? clamp01((a.t - 0.42) / 0.34) : a.phase === 'formed' ? 1 : 0
    const s = 0.3 + p * 3.2
    ref.current.scale.set(s, s, s)
    ;(ref.current.material as THREE.MeshBasicMaterial).opacity = p > 0 && p < 1 ? (1 - p) * 0.8 : 0
  })
  return (
    <mesh ref={ref} position={[0, DIE_TOP + 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.55, 0.68, 60]} />
      <meshBasicMaterial color="#ffb066" transparent opacity={0} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
    </mesh>
  )
}

/**
 * The finished part: rises out of the die, glows hot then cools, and once
 * `active` spins on its own axis (drag + auto-rotate). Materials are cloned so
 * the heat glow never bleeds into the shared GLB cache.
 */
function PartPresenter({
  src,
  anim,
  active,
  reduce,
}: {
  src: string
  anim: React.MutableRefObject<Anim>
  active: boolean
  reduce: boolean
}) {
  const { scene } = useGLTF(src)
  const cloned = useMemo(() => {
    const s = scene.clone(true)
    s.traverse((o) => {
      const m = (o as THREE.Mesh).material as THREE.MeshStandardMaterial | undefined
      if (m) (o as THREE.Mesh).material = m.clone()
    })
    return s
  }, [scene])
  const mats = useMemo(() => {
    const list: THREE.MeshStandardMaterial[] = []
    cloned.traverse((o) => {
      const m = (o as THREE.Mesh).material as THREE.MeshStandardMaterial | undefined
      if (m && 'emissive' in m) {
        // Tame the studio reflections so the polished part doesn't blow out to
        // pure white (and bloom) when it rotates to face a softbox.
        m.envMapIntensity = 0.55
        m.roughness = Math.min(1, (m.roughness ?? 0.4) + 0.15)
        m.emissive = HEAT.clone()
        m.emissiveIntensity = 0
        list.push(m)
      }
    })
    return list
  }, [cloned])

  const g = useRef<THREE.Group>(null!)
  const { camera, gl } = useThree()
  const drag = useRef({ on: false, lx: 0, ly: 0 })
  const rot = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (!active) return
    const el = gl.domElement
    const prev = el.style.touchAction
    el.style.touchAction = 'none'
    const down = (e: PointerEvent) => (drag.current = { on: true, lx: e.clientX, ly: e.clientY })
    const move = (e: PointerEvent) => {
      if (!drag.current.on) return
      rot.current.y += (e.clientX - drag.current.lx) * 0.01
      rot.current.x = THREE.MathUtils.clamp(rot.current.x + (e.clientY - drag.current.ly) * 0.008, -0.6, 0.6)
      drag.current.lx = e.clientX
      drag.current.ly = e.clientY
    }
    const up = () => (drag.current.on = false)
    const wheel = (e: WheelEvent) => {
      e.preventDefault()
      camera.position.z = THREE.MathUtils.clamp(camera.position.z + e.deltaY * 0.0025, 4.4, 9)
      camera.lookAt(0, 0.6, 0)
    }
    el.addEventListener('pointerdown', down)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    el.addEventListener('wheel', wheel, { passive: false })
    return () => {
      el.style.touchAction = prev
      el.removeEventListener('pointerdown', down)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      el.removeEventListener('wheel', wheel)
    }
  }, [active, gl, camera])

  useFrame((_, dt) => {
    const a = anim.current
    const grp = g.current
    if (!grp) return
    grp.visible = a.rise > 0.001
    grp.position.y = lerp(DIE_TOP + 0.05, PART_Y, a.rise)
    grp.scale.setScalar(0.5 * ease(a.rise))
    const glow = a.heat * 2.8
    for (const m of mats) m.emissiveIntensity = glow
    if (active) {
      if (!drag.current.on && !reduce) rot.current.y += 0.32 * dt
      grp.rotation.y = rot.current.y
      grp.rotation.x = rot.current.x
    }
  })

  return (
    <group ref={g}>
      <primitive object={cloned} rotation={[-Math.PI / 2, 0, 0]} />
    </group>
  )
}

/* Cinematic camera: punch-in + impact shake during the slam, then settles. */
const CAM_BASE_Y = 1.5
const CAM_BASE_Z = 6.8
const CAM_TARGET: [number, number, number] = [0, 0.6, 0]

function CameraChoreography({ anim, reduce }: { anim: React.MutableRefObject<Anim>; reduce: boolean }) {
  const { camera } = useThree()
  useEffect(() => {
    camera.position.set(0, CAM_BASE_Y, CAM_BASE_Z)
    camera.lookAt(...CAM_TARGET)
  }, [camera])
  useFrame(() => {
    if (reduce) return
    const a = anim.current
    if (a.phase !== 'forming') return
    const t = a.t
    const pIn = t < 0.42 ? 0 : t < 0.55 ? (t - 0.42) / 0.13 : clamp01(1 - (t - 0.55) / 0.32)
    const shake = t > 0.42 && t < 0.64 ? 0.06 * (1 - (t - 0.42) / 0.22) : 0
    camera.position.set(
      (Math.random() - 0.5) * shake,
      CAM_BASE_Y + (Math.random() - 0.5) * shake,
      lerp(CAM_BASE_Z, 5.6, ease(pIn)),
    )
    camera.lookAt(...CAM_TARGET)
  })
  return null
}

function Forge({
  src,
  shape,
  run,
  reduce,
  onDone,
}: {
  src?: string
  shape: BlankShape
  run: boolean
  reduce: boolean
  onDone?: () => void
}) {
  const ram = useRef<THREE.Group>(null!)
  const rod = useRef<THREE.Mesh>(null!)
  const blank = useRef<THREE.Mesh>(null!)
  const flash = useRef<THREE.PointLight>(null!)
  const ring = useRef<THREE.Mesh>(null!)
  const anim = useRef<Anim>({ phase: reduce ? 'formed' : 'idle', t: 0, rise: reduce && src ? 1 : 0, heat: 0 })
  const [formed, setFormed] = useState(reduce && Boolean(src))

  useEffect(() => {
    if (run && anim.current.phase === 'idle') {
      anim.current.phase = 'forming'
      anim.current.t = 0
    }
  }, [run])

  const setRam = (y: number) => {
    ram.current.position.y = y
    // stretch the piston rod between the cylinder mouth and the ram top
    const ramTop = y + RAM_HALF
    rod.current.position.y = (CYL_BOTTOM + ramTop) / 2
    rod.current.scale.y = Math.max(0.02, CYL_BOTTOM - ramTop)
  }

  useFrame((_, dt) => {
    const a = anim.current
    if (a.phase === 'idle') {
      if (ring.current) {
        const m = ring.current.material as THREE.MeshStandardMaterial
        m.emissiveIntensity = 1.1 + Math.sin(performance.now() / 380) * 0.5
      }
      setRam(RAM_IDLE)
      return
    }
    if (a.phase === 'formed') {
      setRam(RAM_IDLE)
      return
    }

    a.t = Math.min(1, a.t + dt / 2.4)
    const t = a.t

    // blank drops in
    if (t < 0.14) {
      blank.current.visible = true
      blank.current.position.y = lerp(1.0, 0.0, ease(t / 0.14))
      blank.current.scale.y = 1
    } else {
      blank.current.position.y = 0.0
      blank.current.scale.y = lerp(1, 0.5, clamp01((t - 0.36) / 0.08))
      blank.current.visible = t < 0.52
    }

    // ram: wind-up → SLAM (accelerating) → impact hold → retract (ease-out)
    let ry: number
    if (t < 0.14) ry = lerp(RAM_IDLE, RAM_IDLE + 0.16, ease(t / 0.14))
    else if (t < 0.42) ry = lerp(RAM_IDLE + 0.16, RAM_CONTACT, easeIn((t - 0.14) / 0.28))
    else if (t < 0.55) ry = RAM_CONTACT
    else ry = lerp(RAM_CONTACT, RAM_IDLE, easeOut((t - 0.55) / 0.45))
    setRam(ry)

    // heat: flash at impact, cool to steel
    a.heat = t < 0.42 ? 0 : t < 0.5 ? (t - 0.42) / 0.08 : clamp01(1 - (t - 0.5) / 0.45)

    // impact flash light
    flash.current.intensity = lerp(flash.current.intensity, t > 0.42 && t < 0.6 ? 14 : 0, 0.35)

    // cavity ring: blue slot fades, flashes orange at impact
    if (ring.current) {
      const m = ring.current.material as THREE.MeshStandardMaterial
      m.color.lerp(a.heat > 0.1 ? HEAT : new THREE.Color('#3DA0FF'), 0.2)
      m.emissive.copy(m.color)
      m.emissiveIntensity = lerp(m.emissiveIntensity, a.heat > 0.1 ? 3 : 0, 0.2)
      m.opacity = lerp(m.opacity, 0, 0.06)
    }

    a.rise = src ? clamp01((t - 0.5) / 0.4) : 0

    if (t >= 1) {
      a.phase = 'formed'
      a.heat = 0
      setFormed(true)
      onDone?.()
    }
  })

  return (
    <group>
      {/* ── FRAME (painted cast) ── */}
      <RoundedBox args={[3.7, 0.5, 2.5]} radius={0.04} position={[0, -1.55, 0]}>
        <meshStandardMaterial {...FRAME} />
      </RoundedBox>
      <RoundedBox args={[3.8, 0.62, 2.6]} radius={0.04} position={[0, 3.6, 0]}>
        <meshStandardMaterial {...FRAME} />
      </RoundedBox>
      {/* four columns / tie-rods (polished steel) */}
      {[
        [-1.58, -0.95],
        [1.58, -0.95],
        [-1.58, 0.95],
        [1.58, 0.95],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.85, z]}>
          <cylinderGeometry args={[0.13, 0.13, 5.7, 24]} />
          <meshStandardMaterial {...STEEL} />
        </mesh>
      ))}
      {/* hydraulic cylinder (painted) + steel cap */}
      <mesh position={[0, 3.0, 0]}>
        <cylinderGeometry args={[0.56, 0.56, 1.1, 40]} />
        <meshStandardMaterial {...FRAME} />
      </mesh>
      <mesh position={[0, 3.55, 0]}>
        <cylinderGeometry args={[0.62, 0.62, 0.12, 40]} />
        <meshStandardMaterial {...DARK} />
      </mesh>
      {/* piston rod (polished steel, resized each frame) */}
      <mesh ref={rod} position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.14, 0.14, 1, 28]} />
        <meshStandardMaterial {...STEEL} />
      </mesh>

      {/* bolster (steel) */}
      <RoundedBox args={[2.4, 0.4, 2.1]} radius={0.03} position={[0, -1.05, 0]}>
        <meshStandardMaterial {...STEEL} />
      </RoundedBox>
      {/* lower die (steel) */}
      <RoundedBox args={[1.6, 0.6, 1.6]} radius={0.03} position={[0, -0.5, 0]}>
        <meshStandardMaterial {...STEEL} />
      </RoundedBox>
      {/* cavity ring / glowing slot */}
      <mesh ref={ring} position={[0, DIE_TOP + 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 0.64, 56]} />
        <meshStandardMaterial
          color="#3DA0FF"
          emissive="#3DA0FF"
          emissiveIntensity={1.2}
          transparent
          opacity={reduce ? 0 : 0.9}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* raw blank */}
      <mesh ref={blank} position={[0, 0, 0]} visible={false}>
        <BlankGeo shape={shape} />
        <meshStandardMaterial {...STEEL} />
      </mesh>

      {/* finished part */}
      {src && (
        <Suspense fallback={null}>
          <PartPresenter src={src} anim={anim} active={formed} reduce={reduce} />
        </Suspense>
      )}

      {/* ram / slide (steel) with punch + guide shoes */}
      <group ref={ram} position={[0, RAM_IDLE, 0]}>
        <RoundedBox args={[1.7, 0.8, 1.7]} radius={0.03} position={[0, 0, 0]}>
          <meshStandardMaterial {...STEEL} />
        </RoundedBox>
        <RoundedBox args={[1.15, 0.4, 1.15]} radius={0.02} position={[0, -0.55, 0]}>
          <meshStandardMaterial {...DARK} />
        </RoundedBox>
        {[
          [-0.85, 0],
          [0.85, 0],
        ].map(([x], i) => (
          <mesh key={i} position={[x, 0, 0]}>
            <boxGeometry args={[0.14, 0.5, 0.5]} />
            <meshStandardMaterial {...FRAME} />
          </mesh>
        ))}
      </group>

      {/* bolt detail */}
      {[
        [-1.6, 3.6, 1.1],
        [1.6, 3.6, 1.1],
        [-1.6, 3.6, -1.1],
        [1.6, 3.6, -1.1],
        [-1.6, -1.55, 1.1],
        [1.6, -1.55, 1.1],
      ].map((p, i) => (
        <Bolt key={i} position={p as [number, number, number]} />
      ))}

      <pointLight ref={flash} position={[0, DIE_TOP + 0.3, 0.7]} color="#ff8a3c" intensity={0} distance={6} decay={2} />
      <CameraChoreography anim={anim} reduce={reduce} />
      {!reduce && (
        <>
          <Fx anim={anim} />
          <Shockwave anim={anim} />
        </>
      )}
    </group>
  )
}

export function ForgeScene({
  src,
  shape = 'billet',
  run,
  onDone,
  className,
}: {
  src?: string
  shape?: BlankShape
  run: boolean
  onDone?: () => void
  className?: string
}) {
  const reduce = useReducedMotion() ?? false

  return (
    <div className={cn('relative h-full w-full', className)}>
      <Canvas dpr={[1, 2]} camera={{ position: [0, 1.5, 6.8], fov: 40 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.35} />
        <directionalLight position={[5, 8, 4]} intensity={0.9} />

        <Suspense fallback={null}>
          <Forge src={src} shape={shape} run={run} reduce={reduce} onDone={onDone} />
          <Environment resolution={256}>
            <Lightformer intensity={1.8} position={[0, 5, 4]} scale={[10, 10, 1]} />
            <Lightformer intensity={1.05} position={[-6, 2, 3]} scale={[3, 10, 1]} color="#dbeafe" />
            <Lightformer intensity={1.05} position={[6, 2, 3]} scale={[3, 10, 1]} color="#ffffff" />
            <Lightformer intensity={0.6} position={[0, -3, 3]} scale={[10, 3, 1]} color="#fff2e8" />
          </Environment>
        </Suspense>

        <ContactShadows position={[0, -1.82, 0]} opacity={0.45} scale={11} blur={2.6} far={5} />

        <EffectComposer>
          <Bloom
            intensity={0.8}
            luminanceThreshold={0.62}
            luminanceSmoothing={0.25}
            mipmapBlur
            radius={0.75}
          />
        </EffectComposer>
      </Canvas>
    </div>
  )
}

useGLTF.preload('/models/impeller.glb')
