"use client";

import type { DeepPartial } from "@stream.ui/react";
import { Stream } from "@stream.ui/react";
import { OrbitControls, useTexture } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";
import * as THREE from "three";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type {
  MinecraftBlock,
  StreamingMinecraftData,
} from "./streaming-minecraft-schema";

const GRID_SIZE = 16;
const BLOCK_SIZE = 1;

const blockColors: Record<string, string> = {
  water: "#3d85c6",
  brick: "#96412f",
  gold: "#f9d71c",
  diamond: "#4aedd9",
  snow: "#f0f0f0",
  ice: "#a5d5f7",
};

const texturedBlocks = ["grass", "dirt", "stone", "log", "wood", "leaves", "glass"];

interface MinecraftBlockMeshProps {
  block: DeepPartial<MinecraftBlock>;
  index: number;
}

function MinecraftBlockMesh({ block, index }: MinecraftBlockMeshProps) {
  const meshRef = React.useRef<THREE.Mesh>(null);
  const [animated, setAnimated] = React.useState(false);
  const startY = React.useRef((block.y ?? 0) + 10);
  const targetY = block.y ?? 0;

  const textures = useTexture({
    grass_top: "/textures/minecraft/grass_carried.png",
    grass_side: "/textures/minecraft/grass_side_carried.png",
    dirt: "/textures/minecraft/dirt.png",
    stone: "/textures/minecraft/stone.png",
    log_side: "/textures/minecraft/log_oak.png",
    log_top: "/textures/minecraft/log_oak_top.png",
    wood: "/textures/minecraft/oak_planks.png",
    leaves: "/textures/minecraft/azalea_leaves.png",
    glass: "/textures/minecraft/glass.png",
  });

  React.useEffect(() => {
    Object.values(textures).forEach((texture) => {
      texture.magFilter = THREE.NearestFilter;
      texture.minFilter = THREE.NearestFilter;
    });
  }, [textures]);

  useFrame((_, delta) => {
    if (!meshRef.current || animated) return;

    const currentY = meshRef.current.position.y;
    const newY = THREE.MathUtils.lerp(currentY, targetY, delta * 8);

    if (Math.abs(newY - targetY) < 0.01) {
      meshRef.current.position.y = targetY;
      setAnimated(true);
    } else {
      meshRef.current.position.y = newY;
    }
  });

  if (
    block.x === undefined ||
    block.y === undefined ||
    block.z === undefined ||
    !block.type
  ) {
    return null;
  }

  const getMaterials = (): THREE.Material | THREE.Material[] => {
    const type = block.type;

    if (!type || !texturedBlocks.includes(type)) {
      const color = blockColors[type ?? "stone"] ?? "#888888";
      const material = new THREE.MeshLambertMaterial({
        color,
        transparent: type === "water" || type === "ice",
        opacity: type === "water" ? 0.7 : type === "ice" ? 0.8 : 1,
      });
      return material;
    }

    switch (type) {
      case "grass":
        return [
          new THREE.MeshLambertMaterial({ map: textures.grass_side }),
          new THREE.MeshLambertMaterial({ map: textures.grass_side }),
          new THREE.MeshLambertMaterial({ map: textures.grass_top }),
          new THREE.MeshLambertMaterial({ map: textures.dirt }),
          new THREE.MeshLambertMaterial({ map: textures.grass_side }),
          new THREE.MeshLambertMaterial({ map: textures.grass_side }),
        ];
      case "dirt":
        return new THREE.MeshLambertMaterial({ map: textures.dirt });
      case "stone":
        return new THREE.MeshLambertMaterial({ map: textures.stone });
      case "log":
        return [
          new THREE.MeshLambertMaterial({ map: textures.log_side }),
          new THREE.MeshLambertMaterial({ map: textures.log_side }),
          new THREE.MeshLambertMaterial({ map: textures.log_top }),
          new THREE.MeshLambertMaterial({ map: textures.log_top }),
          new THREE.MeshLambertMaterial({ map: textures.log_side }),
          new THREE.MeshLambertMaterial({ map: textures.log_side }),
        ];
      case "wood":
        return new THREE.MeshLambertMaterial({ map: textures.wood });
      case "leaves":
        return new THREE.MeshLambertMaterial({
          map: textures.leaves,
          transparent: true,
          alphaTest: 0.5,
        });
      case "glass":
        return new THREE.MeshLambertMaterial({
          map: textures.glass,
          transparent: true,
          opacity: 0.6,
        });
      default:
        return new THREE.MeshLambertMaterial({ color: "#888888" });
    }
  };

  return (
    <mesh
      ref={meshRef}
      position={[
        block.x - GRID_SIZE / 2 + 0.5,
        startY.current,
        block.z - GRID_SIZE / 2 + 0.5,
      ]}
      material={getMaterials()}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE]} />
    </mesh>
  );
}

interface SceneProps {
  blocks: DeepPartial<MinecraftBlock>[];
}

