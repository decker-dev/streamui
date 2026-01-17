"use client";

import { OrbitControls, useTexture } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import type { DeepPartial } from "@stream.ui/react";
import { Stream } from "@stream.ui/react";
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
const DOOR_THICKNESS = 0.2;

const DROP_ANIMATION = {
  height: 10,
  speed: 8,
  threshold: 0.01,
} as const;

function useConfiguredTextures<T extends Record<string, string>>(paths: T) {
  const textures = useTexture(paths);

  React.useLayoutEffect(() => {
    Object.values(textures).forEach((texture) => {
      texture.magFilter = THREE.NearestFilter;
      texture.minFilter = THREE.NearestFilter;
    });
  }, [textures]);

  return textures;
}

function useDropAnimation(baseY: number) {
  const meshRef = React.useRef<THREE.Mesh>(null);
  const [animated, setAnimated] = React.useState(false);
  const startY = React.useRef(baseY + DROP_ANIMATION.height);

  useFrame((_, delta) => {
    if (!meshRef.current || animated) return;
    const currentY = meshRef.current.position.y;
    const newY = THREE.MathUtils.lerp(
      currentY,
      baseY,
      delta * DROP_ANIMATION.speed,
    );
    if (Math.abs(newY - baseY) < DROP_ANIMATION.threshold) {
      meshRef.current.position.y = baseY;
      setAnimated(true);
    } else {
      meshRef.current.position.y = newY;
    }
  });

  return { meshRef, startY: startY.current };
}

interface MinecraftBlockMeshProps {
  block: DeepPartial<MinecraftBlock>;
}

function MinecraftBlockMesh({ block }: MinecraftBlockMeshProps) {
  const baseY = (block.y ?? 0) + 0.5;
  const { meshRef, startY } = useDropAnimation(baseY);

  const textures = useConfiguredTextures({
    grass_top: "/textures/minecraft/grass_top.png",
    grass_side: "/textures/minecraft/grass_side.png",
    dirt: "/textures/minecraft/dirt.png",
    stone: "/textures/minecraft/stone.png",
    cobblestone: "/textures/minecraft/cobblestone.png",
    log_side: "/textures/minecraft/log_side.png",
    log_top: "/textures/minecraft/log_top.png",
    wood: "/textures/minecraft/wood.png",
    leaves: "/textures/minecraft/leaves.png",
    glass: "/textures/minecraft/glass.png",
    brick: "/textures/minecraft/brick.png",
    gold: "/textures/minecraft/gold.png",
    diamond: "/textures/minecraft/diamond.png",
    snow: "/textures/minecraft/snow.png",
    sand: "/textures/minecraft/sand.png",
    water: "/textures/minecraft/water.png",
  });

  const materials = React.useMemo((): THREE.Material | THREE.Material[] => {
    switch (block.type) {
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
      case "cobblestone":
        return new THREE.MeshLambertMaterial({ map: textures.cobblestone });
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
          opacity: 0.8,
        });
      case "brick":
        return new THREE.MeshLambertMaterial({ map: textures.brick });
      case "gold":
        return new THREE.MeshLambertMaterial({ map: textures.gold });
      case "diamond":
        return new THREE.MeshLambertMaterial({ map: textures.diamond });
      case "snow":
        return new THREE.MeshLambertMaterial({ map: textures.snow });
      case "sand":
        return new THREE.MeshLambertMaterial({ map: textures.sand });
      case "water":
        return new THREE.MeshLambertMaterial({
          map: textures.water,
          transparent: true,
          opacity: 0.7,
        });
      default:
        return new THREE.MeshLambertMaterial({ color: "#888888" });
    }
  }, [block.type, textures]);

  React.useEffect(() => {
    return () => {
      if (Array.isArray(materials)) {
        materials.forEach((m) => m.dispose());
      } else {
        materials.dispose();
      }
    };
  }, [materials]);

  if (
    block.x === undefined ||
    block.y === undefined ||
    block.z === undefined ||
    !block.type
  ) {
    return null;
  }

  return (
    <mesh
      ref={meshRef}
      position={[
        block.x - GRID_SIZE / 2 + 0.5,
        startY,
        block.z - GRID_SIZE / 2 + 0.5,
      ]}
      material={materials}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE]} />
    </mesh>
  );
}

