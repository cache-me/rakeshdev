'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Float, OrbitControls, Stars } from '@react-three/drei'
import { Suspense, useMemo, useRef } from 'react'
import type { Mesh } from 'three'

import { useAdaptiveQuality } from '@/features/hero-3d/use-adaptive-quality'

function CoreShape() {
  const ref = useRef<Mesh>(null)
  useFrame((_, delta) => {
    if (!ref.current) return
    ref.current.rotation.y += delta * 0.35
    ref.current.rotation.x += delta * 0.08
  })
  return (
    <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.6}>
      <mesh ref={ref} castShadow>
        <icosahedronGeometry args={[1.2, 1]} />
        <meshStandardMaterial color="#6ea8ff" metalness={0.6} roughness={0.25} />
      </mesh>
    </Float>
  )
}

function SceneContent() {
  const quality = useAdaptiveQuality()
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 6, 2]} intensity={quality === 'LOW' ? 0.8 : 1.4} />
      <CoreShape />
      {quality === 'HIGH' ? <Stars radius={40} depth={20} count={800} factor={3} /> : null}
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.4} />
    </>
  )
}

export default function HeroScene() {
  const dpr = useMemo(() => {
    if (typeof window === 'undefined') return 1
    return window.devicePixelRatio > 1.5 ? 1.5 : 1
  }, [])

  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 0, 4.5], fov: 45 }}
      className="h-full w-full"
      aria-hidden
    >
      <Suspense fallback={null}>
        <SceneContent />
      </Suspense>
    </Canvas>
  )
}