function Scene({ blocks }: SceneProps) {
  return (
    <>
      <color attach="background" args={["#e0f4ff"]} />

      <ambientLight intensity={0.6} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1}
        color="#ffffff"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[GRID_SIZE + 4, GRID_SIZE + 4]} />
        <meshLambertMaterial color="#5a8f3a" />
      </mesh>

      <gridHelper
        args={[GRID_SIZE, GRID_SIZE, "#3a5f2a", "#4a7f3a"]}
        position={[0, -0.49, 0]}
      />

      <React.Suspense fallback={null}>
        {blocks.map((block, index) => (
          <MinecraftBlockMesh
            key={block.id ?? index}
            block={block}
            index={index}
          />
        ))}
      </React.Suspense>

      <OrbitControls
        makeDefault
        enablePan={false}
        minDistance={10}
        maxDistance={40}
        minPolarAngle={0.2}
        maxPolarAngle={Math.PI / 2 - 0.1}
        target={[0, 2, 0]}
      />
    </>
  );
}

interface StreamingMinecraftProps {
  data: DeepPartial<StreamingMinecraftData> | undefined;
  isLoading: boolean;
  error?: Error;
  className?: string;
}

export function StreamingMinecraft({
  data,
  isLoading,
  error,
  className,
}: StreamingMinecraftProps) {
  const isStreaming = isLoading && data !== undefined;
  const isComplete = !isLoading && data !== undefined;
  const isIdle = !isLoading && data === undefined;
  const currentState = isComplete
    ? "complete"
    : isStreaming
      ? "streaming"
      : isLoading
        ? "loading"
        : "idle";

  const borderColors = {
    idle: "",
    loading: "border-yellow-500/50",
    streaming: "border-blue-500/50",
    complete: "border-green-500/50",
  };

  const validBlocks = React.useMemo(() => {
    if (!data?.blocks) return [];
    return data.blocks.filter(
      (block): block is DeepPartial<MinecraftBlock> =>
        block !== null &&
        block !== undefined &&
        typeof block.x === "number" &&
        typeof block.y === "number" &&
        typeof block.z === "number" &&
        typeof block.type === "string",
    );
  }, [data?.blocks]);

  return (
    <Stream.Root data={data} isLoading={isLoading} error={error}>
      <Card
        className={cn(
          "w-full max-w-2xl overflow-hidden transition-colors",
          isIdle ? "py-0" : "py-4",
          borderColors[currentState],
          className,
        )}
      >
        <AnimatePresence mode="popLayout">
          {!isIdle && (
            <motion.div
              initial={{
                opacity: 0,
                clipPath: "inset(0 0 100% 0)",
                y: -8,
              }}
              animate={{
                opacity: 1,
                clipPath: "inset(0 0 0 0)",
                y: 0,
              }}
              exit={{
                opacity: 0,
                clipPath: "inset(0 0 100% 0)",
                y: -8,
              }}
              transition={{
                duration: 0.25,
                ease: [0.4, 0, 0.2, 1],
              }}
              style={{ willChange: "clip-path, opacity, transform" }}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-mono">
                  <Stream.Field fallback={<Skeleton className="h-6 w-48" />}>
                    {data?.name}
                  </Stream.Field>
                </CardTitle>
              </CardHeader>
            </motion.div>
          )}
        </AnimatePresence>

        <CardContent className="p-0">
          <motion.div
            className="relative w-full overflow-hidden"
            style={{ touchAction: "none" }}
            initial={false}
            animate={{ height: isIdle ? 400 : 350 }}
            transition={{
              height: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
            }}
          >
            <Canvas
              shadows
              camera={{
                position: [15, 12, 15],
                fov: 50,
                near: 0.1,
                far: 100,
              }}
              gl={{ antialias: true }}
            >
              <Scene blocks={validBlocks} />
            </Canvas>

            {isLoading && !data && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
                <div className="flex gap-1">
                  <span className="size-2 rounded-sm bg-emerald-500 animate-pulse" />
                  <span className="size-2 rounded-sm bg-emerald-500 animate-pulse [animation-delay:150ms]" />
                  <span className="size-2 rounded-sm bg-emerald-500 animate-pulse [animation-delay:300ms]" />
                </div>
              </div>
            )}

            {isIdle && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-sky-400 to-sky-200">
                <p className="text-sm text-sky-900/70 font-mono">
                  Click a button below to start building
                </p>
              </div>
            )}

            {!isIdle && (
              <div className="absolute bottom-2 left-2 text-[10px] text-white/60 font-mono bg-black/30 px-2 py-1 rounded">
                Drag to rotate · Scroll to zoom
              </div>
            )}
          </motion.div>
        </CardContent>

        <AnimatePresence>
          {!isIdle && (validBlocks.length > 0 || isLoading) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="px-6 py-3 border-t flex gap-4 text-xs text-muted-foreground font-mono"
            >
              <span>🧱 {validBlocks.length} blocks</span>
              {isStreaming && (
                <span className="ml-auto text-emerald-500">Building…</span>
              )}
              {isComplete && (
                <span className="ml-auto text-emerald-500">✓ Complete</span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </Stream.Root>
  );
}