function GrassFloor() {
  const textures = useTexture({
    snow: "/textures/minecraft/snow.png",
    grass_snow: "/textures/minecraft/grass_snow.png",
    dirt: "/textures/minecraft/dirt.png",
  });

  React.useEffect(() => {
    Object.values(textures).forEach((texture) => {
      texture.magFilter = THREE.NearestFilter;
      texture.minFilter = THREE.NearestFilter;
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
    });
  }, [textures]);

  const materials = React.useMemo(
    () => [
      new THREE.MeshLambertMaterial({ map: textures.grass_snow }),
      new THREE.MeshLambertMaterial({ map: textures.grass_snow }),
      new THREE.MeshLambertMaterial({ map: textures.snow }),
      new THREE.MeshLambertMaterial({ map: textures.dirt }),
      new THREE.MeshLambertMaterial({ map: textures.grass_snow }),
      new THREE.MeshLambertMaterial({ map: textures.grass_snow }),
    ],
    [textures],
  );

  React.useEffect(() => {
    return () => {
      materials.forEach((m) => m.dispose());
    };
  }, [materials]);

  const floorBlocks = React.useMemo(() => {
    const blocks = [];
    for (let x = 0; x < GRID_SIZE; x++) {
      for (let z = 0; z < GRID_SIZE; z++) {
        blocks.push({ x, z });
      }
    }
    return blocks;
  }, []);

  return (
    <group>
      {floorBlocks.map(({ x, z }) => (
        <mesh
          key={`floor-${x}-${z}`}
          position={[x - GRID_SIZE / 2 + 0.5, -0.5, z - GRID_SIZE / 2 + 0.5]}
          material={materials}
          receiveShadow
        >
          <boxGeometry args={[BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE]} />
        </mesh>
      ))}
    </group>
  );
}

function DoorMesh({ block }: { block: DeepPartial<MinecraftBlock> }) {
  const baseY = (block.y ?? 0) + 0.5;
  const { meshRef, startY } = useDropAnimation(baseY);

  const textures = useConfiguredTextures({
    door_bottom: "/textures/minecraft/door_bottom.png",
    door_top: "/textures/minecraft/door_top.png",
  });

  const material = React.useMemo(() => {
    const texture =
      block.type === "door_bottom" ? textures.door_bottom : textures.door_top;
    return new THREE.MeshLambertMaterial({
      map: texture,
      transparent: true,
      alphaTest: 0.5,
    });
  }, [block.type, textures]);

  React.useEffect(() => {
    return () => material.dispose();
  }, [material]);

  if (
    block.x === undefined ||
    block.y === undefined ||
    block.z === undefined ||
    !block.type
  ) {
    return null;
  }

  return (
    <mesh
      ref={meshRef}
      position={[
        block.x - GRID_SIZE / 2 + 0.5,
        startY,
        block.z - GRID_SIZE / 2 + 0.5,
      ]}
      material={material}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[BLOCK_SIZE, BLOCK_SIZE, DOOR_THICKNESS]} />
    </mesh>
  );
}

interface SceneProps {
  blocks: DeepPartial<MinecraftBlock>[];
}

const Scene = React.memo(function Scene({ blocks }: SceneProps) {
  return (
    <>
      <color attach="background" args={["#5a9cc4"]} />

      <ambientLight intensity={0.4} color="#ffd4a3" />
      <hemisphereLight args={["#ff9966", "#3d5c5c", 0.3]} />
      <directionalLight
        position={[-15, 8, 10]}
        intensity={1.2}
        color="#ff8c42"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />

      <React.Suspense fallback={null}>
        <GrassFloor />
        {blocks.map((block, index) => {
          if (block.type === "door_bottom" || block.type === "door_top") {
            return <DoorMesh key={block.id ?? index} block={block} />;
          }
          return <MinecraftBlockMesh key={block.id ?? index} block={block} />;
        })}
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
});

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
              <div className="absolute inset-0 flex items-center justify-center bg-[#5a9cc4]">
                <p className="text-sm text-white/70 font-mono">
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
              <span>{validBlocks.length} blocks</span>
              {isStreaming && (
                <span className="ml-auto text-emerald-500">Building…</span>
              )}
              {isComplete && (
                <span className="ml-auto text-emerald-500">Complete</span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </Stream.Root>
  );
}
