import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const vertex = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  varying vec2 vUv;
  varying float vElevation;

  void main() {
    vUv = uv;
    vec3 pos = position;
    float wave =
      sin(pos.x * 1.1 + uTime * 0.28) * 0.42 +
      sin(pos.y * 1.4 - uTime * 0.21) * 0.34 +
      sin((pos.x + pos.y) * 0.7 + uTime * 0.15) * 0.28;
    float mouseInfluence =
      exp(-distance(vec2(pos.x, pos.y), uMouse * 4.0) * 0.35) * 0.55;
    pos.z += wave + mouseInfluence;
    vElevation = pos.z;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uAccent;
  varying vec2 vUv;
  varying float vElevation;

  void main() {
    float t = clamp(vElevation * 0.45 + 0.5, 0.0, 1.0);
    vec3 base = mix(uColorA, uColorB, t);
    float accent = smoothstep(0.62, 1.0, t) * 0.32
      + smoothstep(0.55, 0.0, vUv.y) * 0.06;
    vec3 color = mix(base, uAccent, accent);
    gl_FragColor = vec4(color, 1.0);
  }
`;

function FluidMesh() {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const target = useRef(new THREE.Vector2(0, 0));
  const { viewport } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uColorA: { value: new THREE.Color("#FAFAFA") },
      uColorB: { value: new THREE.Color("#F1F2F4") },
      uAccent: { value: new THREE.Color("#FF7A45") },
    }),
    [],
  );

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    if (!matRef.current) return;
    target.current.set(state.pointer.x, state.pointer.y);
    const m = uniforms.uMouse.value;
    m.lerp(target.current, 1 - Math.exp(-1.6 * dt));
    uniforms.uTime.value += dt;
  });

  const scale = Math.max(viewport.width, viewport.height) / 8;

  return (
    <mesh rotation={[-Math.PI / 3.1, 0, 0.35]} scale={Math.max(1.35, scale)}>
      <planeGeometry args={[14, 14, 180, 180]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={vertex}
        fragmentShader={fragment}
        wireframe={false}
      />
    </mesh>
  );
}

export default function HeroBackground() {
  return (
    <Canvas
      className="!absolute inset-0"
      dpr={[1, 1.75]}
      gl={{ antialias: true }}
      camera={{ position: [0, 0, 7], fov: 55 }}
    >
      <color attach="background" args={["#FAFAFA"]} />
      <ambientLight intensity={0.8} />
      <FluidMesh />
    </Canvas>
  );
}
